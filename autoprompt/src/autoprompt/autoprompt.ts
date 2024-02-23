import chalk from "chalk";
import type { Command, Option, OptionValues } from "commander";
import enquirer from "enquirer";
import { camelize, convertStringToOptions } from "../util.js";

const { prompt } = enquirer;

interface ValidOption extends Option {
  long: string;
}

type AutoPromptOptions = {
  // TODO: add support for custom prompter
  prompter?: typeof prompt;
};

export const validateOption = (option: Option): ValidOption => {
  if (!option.long || option.long === undefined) {
    throw new Error("AutoPrompt options (flags) must have a long name");
  }
  // TypeScript doesn't know that we're filtering out the undefined values
  return option as ValidOption;
};

export const buildPrompt = (option: ValidOption) => {
  let inputType = "confirm";
  let hasChoices = false;
  if (option.flags.includes("<string>")) {
    inputType = "input";
  }

  if (option.flags.includes("<number>")) {
    inputType = "numeral";
  }

  if (option.flags.includes("<boolean>")) {
    inputType = "confirm";
  }

  if (option.flags.includes("oneof")) {
    inputType = "select";
    hasChoices = true;
  } else if (option.flags.includes("of")) {
    inputType = "multiselect";
    hasChoices = true;
  }
  return {
    type: inputType,
    name: camelize(option.long.replace("--", "")),
    message: option.description,
    choices: hasChoices ? convertStringToOptions(option.flags) : undefined,
  };
};

export async function autoprompt(
  program: Command,
  autoPromptOpts?: AutoPromptOptions,
): Promise<Command> {
  program.hook(
    "preAction",
    async (_rootCommand: Command, subCommand: Command) => {
      const options = subCommand.options.map(validateOption);
      // subCommand.parseOptions();
      const promptedOptions = await promptForMissingOptions(
        autoPromptOpts?.prompter ?? prompt,
        options,
        subCommand.opts(),
      );

      Object.assign(subCommand.opts(), promptedOptions);
    },
  );
  await program.parseAsync();
  return program;
}

export async function promptForMissingOptions(
  prompter: typeof prompt,
  options: ValidOption[],
  parsedOptions: OptionValues,
): Promise<Partial<OptionValues>> {
  return await prompter(
    options
      .filter((opt) => {
        if (opt.flags.includes("(optional)")) {
          return false;
        }
        // only prompt for options that were not passed in
        const missingValue =
          !parsedOptions[camelize(opt.long.replace("--", ""))];
        if (!missingValue) {
          console.log(
            `${chalk.green("✔")} ${opt.description} · ${
              parsedOptions[camelize(opt.long.replace("--", ""))]
            }`,
          );
        }
        return missingValue;
      })
      .map(buildPrompt),
  );
}
