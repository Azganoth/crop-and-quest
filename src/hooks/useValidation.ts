import { useCallback, useState } from "react";
import * as v from "valibot";

export function useValidation<T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  schema: T,
) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(
    (values: unknown) => {
      const result = v.safeParse(schema, values);

      if (result.success) {
        setErrors({});
        return true;
      }

      const newErrors: Record<string, string> = {};
      if (result.issues) {
        for (const issue of result.issues) {
          if (!issue.path) {
            if (!newErrors["root"]) {
              newErrors["root"] = issue.message;
            }
            continue;
          }

          const pathString = issue.path.map((p) => p.key).join(".");
          if (!newErrors[pathString]) {
            newErrors[pathString] = issue.message;
          }
        }
      }

      setErrors(newErrors);
      return false;
    },
    [schema],
  );

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, validate, clearError, clearErrors, setErrors };
}
