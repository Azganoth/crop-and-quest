import * as v from "valibot";

export const buildPortraitNameSchema = (maxLength: number) =>
  v.object({
    portraitName: v.pipe(
      v.string(),
      v.trim(),
      v.regex(
        /^[a-zA-Z0-9.\-_ ]*$/,
        "Invalid characters (only letters, numbers, spaces, dots, dashes, and underscores)",
      ),
      v.minLength(1, "Portrait name is required"),
      v.maxLength(maxLength, `Max length is ${maxLength} characters`),
    ),
  });
