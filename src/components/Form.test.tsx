import { renderWithUser } from "@/test/utils";
import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  Form,
  FormField,
  FormFieldControl,
  FormFieldDescription,
  FormFieldError,
  FormFieldLabel,
  FormSubmitButton,
  useAppForm,
} from "./Form";
import { Input } from "./ui/Input";

function TestForm({ onSubmit }: { onSubmit: (val: any) => void }) {
  const form = useAppForm({
    defaultValues: { username: "" },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <form.AppForm>
      <Form data-testid="test-form">
        <form.AppField
          name="username"
          validators={{
            onChange: ({ value }) => (value.length < 3 ? "Too short" : undefined),
          }}
        >
          {(field) => (
            <FormField>
              <FormFieldLabel>Username</FormFieldLabel>
              <FormFieldDescription>Choose a unique name</FormFieldDescription>
              <FormFieldControl>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter name"
                />
              </FormFieldControl>
              <FormFieldError />
            </FormField>
          )}
        </form.AppField>
        <FormSubmitButton>Submit Form</FormSubmitButton>
      </Form>
    </form.AppForm>
  );
}

describe("Form.tsx Integration", () => {
  it("prevents default submission and triggers onSubmit", async () => {
    const mockSubmit = vi.fn();
    const { user } = renderWithUser(<TestForm onSubmit={mockSubmit} />);

    const input = screen.getByLabelText("Username");
    const submitBtn = screen.getByRole("button", { name: "Submit Form" });

    await user.type(input, "Bob");
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ username: "Bob" });
    });
  });

  it("applies aria-invalid and aria-describedby correctly when invalid", async () => {
    const { user } = renderWithUser(<TestForm onSubmit={vi.fn()} />);

    const input = screen.getByLabelText("Username");

    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).toHaveAttribute("aria-describedby", "username-description");

    await user.type(input, "A");
    await user.tab();

    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-describedby", "username-description username-error");
    });

    expect(screen.getByText("Too short")).toBeInTheDocument();
  });

  it("disables the submit button when the form cannot be submitted", async () => {
    const { user } = renderWithUser(<TestForm onSubmit={vi.fn()} />);

    const input = screen.getByLabelText("Username");
    const submitBtn = screen.getByRole("button", { name: "Submit Form" });

    expect(submitBtn).toBeEnabled();

    await user.type(input, "A");

    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });

    await user.type(input, "lice");

    await waitFor(() => {
      expect(submitBtn).toBeEnabled();
    });
  });
});
