#!/usr/bin/env node
import yargs from 'yargs';

const packageName = require('../package.json').name;

yargs
  .commandDir('commands', {
    extensions: ['js', 'ts'],
  })
  .scriptName(packageName)
  .demandCommand()
  .help().argv;
