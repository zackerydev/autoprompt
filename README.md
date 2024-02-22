# autoprompt

Simple TypeScript CLI library that bridges the gap between "commander" and "enquirer" . Automatically.

Most of the time when you are building a CLI, you want to use "commander" to parse the command line arguments and "enquirer" to prompt the user for input. This library makes it easy to use both together.


## Getting Started

```bash
# Install autoprompt and peer dependencies

# npm
npm install autoprompt enquirer commander
# yarn
yarn add autoprompt enquirer commander
# pnpm
pnpm add autoprompt enquirer commander
```

## Usage

```typescript
import { autoprompt } from 'autoprompt';
import { program } from 'commander';

program
    .option("-n, --name <string>", "Pizza name")
    .option("-s, --size <number>", "Pizza size")
    .option("-c, --cheese <boolean>", "Add cheese")
    .option("-r, --crust <oneof:hand-tossed|pan|thin>", "Crust type")
    .option(
        "-t, --toppings <of:pepperoni|cheese|sausage|pineapple>",
        "Toppings",
    );

program.parse(process.argv);

const options = new AutoPrompt(program);

```

A couple of things of note that are required for `autoprompt` to work:

- The `autoprompt` function must be called after all the options have been defined.
- All of the program options _must_ have a type specified inside of `<>` after the option name. This is how `autoprompt` knows what type of prompt to use.



