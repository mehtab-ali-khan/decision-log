import { AlertCircle, X } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import type { Decision } from "../../types/decision";
import { Combobox } from "../ui/Combobox";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Modal } from "../ui/Modal";
import { getProjectStyle } from "./projectStyle";

export type DecisionFormData = Omit<Decision, "id">;

type FieldName = "date" | "project" | "text" | "reason";
type FormErrors = Partial<Record<FieldName, string>>;

type DecisionFormProps = {
  initialValues: DecisionFormData;
  isEditing: boolean;
  onCancel: () => void;
  onSubmit: (form: DecisionFormData) => void;
  projectOptions: string[];
};

const MIN_TEXT_LENGTH = 3;

function validate(form: DecisionFormData): FormErrors {
  const errors: FormErrors = {};

  if (!form.date) errors.date = "Pick a date";
  if (form.project.trim().length === 0) errors.project = "Add a project";
  if (form.text.trim().length < MIN_TEXT_LENGTH) errors.text = "Add the decision";
  if (form.reason.trim().length < MIN_TEXT_LENGTH) errors.reason = "Add the reason";

  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p className="ui-error animate-fade-in" id={id}>
      <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0" />
      {message}
    </p>
  );
}

export function DecisionForm({
  initialValues,
  isEditing,
  onCancel,
  onSubmit,
  projectOptions,
}: DecisionFormProps) {
  const [form, setForm] = useState(initialValues);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);
  const fieldId = useId();

  const errors = validate(form);
  const isDirty = JSON.stringify(form) !== JSON.stringify(initialValues);

  function showError(field: FieldName): string | undefined {
    return submitAttempted || touched[field] ? errors[field] : undefined;
  }

  function updateField<Key extends keyof DecisionFormData>(field: Key, value: DecisionFormData[Key]) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function requestClose() {
    if (isDirty) setConfirmingDiscard(true);
    else onCancel();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    if (Object.keys(errors).length > 0) return;

    onSubmit({
      ...form,
      project: form.project.trim(),
      text: form.text.trim(),
      reason: form.reason.trim(),
    });
  }

  return (
    <>
      <Modal
        labelledBy={`${fieldId}-title`}
        onClose={requestClose}
        panelClassName="max-h-[calc(100dvh_-_2rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] max-w-xl sm:max-h-[90vh]"
      >
        <form className="flex min-h-0 flex-1 flex-col" noValidate onSubmit={handleSubmit}>
          <header className="flex items-start justify-between gap-4 border-b border-border/70 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-h2 text-text-primary" id={`${fieldId}-title`}>
                {isEditing ? "Edit decision" : "New decision"}
              </h2>
              <p className="mt-1 text-small text-text-secondary">
                {isEditing
                  ? "Update the details of this decision."
                  : "Record what was decided and why."}
              </p>
            </div>
            <button
              aria-label="Close"
              className="ui-button-icon -mr-1.5"
              onClick={requestClose}
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="ui-label" htmlFor={`${fieldId}-date`}>
                  Date
                </label>
                <input
                  aria-describedby={showError("date") ? `${fieldId}-date-error` : undefined}
                  aria-invalid={showError("date") ? true : undefined}
                  className={`ui-input ui-date ${showError("date") ? "ui-input-invalid" : ""}`}
                  id={`${fieldId}-date`}
                  onBlur={() => setTouched((current) => ({ ...current, date: true }))}
                  onChange={(event) => updateField("date", event.target.value)}
                  type="date"
                  value={form.date}
                />
                <FieldError id={`${fieldId}-date-error`} message={showError("date")} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="ui-label" htmlFor={`${fieldId}-project`}>
                  Project
                </label>
                <Combobox
                  describedBy={showError("project") ? `${fieldId}-project-error` : undefined}
                  id={`${fieldId}-project`}
                  invalid={Boolean(showError("project"))}
                  onChange={(value) => {
                    updateField("project", value);
                    setTouched((current) => ({ ...current, project: true }));
                  }}
                  options={projectOptions}
                  placeholder="Choose or create..."
                  renderOption={(option) => (
                    <>
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 flex-shrink-0 rounded-full ${getProjectStyle(option).dot}`}
                      />
                      {option}
                    </>
                  )}
                  value={form.project}
                />
                <FieldError id={`${fieldId}-project-error`} message={showError("project")} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="ui-label" htmlFor={`${fieldId}-text`}>
                Decision
              </label>
              <textarea
                aria-describedby={
                  showError("text") ? `${fieldId}-text-error` : `${fieldId}-text-hint`
                }
                aria-invalid={showError("text") ? true : undefined}
                className={`ui-textarea min-h-[84px] ${showError("text") ? "ui-input-invalid" : ""}`}
                id={`${fieldId}-text`}
                onBlur={() => setTouched((current) => ({ ...current, text: true }))}
                onChange={(event) => updateField("text", event.target.value)}
                placeholder="e.g., We will use React for the UI"
                value={form.text}
              />
              {showError("text") ? (
                <FieldError id={`${fieldId}-text-error`} message={showError("text")} />
              ) : (
                <p className="ui-hint" id={`${fieldId}-text-hint`}>
                  Keep it short. Details go in the reason.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="ui-label" htmlFor={`${fieldId}-reason`}>
                Reason
              </label>
              <textarea
                aria-describedby={showError("reason") ? `${fieldId}-reason-error` : undefined}
                aria-invalid={showError("reason") ? true : undefined}
                className={`ui-textarea ${showError("reason") ? "ui-input-invalid" : ""}`}
                id={`${fieldId}-reason`}
                onBlur={() => setTouched((current) => ({ ...current, reason: true }))}
                onChange={(event) => updateField("reason", event.target.value)}
                placeholder="Why did we choose this?"
                value={form.reason}
              />
              <FieldError id={`${fieldId}-reason-error`} message={showError("reason")} />
            </div>

            <div className="ui-surface-inset flex items-start justify-between gap-4 p-3.5">
              <span>
                <span className="block text-small font-medium text-text-primary" id={`${fieldId}-active-label`}>
                  Active decision
                </span>
                <span className="mt-0.5 block text-caption text-text-secondary">
                  Mark as inactive if it's been superseded.
                </span>
              </span>
              <button
                aria-checked={form.active}
                aria-labelledby={`${fieldId}-active-label`}
                className={`ui-focus relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                  form.active ? "bg-success" : "bg-border"
                }`}
                onClick={() => updateField("active", !form.active)}
                role="switch"
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-4 w-4 transform rounded-full bg-surface shadow-raised transition-transform ${
                    form.active ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <footer className="flex items-center justify-end gap-2.5 border-t border-border/70 px-5 py-4 sm:px-6">
            <button className="ui-button-secondary" onClick={requestClose} type="button">
              Cancel
            </button>
            <button className="ui-button-primary px-5" type="submit">
              {isEditing ? "Save changes" : "Save decision"}
            </button>
          </footer>
        </form>
      </Modal>

      {confirmingDiscard && (
        <ConfirmDialog
          cancelLabel="Keep editing"
          confirmLabel="Discard"
          description="You have unsaved changes."
          onCancel={() => setConfirmingDiscard(false)}
          onConfirm={onCancel}
          title="Discard changes?"
          tone="danger"
        />
      )}
    </>
  );
}
