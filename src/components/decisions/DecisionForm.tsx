import { useState, type FormEvent } from "react";
import type { Decision } from "../../types/decision";

export type DecisionFormData = Omit<Decision, "id">;

type DecisionFormProps = {
  initialValues: DecisionFormData;
  isEditing: boolean;
  projectOptions: string[];
  onCancel: () => void;
  onSubmit: (form: DecisionFormData) => void;
};

export function DecisionForm({ initialValues, isEditing, projectOptions, onCancel, onSubmit }: DecisionFormProps) {
  const [form, setForm] = useState(initialValues);

  function updateField<Key extends keyof DecisionFormData>(field: Key, value: DecisionFormData[Key]) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ ...form, project: form.project.trim(), text: form.text.trim(), reason: form.reason.trim() });
  }

  return (
    <form className="rounded border border-border bg-surface p-6" onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">{isEditing ? "Edit decision" : "Create decision"}</h2>
        <p className="mt-1 text-sm text-text-secondary">
          {isEditing ? "Update the details of this decision." : "Record what was decided and why."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">Date
          <input className="rounded border border-border bg-surface px-3 py-2 font-normal outline-none transition-colors focus:border-primary" onChange={(event) => updateField("date", event.target.value)} required type="date" value={form.date} />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">Project
          <input className="rounded border border-border bg-surface px-3 py-2 font-normal outline-none transition-colors focus:border-primary" list="project-options" onChange={(event) => updateField("project", event.target.value)} required type="text" value={form.project} />
          <datalist id="project-options">
            {projectOptions.map((project) => <option key={project} value={project} />)}
          </datalist>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium md:col-span-2">Decision
          <textarea className="min-h-24 resize-y rounded border border-border bg-surface px-3 py-2 font-normal outline-none transition-colors focus:border-primary" onChange={(event) => updateField("text", event.target.value)} required value={form.text} />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium md:col-span-2">Reason
          <textarea className="min-h-24 resize-y rounded border border-border bg-surface px-3 py-2 font-normal outline-none transition-colors focus:border-primary" onChange={(event) => updateField("reason", event.target.value)} required value={form.reason} />
        </label>
      </div>

      <label className="mt-5 flex items-center gap-3 text-sm font-medium">
        <input checked={form.active} className="h-4 w-4 accent-primary" onChange={(event) => updateField("active", event.target.checked)} type="checkbox" />
        Active decision
      </label>
      <div className="mt-6 flex gap-3">
        <button className="rounded bg-primary px-4 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90" type="submit">{isEditing ? "Save changes" : "Save decision"}</button>
        <button className="rounded border border-border bg-surface px-4 py-2 text-sm transition-opacity hover:opacity-70" onClick={onCancel} type="button">Cancel</button>
      </div>
    </form>
  );
}
