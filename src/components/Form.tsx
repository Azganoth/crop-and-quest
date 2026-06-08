"use client";

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Slot } from "radix-ui";
import { Button } from "./ui/Button";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/Field";

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

/**
 * Replaces the native `<form>` element.
 * Automatically prevents default form submission and triggers TanStack's `handleSubmit()`.
 *
 * Must be rendered inside `<form.AppForm>` (which provides the React Context).
 */
function Form(props: React.ComponentPropsWithRef<"form">) {
  const form = useFormContext();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      {...props}
    />
  );
}

function FormField(props: React.ComponentPropsWithRef<typeof Field>) {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return <Field data-invalid={isInvalid} {...props} />;
}

function FormFieldLabel(props: React.ComponentPropsWithRef<typeof FieldLabel>) {
  const field = useFieldContext();

  return <FieldLabel htmlFor={field.name} {...props} />;
}

function FormFieldDescription(props: React.ComponentPropsWithRef<typeof FieldDescription>) {
  const field = useFieldContext();

  return <FieldDescription id={`${field.name}-description`} {...props} />;
}

/**
 * The bridge between TanStack Form state and UI primitives (Input, Switch, Select).
 *
 * Uses Radix `<Slot.Root>` to seamlessly merge ARIA bindings onto the child element:
 * - `id`: Links the input to its `<FormFieldLabel htmlFor="...">`
 * - `aria-invalid`: Announces validation state to screen readers
 * - `aria-describedby`: Links the input to its `<FormFieldDescription id="...">` and
 * `<FormFieldError id="...">` message IDs
 */
function FormFieldControl(props: React.ComponentPropsWithRef<typeof Slot.Root>) {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const descriptionId = `${field.name}-description`;
  const errorId = `${field.name}-error`;

  return (
    <Slot.Root
      id={field.name}
      aria-invalid={isInvalid}
      aria-describedby={isInvalid ? `${descriptionId} ${errorId}` : descriptionId}
      {...props}
    />
  );
}

function FormFieldError(props: React.ComponentPropsWithRef<typeof FieldError>) {
  const field = useFieldContext();

  return <FieldError id={`${field.name}-error`} errors={field.state.meta.errors} {...props} />;
}

function FormSubmitButton({ disabled, ...props }: React.ComponentPropsWithRef<typeof Button>) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={disabled || !canSubmit || isSubmitting} {...props} />
      )}
    </form.Subscribe>
  );
}

function FormGlobalError({ children }: { children: (errors: string[]) => React.ReactNode }) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.errors}>
      {(errors) => {
        const rootErrors = errors
          .flatMap((error) => error?.[""] ?? [])
          .map((error) => (error as any)?.message)
          .filter(Boolean);

        return rootErrors.length === 0 ? null : children(rootErrors);
      }}
    </form.Subscribe>
  );
}

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormField,
    FormFieldControl,
    FormFieldLabel,
    FormFieldDescription,
    FormFieldError,
  },
  formComponents: {
    Form,
    FormSubmitButton,
    FormGlobalError,
  },
});

export {
  Form,
  FormField,
  FormFieldControl,
  FormFieldDescription,
  FormFieldError,
  FormFieldLabel,
  FormGlobalError,
  FormSubmitButton,
  useAppForm,
};
