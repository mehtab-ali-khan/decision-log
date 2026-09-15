import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getProjects } from "../api/projects";
import { DeleteDecisionDialog } from "../components/decisions/DeleteDecisionDialog";
import { DecisionFilters, type StatusFilter } from "../components/decisions/DecisionFilters";
import { DecisionForm, type DecisionFormData } from "../components/decisions/DecisionForm";
import { DecisionPagination, DecisionTable, DecisionTableSkeleton } from "../components/decisions/DecisionTable";
import { formatDate } from "../components/decisions/formatDate";
import { useDecisions } from "../hooks/useDecisions";
import type { Decision } from "../types/decision";

const PAGE_SIZE = 10;

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function getNextProjectName(projects: string[]): string {
  const highestProjectNumber = projects.reduce((highest, project) => {
    const match = project.match(/^Project(\d+)$/i);
    return Math.max(highest, match ? Number(match[1]) : 0);
  }, 0);

  return `Project${highestProjectNumber + 1}`;
}

function createInitialForm(project = "Project1"): DecisionFormData {
  return { date: getToday(), project, text: "", reason: "", active: true };
}

function getFormData({ id: _id, ...formData }: Decision): DecisionFormData {
  return formData;
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [projectFilter, setProjectFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    getProjects().then((projects) => {
      if (mounted) setProjectOptions(projects.map((project) => project.name));
    });

    return () => { mounted = false; };
  }, []);

  const availableProjects = useMemo(
    () => [...new Set([...projectOptions, ...decisions.map((decision) => decision.project)])].sort((first, second) => first.localeCompare(second)),
    [decisions, projectOptions],
  );
  const filteredDecisions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return decisions.filter((decision) => {
      const matchesSearch = normalizedSearch.length === 0 || [
        decision.id,
        decision.date,
        formatDate(decision.date),
        decision.project,
        decision.text,
        decision.reason,
        decision.active ? "active" : "inactive",
      ].some((value) => value.toLowerCase().includes(normalizedSearch));
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && decision.active) ||
        (statusFilter === "inactive" && !decision.active);
      const matchesProject = projectFilter === "all" || decision.project === projectFilter;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [decisions, projectFilter, search, statusFilter]);
  const sortedDecisions = useMemo(
    () => [...filteredDecisions].sort((first, second) => second.date.localeCompare(first.date)),
    [filteredDecisions],
  );
  const pageCount = Math.max(1, Math.ceil(sortedDecisions.length / PAGE_SIZE));
  const visibleDecisions = sortedDecisions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  useEffect(() => { setPage(1); }, [projectFilter, search, statusFilter]);

  function closeForm() {
    setFormMode(null);
    setEditingDecision(null);
  }

  function handleFormSubmit(form: DecisionFormData) {
    if (formMode === "edit" && editingDecision) {
      updateDecision({ ...form, id: editingDecision.id });
      toast.success("Decision updated");
    } else {
      addDecision(form);
      setPage(1);
      toast.success("Decision saved");
    }
    closeForm();
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

  const formInitialValues = editingDecision && formMode === "edit"
    ? getFormData(editingDecision)
    : createInitialForm(getNextProjectName(projectOptions));

  return (
    <main className="min-h-screen bg-background px-page py-section font-sans text-text-primary">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-section">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-text-secondary">Workspace</p>
            <h1 className="text-2xl font-semibold">Decision Log</h1>
          </div>
          {formMode === null && <button className="rounded bg-primary px-4 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90" onClick={() => setFormMode("create")} type="button">Add decision</button>}
        </header>

        {formMode !== null && <DecisionForm initialValues={formInitialValues} isEditing={formMode === "edit"} key={editingDecision?.id ?? "create"} onCancel={closeForm} onSubmit={handleFormSubmit} projectOptions={projectOptions} />}

        {!loading && !error && decisions.length > 0 && <DecisionFilters onProjectFilterChange={setProjectFilter} onSearchChange={setSearch} onStatusFilterChange={setStatusFilter} projectFilter={projectFilter} projects={availableProjects} search={search} statusFilter={statusFilter} />}
        {loading && <DecisionTableSkeleton />}

        {!loading && error && <section className="rounded border border-border bg-surface px-6 py-8"><h2 className="font-semibold">Unable to load decisions</h2><p className="mt-2 text-sm text-text-secondary">{error}</p><button className="mt-4 rounded bg-primary px-4 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90" onClick={() => void fetchDecisions()} type="button">Try again</button></section>}

        {!loading && !error && decisions.length === 0 && <section className="rounded border border-border bg-surface px-6 py-8"><h2 className="font-semibold">No decisions yet</h2><p className="mt-2 text-sm text-text-secondary">Decisions you record will appear here.</p></section>}

        {!loading && !error && decisions.length > 0 && filteredDecisions.length === 0 && <section className="rounded border border-border bg-surface px-6 py-8"><h2 className="font-semibold">No matching decisions</h2><p className="mt-2 text-sm text-text-secondary">Try changing your search or filters.</p><button className="mt-4 rounded border border-border bg-surface px-4 py-2 text-sm transition-opacity hover:opacity-70" onClick={() => { setSearch(""); setStatusFilter("all"); setProjectFilter("all"); }} type="button">Clear filters</button></section>}

        {!loading && !error && filteredDecisions.length > 0 && <>
          <DecisionTable decisions={visibleDecisions} onDelete={setDecisionToDelete} onEdit={(decision) => { setEditingDecision(decision); setFormMode("edit"); }} onToggle={handleToggle} />
          <DecisionPagination onNext={() => setPage((currentPage) => currentPage + 1)} onPrevious={() => setPage((currentPage) => currentPage - 1)} page={page} pageCount={pageCount} />
        </>}
      </div>

      {decisionToDelete && <DeleteDecisionDialog decision={decisionToDelete} onCancel={() => setDecisionToDelete(null)} onConfirm={handleDelete} />}
    </main>
  );
}
