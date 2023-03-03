#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const figlet = __importStar(require("figlet"));
const chalk = require('chalk');
const { Command } = require("commander");
const program = new Command();
const { version } = require('../package.json');
const helpers_1 = require("./helpers");
program
    .version(version)
    .description("CLI Tool to track everyday tasks")
    .option("-i, --init", "Initialize file for today")
    .option("-s, --section <value>", "Section name to add the task to")
    .option("-t, --task <value>", "Task to be added")
    .option("-cs, --create <value>", "Create a new task section")
    .option("-ls, --list", "List tasks for the current day")
    .option("-d, --dir", "Current directory path for task file")
    .option("-l, --link <value>", "Reference links for specific task section")
    .addHelpText('before', chalk.hex('#23c6cc')(figlet.textSync('taskit', { horizontalLayout: 'full' })))
    .parse(process.argv);
const options = program.opts();
if (Object.keys(options).length) {
    optionsParser: {
        if (options.init) {
            (0, helpers_1.initializeTaskFile)();
            break optionsParser;
        }
        if (options.create) {
            console.log(chalk.red('Yet to be implemented'));
            break optionsParser;
        }
        if (options.dir) {
            const cwd = (0, helpers_1.currentDirectory)();
            console.log(chalk.hex('#10b030')(`Current Taskit files directory: ${cwd}`));
        }
        if (options.list) {
            (0, helpers_1.listTasks)();
        }
        if (options.task) {
            (0, helpers_1.addTask)(options.section, options.task);
            break optionsParser;
        }
        if (options.help) {
            console.log(chalk.hex('#23c6cc')(figlet.textSync('taskit', { horizontalLayout: 'full' })));
            program.help();
        }
        if (options.section) {
            console.log(chalk.red(`Please provide the task to add to ${options.section} section...`));
        }
    }
}
else {
    program.help();
}
