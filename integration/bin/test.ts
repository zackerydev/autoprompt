import { autoprompt } from "autoprompt";
import { program } from "commander";

interface Pizza {
  name: string;
  size: number;
  cheese: boolean;
  crust: "hand-tossed" | "pan" | "thin";
  "sauce-type": "marinara" | "alfredo";
  toppings: ("pepperoni" | "cheese" | "sausage" | "pineapple")[];
}

async function main() {
  program
    .option("-n, --name <string>", "Pizza name")
    .option("-s, --size <number>", "Pizza size")
    .option("-c, --cheese <boolean>", "Add cheese")
    .option("-r, --crust <oneof:hand-tossed|pan|thin>", "Crust type")
    // test a parameter with a hyphen in it
    .option("-p, --sauce-type <oneof:marinara|alfredo>", "Sauce type")
    .option(
      "-t, --toppings <of:pepperoni|cheese|sausage|pineapple>",
      "Toppings",
    )
    .action((opts: Pizza) => {
      console.log("Pizza ordered!");
      console.log(opts);
    });

  await autoprompt(program);
}
main();
