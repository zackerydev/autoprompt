import { Command, program } from "commander";
import { expect, test, vi } from "vitest";
import { autoprompt } from "../";

const pizza = program
  .option("-d, --debug", "output extra debugging")
  .option("-u, --stuffed-crust <boolean>", "stuffed crust")
  .option("-p, --pizza-type <string>", "flavour of pizza")
  .option("-s, --pizza-size <number>", "flavour of pizza")
  .option("-c, --crust <oneof:thin|pan|hand-tossed>", "type of crust")
  .option("-t, --toppings <of:pepperoni|cheese|sausage|pineapple>", "Toppings");

test("init autoprompt with a command command", async () => {
  process.argv = ["node", "test", "-d"];
  const prompter = vi.fn().mockResolvedValue({ debug: true });
  const ap = await autoprompt(pizza, {
    prompter: prompter as any,
  });

  expect(ap).toBeDefined();

  expect(prompter).toMatchInlineSnapshot(`
    [MockFunction spy] {
      "calls": [
        [
          [
            {
              "choices": undefined,
              "message": "stuffed crust",
              "name": "stuffed-crust",
              "type": "confirm",
            },
            {
              "choices": undefined,
              "message": "flavour of pizza",
              "name": "pizza-type",
              "type": "input",
            },
            {
              "choices": undefined,
              "message": "flavour of pizza",
              "name": "pizza-size",
              "type": "numeral",
            },
            {
              "choices": [
                "thin",
                "pan",
                "hand-tossed",
              ],
              "message": "type of crust",
              "name": "crust",
              "type": "select",
            },
            {
              "choices": [
                "pepperoni",
                "cheese",
                "sausage",
                "pineapple",
              ],
              "message": "Toppings",
              "name": "toppings",
              "type": "multiselect",
            },
          ],
        ],
      ],
      "results": [
        {
          "type": "return",
          "value": {
            "debug": true,
          },
        },
      ],
    }
  `);
});

test("init with default prompt", () => {
  const ap = autoprompt(pizza);
  expect(ap).toBeDefined();
});

test("throws error when program is missing long options", async () => {
  await expect(
    async () =>
      await autoprompt(new Command().option("-d"), {
        prompter: vi.fn(() => {
          /**stub */
        }) as any,
      }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    "[Error: AutoPrompt options (flags) must have a long name]",
  );
});
