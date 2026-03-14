const path = require('path');
const fs = require('fs');
const { parseArgs } = require('node:util');

const filePath = path.join(__dirname, 'data.json')

//helper functiosn
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getData = () => JSON.parse(fs.readFileSync(filePath, 'utf8') || []);

//arguments parsers
const options = {

    help: {
        type: 'boolean',
        short: 'h'
    }

};

const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: options,
});


async function baseInfo() {
    console.log("---------------------------TASK-TRACKER---------------------------\n");

    if (!fs.existsSync(filePath)) {
        console.log(`[LOG]: data.json doesn't exists. Creating data.json.`)
        fs.writeFileSync(filePath, JSON.stringify([], null));
        await sleep(1000);
        console.success('[LOG]: File created successfully\n\n');
    }

    pendingTasks = (getData()).filter(task => task.status = 'in-progress');

    console.log(`Welcome Human, You currently have ${pendingTasks.length} tasks in your List`);

}


async function mainMenu() {
    if (positionals.length == 0) {
        await baseInfo();
    }
}


mainMenu();