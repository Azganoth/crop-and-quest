import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { buildPortraitNameSchema } from "./schema";

describe("buildPortraitNameSchema", () => {
  const schema = buildPortraitNameSchema(10);

  it("accepts valid names within the length limit", () => {
    expect(() => v.parse(schema, { portraitName: "Bob" })).not.toThrow();
    expect(() => v.parse(schema, { portraitName: "Hero_1" })).not.toThrow();
    expect(() => v.parse(schema, { portraitName: "My.Name-1" })).not.toThrow();
  });

  it("rejects empty names", () => {
    expect(() => v.parse(schema, { portraitName: "" })).toThrow("Portrait name is required");
    expect(() => v.parse(schema, { portraitName: "   " })).toThrow("Portrait name is required");
  });

  it("rejects names that exceed the max length", () => {
    expect(() => v.parse(schema, { portraitName: "ThisNameIsWayTooLong" })).toThrow(
      "Max length is 10 characters",
    );
  });

  it("rejects names with invalid characters", () => {
    expect(() => v.parse(schema, { portraitName: "Hero@!" })).toThrow("Invalid characters");
    expect(() => v.parse(schema, { portraitName: "Test#1" })).toThrow("Invalid characters");
    expect(() => v.parse(schema, { portraitName: "Some/Path" })).toThrow("Invalid characters");
    expect(() => v.parse(schema, { portraitName: "Some\\Path" })).toThrow("Invalid characters");
  });
});
