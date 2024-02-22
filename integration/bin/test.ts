import { autoprompt } from "autoprompt";
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

  const options = await autoprompt(program);
  console.log(options);
}
main();
