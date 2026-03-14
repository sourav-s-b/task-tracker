#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { parseArgs } = require('node:util');

//helpful constants
const filePath = path.join(__dirname, 'data.json');
const STATUS = ["todo", "in-progress", "done"];
const BLUE = "\x1b[34m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";



//helper functiosn
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getData = () => JSON.parse(fs.readFileSync(filePath, 'utf8') || []);
const log = {
    info: (msg) => console.log(`${BLUE}[INFO] ${msg}${RESET}`),
    success: (msg) => console.log(`${GREEN}[SUCCESS] ${msg}${RESET}`),
    error: (msg) => console.log(`${RED}[ERROR] ${msg}${RESET}`),
    title: (msg) => console.log(`${YELLOW}[MSG] ${msg}${RESET}`)
};

function showHelp() {
    console.log(`
        ${YELLOW}TASK TRACKER - MANUAL${RESET}
        ================================================
        ${BLUE}USAGE:${RESET}
        ttrack <command> [arguments] [flags]

        ${BLUE}COMMANDS:${RESET}
        ${GREEN}add${RESET} <description>          Add a new task
        ${GREEN}update${RESET} <id> <description>   Update a task description
        ${GREEN}delete${RESET} <id>               Delete a task by ID
        ${GREEN}list${RESET} [status]              List tasks (optional: todo, in-progress, done)
        ${GREEN}mark-in-progress${RESET} <id>     Set status to in-progress
        ${GREEN}mark-done${RESET} <id>            Set status to done
        ${GREEN}mark-todo${RESET} <id>            Set status back to todo

        ${BLUE}FLAGS:${RESET}
        ${YELLOW}-l, --limit${RESET} <number>      Limit the number of tasks shown
        ${YELLOW}-d, --description${RESET}        Show only the description column
        ${YELLOW}-s, --status${RESET}             Show only the status column

        ================================================
    `);
}

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

    log.info("use -help for manual or instruction on how to use the commands")

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
    let date = new Date();
    let dataList = getData();
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
    let date = new Date();
    log.info(`Updating Row with id ${id}`);
    let dataList = getData();
    let dataIndex = dataList.findIndex(task => task.id === id);

    if (dataIndex == -1) {
        log.error(`Can't find any task with the given id: ${id}`);
        return;
    }

    dataList[dataIndex].description = desc;
    dataList[dataIndex].updatedAt = date.toLocaleString();

    fs.writeFileSync(filePath, JSON.stringify(dataList, null, 2));

    log.success("Updation has been successfull");
    console.table([dataList[dataIndex]]);
}

function deleteTask(id) {
    let date = new Date();
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

function markTask(id, status) {
    let date = new Date();
    log.info(`Marking Row with id ${id}`);
    let dataList = getData();
    let dataIndex = dataList.findIndex(task => task.id === id);

    if (dataIndex == -1) {
        log.error(`Can't find any task with the given id: ${id}`);
        return;
    }

    dataList[dataIndex].status = status;
    dataList[dataIndex].updatedAt = date.toLocaleString();

    fs.writeFileSync(filePath, JSON.stringify(dataList, null, 2));

    log.success("Updation of status has been successfull");
    console.table([dataList[dataIndex]]);
}

async function mainMenu() {

    log.info("Intializing");
    await sleep(500);
    if (!fs.existsSync(filePath)) {
        log.info("data.json doesn't exists. Creating data.json.");
        fs.writeFileSync(filePath, JSON.stringify([], null));
        await sleep(1000);
        log.success('File created successfully\n');
    }
    log.success("Done\n");
    log.title("Welcome to Task Tracker\n");

    if ("help" in values) {
        showHelp();
        return;
    }

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
                if (positionals.length != 3) {
                    log.error("You have incorrect parameters for an updation. Please read help for instructions");
                    break;
                }
                let [id, desc] = positionals.slice(-2);
                updateTask(Number(id), desc);
                break;
            case "delete": {
                if (positionals.length != 2) {
                    log.error("You have insufficient parameters for an deletion. Please read help for instructions");
                    break;
                }
                let id = positionals[1];
                deleteTask(Number(id));
                break;
            }
            default:
                if (positionals[0].includes("mark")) {
                    if (positionals.length < 2) {
                        log.error("You have insufficient parameters for an marking. Please read help for instructions");
                        break;
                    }

                    let status = positionals[0].slice(5);
                    if (!STATUS.includes(status)) {
                        log.error(`Invalid status: ${status}. Use: ${STATUS.join(', ')}`);
                        break;
                    }
                    let id = positionals[1];
                    markTask(Number(id), status);
                    break;
                } else {
                    log.error("Unkown command. Please read help for instructions");
                    break;
                }
        }
    }
}


mainMenu();