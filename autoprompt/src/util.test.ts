import { expect, test } from "vitest";
import { convertStringToOptions } from "./util";

test("test utils", () => {
	expect(convertStringToOptions("test <oneof:one|two|three>")).toEqual(["one", "two", "three"]);
	expect(convertStringToOptions("test <of:one|two|three>")).toEqual(["one", "two", "three"]);
	expect(convertStringToOptions("test")).toEqual([]);
});