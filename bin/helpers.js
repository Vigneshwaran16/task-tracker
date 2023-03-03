"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTasks = exports.addTask = exports.currentDirectory = exports.initializeTaskFile = void 0;
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const chalk = require('chalk');
const fs = require('fs');
const defaultSections = ['TODO', 'Questions', 'Bugs/Issues'];
const taskDir = process.env.CURRENT_TASKIT_DIR;
const indentSpace = ' '.repeat(2);
const colorSchemes = {
    FILE_CREATION: '#10b030',
    SECTION_NAME: '#FF00FF',
    TASK_INCOMPLETE: '#f2ba49',
    TASK_COMPLETE: '#10b030',
    LINKS: '#0dcaf0'
};
const initializeTaskFile = () => {
    return new Promise((resolve, reject) => {
        let todayDate;
        let date = spawn('date', ['+%d-%m-%Y']);
        date.stdout.on('data', (data) => {
            // console.log(data.toString())
            todayDate = data.toString().trim();
            let filePath = `${taskDir}/${data.toString().trim()}.txt`;
            if (fs.existsSync(filePath)) {
                console.log(chalk.red(`Task file already initialized at ${filePath}`));
            }
            else {
                let file = spawn('touch', [`${filePath}`]);
                file.on('exit', () => {
                    console.log(chalk.hex(colorSchemes.FILE_CREATION)(`File ${data.toString().trim()}.txt created with default sections...`));
                });
                setTimeout(() => {
                    let fileStream = fs.createWriteStream(`${filePath}`, { flags: 'a' });
                    for (let section of defaultSections) {
                        fileStream.write(`[${section}]`);
                        fileStream.write('\n\n');
                    }
                    fileStream.end('\n');
                }, 100);
            }
        });
    });
};
exports.initializeTaskFile = initializeTaskFile;
const currentDirectory = () => {
    return process.env.CURRENT_TASKIT_DIR;
};
exports.currentDirectory = currentDirectory;
const addTask = (taskSection, task = "New Task") => {
    const isDefault = !taskSection ? true : false;
    isDefault && console.log('Adding task to default section...');
    spawn('date', ['+%d-%m-%Y'])
        .stdout.on('data', (date) => {
        let currentFile = `${date.toString().trim()}.txt`;
        let grep = exec(`grep -n -F "[${isDefault ? 'TODO' : taskSection}]" ${taskDir}/${currentFile} | sed 's/\\n//g'`, (err) => {
            if (err) {
                console.log(chalk.red('Error adding task to taskfile...'));
            }
        });
        grep.stdout.on('data', (data) => {
            console.log('matched', data.toString());
            let matchedLines = data.toString().trim().split('\n');
            let fileContents = fs.readFileSync(`${taskDir}/${currentFile}`).toString().split("\n");
            let taskLine = `${indentSpace}-- ${task}` + ((isDefault || taskSection === 'TODO') ? '  []' : '');
            fileContents.splice(parseInt(matchedLines[0]), 0, taskLine);
            let updatedFileContents = fileContents.join("\n");
            fs.writeFile(`${taskDir}/${currentFile}`, updatedFileContents, function (err) {
                if (err)
                    console.log(err);
            });
        });
    });
};
exports.addTask = addTask;
const listTasks = () => {
    spawn('date', ['+%d-%m-%Y'])
        .stdout.on('data', (date) => {
        let currentFile = `${taskDir}/${date.toString().trim()}.txt`;
        exec(`cat ${currentFile}`)
            .stdout.on('data', (fileContents) => {
            let fileLines = fileContents.toString().trim().split('\n');
            for (let index in fileLines) {
                if (fileLines[index].match(/^\[[a-zA-Z0-9_/()]+\]$/i)) {
                    console.log(chalk.magenta(fileLines[index].replace(/[|]/g, '')));
                }
                else {
                    let completionStatus = false;
                    let statusIndication = fileLines[index].slice(-2);
                    statusIndication === '*]' ? completionStatus = true : completionStatus = false;
                    console.log(chalk.hex(completionStatus ? colorSchemes.TASK_COMPLETE : colorSchemes.TASK_INCOMPLETE)(fileLines[index]));
                }
            }
        });
    });
};
exports.listTasks = listTasks;
