#!/usr/bin/env node

import { Command } from 'commander';
import { join } from 'path';

const program = new Command();
console.log('running backroad cli');
program.name('backroad').description('Run a backroad script in dev mode');

program.command('run <file>').action((file) => {
  const targetScriptPath = join(process.cwd(), file);
  // console.log(`Running`,__dirname,file,process.cwd())
  // start the dev server pasing the script as an arguement
});

program.parse();
// export default program
