#!/usr/bin/env node

import * as figlet from 'figlet'
const chalk = require('chalk')
const { Command } = require("commander");
const program = new Command();
const { version } = require('../package.json')
import { addTask, currentDirectory, initializeTaskFile, listTasks } from './helpers'

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
  .addHelpText('before',
    chalk.hex('#23c6cc')(
        figlet.textSync('taskit', { horizontalLayout: 'full'})
    )
  )
  .parse(process.argv);

const options = program.opts();

if(Object.keys(options).length) {
    optionsParser: { 
        if(options.init) {
            initializeTaskFile()
            break optionsParser;
        }
        if(options.create) {
            console.log(
                chalk.red('Yet to be implemented')
            );
            break optionsParser;
        }
        
        if(options.dir) {
            const cwd = currentDirectory()
            console.log(chalk.hex('#10b030')(`Current Taskit files directory: ${cwd}`));
        }

        if(options.list) {
            listTasks()
        }
        
        if(options.task) {
            addTask(options.section, options.task)
            break optionsParser;
        }

        if(options.help) {
            console.log(
                chalk.hex('#23c6cc')(
                    figlet.textSync('taskit', { horizontalLayout: 'full'})
                )
            )
            program.help()
        }

        if(options.section) {
            console.log(
                chalk.red(`Please provide the task to add to ${options.section} section...`)
            )
        }
    }
}
else {
    program.help()
}