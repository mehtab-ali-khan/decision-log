import { useEffect, useMemo, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { getProjects } from "../api/projects";
import { useDecisions } from "../hooks/useDecisions";
import type { Decision } from "../types/decision";

const PAGE_SIZE = 10;

type DecisionFormData = {
  date: string;
  project: string;
  text: string;
  reason: string;
  active: boolean;
};

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function getNextProjectName(projects: string[]): string {
  const highestProjectNumber = projects.reduce((highest, project) => {
    const match = project.match(/^Project(\d+)$/i);
    const number = match ? Number(match[1]) : 0;
    return Math.max(highest, number);
  }, 0);

  return `Project${highestProjectNumber + 1}`;
}

function createInitialForm(project = "Project1"): DecisionFormData {
  return { date: getToday(), project, text: "", reason: "", active: true };
}

function getFormData(decision: Decision): DecisionFormData {
  return {
    date: decision.date,
    project: decision.project,
    text: decision.text,
    reason: decision.reason,
    active: decision.active,
  };
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(`${date}T00:00:00`),
  );
}

function DecisionTableSkeleton() {
  return (
    <div className="overflow-hidden rounded border border-border bg-surface">
      <div className="grid grid-cols-6 gap-4 border-b border-border px-4 py-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="h-4 animate-pulse rounded bg-border" key={index} />
        ))}
      </div>
      {Array.from({ length: 5 }, (_, index) => (
        <div
          className="grid grid-cols-6 gap-4 border-b border-border px-4 py-5 last:border-b-0"
          key={index}
        >
          {Array.from({ length: 6 }, (_, cellIndex) => (
            <div
              className="h-4 animate-pulse rounded bg-border"
              key={cellIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function DecisionForm({
  initialValues,
  isEditing,
  projectOptions,
  onCancel,
  onSubmit,
}: {
  initialValues: DecisionFormData;
  isEditing: boolean;
  projectOptions: string[];
  onCancel: () => void;
  onSubmit: (form: DecisionFormData) => void;
}) {
  const [form, setForm] = useState(initialValues);

  function updateField<Key extends keyof DecisionFormData>(
    field: Key,
    value: DecisionFormData[Key],
  ) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      ...form,
      project: form.project.trim(),
      text: form.text.trim(),
      reason: form.reason.trim(),
    });
  }

  return (
    <form className="rounded border border-border bg-surface p-6" onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          {isEditing ? "Edit decision" : "Create decision"}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          {isEditing
            ? "Update the details of this decision."
            : "Record what was decided and why."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Date
          <input
            className="rounded border border-border bg-surface px-3 py-2 font-normal outline-none transition-colors focus:border-primary"
            onChange={(event) => updateField("date", event.target.value)}
            required
            type="date"
            value={form.date}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Project
          <input
            className="rounded border border-border bg-surface px-3 py-2 font-normal outline-none transition-colors focus:border-primary"
            list="project-options"
            onChange={(event) => updateField("project", event.target.value)}
            required
            type="text"
            value={form.project}
          />
          <datalist id="project-options">
            {projectOptions.map((project) => (
              <option key={project} value={project} />
            ))}
          </datalist>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium md:col-span-2">
          Decision
          <textarea
            className="min-h-24 resize-y rounded border border-border bg-surface px-3 py-2 font-normal outline-none transition-colors focus:border-primary"
            onChange={(event) => updateField("text", event.target.value)}
            required
            value={form.text}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium md:col-span-2">
          Reason
          <textarea
            className="min-h-24 resize-y rounded border border-border bg-surface px-3 py-2 font-normal outline-none transition-colors focus:border-primary"
            onChange={(event) => updateField("reason", event.target.value)}
            required
            value={form.reason}
          />
        </label>
      </div>

      <label className="mt-5 flex items-center gap-3 text-sm font-medium">
        <input
          checked={form.active}
          className="h-4 w-4 accent-primary"
          onChange={(event) => updateField("active", event.target.checked)}
          type="checkbox"
        />
        Active decision
      </label>

      <div className="mt-6 flex gap-3">
        <button
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90"
          type="submit"
        >
          {isEditing ? "Save changes" : "Save decision"}
        </button>
        <button
          className="rounded border border-border bg-surface px-4 py-2 text-sm transition-opacity hover:opacity-70"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function DeleteDialog({
  decision,
  onCancel,
  onConfirm,
}: {
  decision: Decision;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-text-primary/40 px-page">
      <section
        aria-modal="true"
        className="w-full max-w-md rounded border border-border bg-surface p-6 shadow-lg"
        role="dialog"
      >
        <h2 className="text-lg font-semibold">Delete this decision?</h2>
        <p className="mt-2 text-sm text-text-secondary">
          This will remove “{decision.text}”. This can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded border border-border bg-surface px-4 py-2 text-sm transition-opacity hover:opacity-70"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90"
            onClick={onConfirm}
            type="button"
          >
            Delete decision
          </button>
        </div>
      </section>
    </div>
  );
}

export default function DecisionLog() {
  const {
    decisions,
    loading,
    error,
    fetchDecisions,
    addDecision,
    updateDecision,
    deleteDecision,
    toggleDecisionStatus,
  } = useDecisions();
  const [page, setPage] = useState(1);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingDecision, setEditingDecision] = useState<Decision | null>(null);
  const [decisionToDelete, setDecisionToDelete] = useState<Decision | null>(null);
  const [projectOptions, setProjectOptions] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    getProjects().then((projects) => {
      if (mounted) {
        setProjectOptions(projects.map((project) => project.name));
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const defaultProject = getNextProjectName(projectOptions);
  const sortedDecisions = useMemo(
    () =>
      [...decisions].sort((first, second) =>
        second.date.localeCompare(first.date),
      ),
    [decisions],
  );
  const pageCount = Math.max(1, Math.ceil(sortedDecisions.length / PAGE_SIZE));
  const visibleDecisions = sortedDecisions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  function handleFormSubmit(form: DecisionFormData) {
    if (formMode === "edit" && editingDecision) {
      updateDecision({ ...form, id: editingDecision.id });
      toast.success("Decision updated");
    } else {
      addDecision(form);
      setPage(1);
      toast.success("Decision saved");
    }
    setFormMode(null);
    setEditingDecision(null);
  }

  function openEditForm(decision: Decision) {
    setEditingDecision(decision);
    setFormMode("edit");
  }

  function handleToggle(decision: Decision) {
    toggleDecisionStatus(decision.id);
    toast.success(`Decision marked ${decision.active ? "inactive" : "active"}`);
  }

  function handleDelete() {
    if (!decisionToDelete) return;
    deleteDecision(decisionToDelete.id);
    setDecisionToDelete(null);
    toast.success("Decision deleted");
  }

  const formInitialValues =
    editingDecision && formMode === "edit"
      ? getFormData(editingDecision)
      : createInitialForm(defaultProject);

  return (
    <main className="min-h-screen bg-background px-page py-section font-sans text-text-primary">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-section">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-text-secondary">Workspace</p>
            <h1 className="text-2xl font-semibold">Decision Log</h1>
          </div>
          {formMode === null && (
            <button
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90"
              onClick={() => setFormMode("create")}
              type="button"
            >
              Add decision
            </button>
          )}
        </div>

        {formMode !== null && (
          <DecisionForm
            initialValues={formInitialValues}
            isEditing={formMode === "edit"}
            key={editingDecision?.id ?? "create"}
            onCancel={() => {
              setFormMode(null);
              setEditingDecision(null);
            }}
            onSubmit={handleFormSubmit}
            projectOptions={projectOptions}
          />
        )}

        {loading && <DecisionTableSkeleton />}

        {!loading && error && (
          <section className="rounded border border-border bg-surface px-6 py-8">
            <h2 className="font-semibold">Unable to load decisions</h2>
            <p className="mt-2 text-sm text-text-secondary">{error}</p>
            <button
              className="mt-4 rounded bg-primary px-4 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90"
              onClick={() => void fetchDecisions()}
              type="button"
            >
              Try again
            </button>
          </section>
        )}

        {!loading && !error && decisions.length === 0 && (
          <section className="rounded border border-border bg-surface px-6 py-8">
            <h2 className="font-semibold">No decisions yet</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Decisions you record will appear here.
            </p>
          </section>
        )}

        {!loading && !error && decisions.length > 0 && (
          <>
            <div className="overflow-hidden rounded border border-border bg-surface">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="border-b border-border text-text-secondary">
                  <tr>
                    <th className="px-4 py-3 font-medium" scope="col">Date</th>
                    <th className="px-4 py-3 font-medium" scope="col">Project</th>
                    <th className="px-4 py-3 font-medium" scope="col">Decision</th>
                    <th className="px-4 py-3 font-medium" scope="col">Reason</th>
                    <th className="px-4 py-3 font-medium" scope="col">Status</th>
                    <th className="px-4 py-3 font-medium" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleDecisions.map((decision) => (
                    <tr className="border-b border-border last:border-b-0" key={decision.id}>
                      <td className="whitespace-nowrap px-4 py-4 text-text-secondary">{formatDate(decision.date)}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-medium">{decision.project}</td>
                      <td className="px-4 py-4">{decision.text}</td>
                      <td className="px-4 py-4 text-text-secondary">{decision.reason}</td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <button
                          className="inline-flex items-center gap-2 rounded px-1 py-1 text-sm transition-opacity hover:opacity-70"
                          onClick={() => handleToggle(decision)}
                          type="button"
                        >
                          <span
                            aria-hidden="true"
                            className={`h-2 w-2 rounded-full ${decision.active ? "bg-primary" : "bg-text-secondary"}`}
                          />
                          {decision.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex gap-3">
                          <button
                            className="text-sm font-medium text-primary transition-opacity hover:opacity-70"
                            onClick={() => openEditForm(decision)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="text-sm font-medium text-text-secondary transition-opacity hover:opacity-70"
                            onClick={() => setDecisionToDelete(decision)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <nav aria-label="Decision pagination" className="flex items-center justify-between">
              <p className="text-sm text-text-secondary">Page {page} of {pageCount}</p>
              <div className="flex gap-2">
                <button
                  className="rounded border border-border bg-surface px-4 py-2 text-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page === 1}
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                  type="button"
                >
                  Previous
                </button>
                <button
                  className="rounded border border-border bg-surface px-4 py-2 text-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page === pageCount}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  type="button"
                >
                  Next
                </button>
              </div>
            </nav>
          </>
        )}
      </div>

      {decisionToDelete && (
        <DeleteDialog
          decision={decisionToDelete}
          onCancel={() => setDecisionToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </main>
  );
}
