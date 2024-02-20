import chalk from "chalk";
import type { Command, Option } from "commander";
import { prompt } from "enquirer";
import { convertStringToOptions } from "../util.js";

interface ValidOption extends Option {
	long: string;
}

type AutoPromptOptions = {
	quiet?: boolean;
	// TODO: add support for custom prompter
	prompter?: typeof prompt;
	logger?: { log: (...data: unknown[]) => void };
};

export class AutoPrompt {
	public autoPromptOpts: AutoPromptOptions;
	public cmd: Command;
	// raw options passed into the command
	readonly options: ValidOption[];
	// parsed options
	parsedOptions: unknown[];

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private logger: { log: (...data: any[]) => void };

	private prompter: typeof prompt;

	constructor(
		cmd: Command,
		autoPromptOpts: AutoPromptOptions = {
			quiet: false,
			prompter: prompt,
			logger: { log: console.log },
		},
	) {
		this.cmd = cmd;
		this.logger = autoPromptOpts.logger ?? { log: console.log };
		this.autoPromptOpts = autoPromptOpts;
		this.prompter = autoPromptOpts.prompter as typeof prompt;
		// clone the options so we can modify them
		this.options = [...this.cmd.options.map(AutoPrompt.validateOption)];

		this.cmd.parse();
		this.parsedOptions = this.cmd.opts();

		if (this.autoPromptOpts.quiet) {
			this.logger = {
				log: () => {
					/** quiet mode no log */
				},
			} as typeof console;
		}
	}

	static validateOption = (option: Option): ValidOption => {
		if (!option.long || option.long === undefined) {
			throw new Error("AutoPrompt options (flags) must have a long name");
		}
		// TypeScript doesn't know that we're filtering out the undefined values
		return option as ValidOption;
	};

	// this needs to return a prompt option object
	// it is not strongly typed for now because enquirer
	// does not ship the type.
	static buildPrompt = (option: ValidOption) => {
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
			name: option.long.replace("--", ""),
			message: option.description,
			choices: hasChoices ? convertStringToOptions(option.flags) : undefined,
		};
	};

	async prompt() {
		await this.prompter(
			this.options
				.filter((opt) => {
					// only prompt for options that were not passed in
					const missingValue =
						!this.parsedOptions[
							opt.long.replace("--", "") as keyof typeof this.parsedOptions
						];
					if (!missingValue) {
						this.logger.log(
							`${chalk.green("✔")} ${opt.description} · ${
								this.parsedOptions[
									opt.long.replace("--", "") as keyof typeof this.parsedOptions
								]
							}`,
						);
					}
					return missingValue;
				})
				.map(AutoPrompt.buildPrompt),
		);
	}
}
