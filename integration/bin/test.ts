import { AutoPrompt } from "autoprompt";
import { program } from "commander";

async function main() {
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

	const autoPrompt = new AutoPrompt(program);

	await autoPrompt.prompt();
}
main();
