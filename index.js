const path = require('path');
const fs = require('fs');
const { parseArgs } = require('node:util');

//helpful constants
const filePath = path.join(__dirname, 'data.json');
const STATUS = ["todo", "in-progress", "done"]; const F_BLUE = "\x1b[34m";
const F_GREEN = "\x1b[32m";
const F_RED = "\x1b[31m";
const F_YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";



//helper functiosn
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getData = () => JSON.parse(fs.readFileSync(filePath, 'utf8') || []);
const log = {
    info: (msg) => console.log(`${F_BLUE}[INFO] ${msg}${RESET}`),
    success: (msg) => console.log(`${F_GREEN}[SUCCESS] ${msg}${RESET}`),
    error: (msg) => console.log(`${F_RED}[ERROR] ${msg}${RESET}`),
    title: (msg) => console.log(`${F_YELLOW}[MSG] ${msg}${RESET}`)
};

//arguments parsers
const options = {

    'help': {
        type: 'boolean',
        short: 'h'
    },

    'limit': {
        type: 'string',
        short: 'l',
    },

    'description': {
        type: 'boolean',
        short: 'd',
    },
    'status': {
        type: 'boolean',
        short: 's',
    },


};

const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: options,
});


// COMMAND functions

async function baseInfo() {
    console.log("---------------------------TASK-TRACKER---------------------------\n");

    let pendingTasks = (getData()).filter(task => task.status == 'in-progress');

    console.log(`Welcome Human, You currently have ${pendingTasks.length} pending  tasks in your List`);
    if (pendingTasks.length == 0) {
        console.log(`Please use this task tracker to catalog your tasks`);
    } else {
        log.info("Showing latest pending task");
        console.table(pendingTasks.slice(-5).reverse());
    }


    console.log("---------------------------TASK-TRACKER---------------------------\n");
}

async function listTask(dataList = getData()) {
    let li;

    if ("description" in values || "status" in values) {
        li = ["id"];
        if ("description" in values) li.push("description");
        if ("status" in values) li.push("status");
    }

    if ("limit" in values) {
        dataList = dataList.slice(-1 * Number(values.limit)).reverse();
    }

    if (dataList.length == 0) {
        log.info("Empty table, Please try to add tasks, or do another command");
    } else {
        console.table(dataList, li);
    }
}

function addTask(description) {
    let dataList = getData();
    let date = new Date();
    let addData = {
        id: dataList.length != 0 ? dataList.at(-1).id + 1 : 1,
        description: description,
        status: "todo",
        createdAt: date.toLocaleString(),
        updatedAt: date.toLocaleString(),
    }
    dataList.push(addData);
    console.table([addData]);
    fs.writeFileSync(filePath, JSON.stringify(dataList, null, 2));

    log.success("Added data to the task list successfully!");
}

function updateTask(id, desc) {
    log.info(`Updating Row with id ${id}`);
    let dataList = getData();
    let dataIndex = dataList.findIndex(task => task.id === id);

    if (dataIndex == -1) {
        log.error(`Can't find any task with the given id: ${id}`);
        return;
    }

    dataList[dataIndex].description = desc;

    fs.writeFileSync(filePath, JSON.stringify(dataList, null, 2));

    log.success("Updation has been successfull");
    console.table([dataList[dataIndex]]);
}

function deleteTask(id) {
    log.info(`Deleting Row with id ${id}`);
    let dataList = getData();
    let dataIndex = dataList.findIndex(task => task.id === id);

    if (dataIndex == -1) {
        log.error(`Can't find any task with the given id: ${id}`);
        return;
    }

    dataList.splice(dataIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(dataList, null, 2));
    log.success("Deletion has been successfull");
}

async function mainMenu() {

    log.info("Intializing");
    await sleep(500);
    if (!fs.existsSync(filePath)) {
        log.info("data.json doesn't exists. Creating data.json.");
        fs.writeFileSync(filePath, JSON.stringify([], null));
        await sleep(1000);
        log.success('File created successfully\n\n');
    }
    log.success("Done\n");
    log.title("Welcome to Task Tracker\n\n");

    if (positionals.length == 0) {
        await baseInfo();
    } else {
        switch (positionals[0]) {
            case "add":
                if (positionals.length < 2) {
                    log.error("Need Task description for adding task");
                    break;
                }
                addTask(positionals[1]);
                break;
            case "list":
                let sortedList;
                if (STATUS.includes(positionals[1])) {
                    sortedList = getData().filter(task => task.status === positionals[1]);
                }
                listTask(sortedList);
                break;
            case "update":
                if (positionals.length < 3) {
                    log.error("You have insufficient parameters for an updation. Please read help for instructions");
                    break;
                }
                let [id, desc] = positionals.slice(-2);
                updateTask(Number(id), desc);
                break;
            case "delete": {
                if (positionals.length < 2) {
                    log.error("You have insufficient parameters for an deletion. Please read help for instructions");
                    break;
                }
                let id = positionals.slice(-1);
                deleteTask(Number(id));
                break;
            }

        }
    }
}


mainMenu();