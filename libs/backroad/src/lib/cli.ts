#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();
console.log('running backroad cli');
program.name('backroad-core').description('Run a backroad script in dev mode');

program.command('push').action(() => {
  console.log('coming soon 💫');
});
program.parse();
