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

interface Pizza {
    name: string;
    size: number;
    cheese: boolean;
    crust: "hand-tossed" | "pan" | "thin";
    toppings: ("pepperoni" | "cheese" | "sausage" | "pineapple")[];
}

program
    .option("-n, --name <string>", "Pizza name")
    .option("-s, --size <number>", "Pizza size")
    .option("-c, --cheese <boolean>", "Add cheese")
    .option("-r, --crust <oneof:hand-tossed|pan|thin>", "Crust type")
    .option(
        "-t, --toppings <of:pepperoni|cheese|sausage|pineapple>",
        "Toppings",
    ).action((opts: Pizza) => {
        console.log(opts);
    });

program.parse(process.argv);

// prompt the user for options not provided on the command line
await autoprompt(program);

/**
    * {
    *   name: "Pepperoni",
    *   size: 12,
    *   cheese: true,
    *   crust: "hand-tossed",
    *   toppings: ["pepperoni", "cheese"]
    * }
*/

```

A couple of things of note that are required for `autoprompt` to work:

- The `autoprompt` function must be called after all the options have been defined.
- All of the program options _must_ have a type specified inside of `<>` after the option name. This is how `autoprompt` knows what type of prompt to use.
- Pass a template type to `autoprompt` that is a combination of the `Command` and `Enquirer` options in order for the return type to be correct.

## Limitations

Right now `autoprompt` only supports the following types/prompts:

- `string` -> `input`
- `number` -> `numeral`
- `boolean` -> `confirm`
- `oneof:<values>` -> `select`
- `of:<values>` -> `multiselect`

PRs are welcome to add more types/prompts!

## Contributing

This repo uses `biome` and `pnpm`.

```bash
# Install dependencies
pnpm install

# Tests
pnpm -r test

# Biome Check
pnpm -r check

# Biome Apply Fixes
pnpm -r check --apply

# Build
pnpm -r build

# Start Build in Watch Mode

pnpm -F autoprompt start

# Run the test CLI
pnpm -F integration tsx bin/test.ts
pnpm -F integration tsx bin/test.ts --name "hi"

```
