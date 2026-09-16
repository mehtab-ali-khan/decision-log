import { AlertCircle, Plus, Sparkles, SearchX, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createSampleDecisions } from "../api/mockData";
import { getProjects } from "../api/projects";
import {
  DecisionFilters,
  type SortOrder,
  type StatusFilter,
} from "../components/decisions/DecisionFilters";
import { DecisionForm, type DecisionFormData } from "../components/decisions/DecisionForm";
import { DecisionList, DecisionListSkeleton } from "../components/decisions/DecisionList";
import { DecisionPagination } from "../components/decisions/DecisionPagination";
import { DecisionStats } from "../components/decisions/DecisionStats";
import { formatDate } from "../components/decisions/formatDate";
import { TopBar } from "../components/layout/TopBar";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
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
    setDecisions,
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
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    let mounted = true;
    getProjects().then((projects) => {
      if (mounted) setProjectOptions(projects.map((project) => project.name));
    });

    return () => {
      mounted = false;
    };
  }, []);

  const availableProjects = useMemo(
    () =>
      [...new Set([...projectOptions, ...decisions.map((decision) => decision.project)])].sort(
        (first, second) => first.localeCompare(second),
      ),
    [decisions, projectOptions],
  );

  const filteredDecisions = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    return decisions.filter((decision) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          formatDate(decision.date),
          decision.project,
          decision.text,
          decision.reason,
          decision.active ? "active" : "inactive",
        ].some((value) => value.toLowerCase().includes(normalizedSearch));
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && decision.active) ||
        (statusFilter === "inactive" && !decision.active);
      const matchesProject = projectFilter === "all" || decision.project === projectFilter;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [debouncedSearch, decisions, projectFilter, statusFilter]);

  const sortedDecisions = useMemo(
    () =>
      [...filteredDecisions].sort((first, second) =>
        sortOrder === "newest"
          ? second.date.localeCompare(first.date)
          : first.date.localeCompare(second.date),
      ),
    [filteredDecisions, sortOrder],
  );

  const pageCount = Math.max(1, Math.ceil(sortedDecisions.length / PAGE_SIZE));
  const visibleDecisions = sortedDecisions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCount = decisions.filter((decision) => decision.active).length;

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, projectFilter, sortOrder, statusFilter]);

  function closeForm() {
    setFormMode(null);
    setEditingDecision(null);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setProjectFilter("all");
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
    toast.success(`Marked ${decision.active ? "inactive" : "active"}`);
  }

  function confirmDelete() {
    if (!decisionToDelete) return;
    deleteDecision(decisionToDelete.id);
    setDecisionToDelete(null);
    toast.success("Decision deleted");
  }

  function loadSampleData() {
    setDecisions(createSampleDecisions());
    setPage(1);
    toast.success("Sample data added");
  }

  function startEditing(decision: Decision) {
    setEditingDecision(decision);
    setFormMode("edit");
  }

  const defaultProject =
    decisions[0]?.project ?? availableProjects[0] ?? getNextProjectName(projectOptions);
  const formInitialValues =
    editingDecision && formMode === "edit"
      ? getFormData(editingDecision)
      : { date: getToday(), project: defaultProject, text: "", reason: "", active: true };

  const hasDecisions = decisions.length > 0;
  const hasResults = filteredDecisions.length > 0;

  return (
    <div className="min-h-screen font-sans text-text-primary">
      <TopBar
        action={
          <>
            {!loading && !error && !hasDecisions && (
              <button
                className="ui-button-secondary max-[420px]:px-3"
                onClick={loadSampleData}
                type="button"
              >
                <Wand2 aria-hidden="true" className="h-4 w-4 max-[420px]:hidden" />
                <span className="hidden sm:inline">Add sample data</span>
                <span className="sm:hidden">Sample</span>
              </button>
            )}
            <button
              className="ui-button-primary max-[420px]:px-3"
              onClick={() => setFormMode("create")}
              type="button"
            >
              <Plus aria-hidden="true" className="h-4 w-4 max-[420px]:hidden" />
              <span className="hidden sm:inline">New decision</span>
              <span className="sm:hidden">New</span>
            </button>
          </>
        }
      />

      <main className="ui-page flex flex-col gap-6 py-8 sm:py-10">
        {!loading && !error && hasDecisions && (
          <DecisionStats
            activeCount={activeCount}
            inactiveCount={decisions.length - activeCount}
            onStatusFilterChange={setStatusFilter}
            projectCount={availableProjects.length}
            statusFilter={statusFilter}
            total={decisions.length}
          />
        )}

        {!loading && !error && hasDecisions && (
          <DecisionFilters
            onClearFilters={clearFilters}
            onProjectFilterChange={setProjectFilter}
            onSearchChange={setSearch}
            onSortOrderChange={setSortOrder}
            onStatusFilterChange={setStatusFilter}
            projectFilter={projectFilter}
            projects={availableProjects}
            search={search}
            sortOrder={sortOrder}
            statusFilter={statusFilter}
          />
        )}

        {!loading && !error && (
          <p aria-live="polite" className="sr-only">
            {filteredDecisions.length} decision{filteredDecisions.length !== 1 ? "s" : ""}
          </p>
        )}

        {loading && <DecisionListSkeleton />}

        {!loading && error && (
          <EmptyState
            actions={
              <button className="ui-button-primary" onClick={() => void fetchDecisions()} type="button">
                Try again
              </button>
            }
            description={error || "Failed to load decisions"}
            icon={AlertCircle}
            title="Unable to load decisions"
            tone="danger"
          />
        )}

        {!loading && !error && !hasDecisions && (
          <EmptyState
            actions={
              <>
                <button className="ui-button-primary" onClick={() => setFormMode("create")} type="button">
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  Add your first decision
                </button>
                <button className="ui-button-secondary" onClick={loadSampleData} type="button">
                  <Wand2 aria-hidden="true" className="h-4 w-4" />
                  Add sample data
                </button>
              </>
            }
            description="Record what was decided and why. Avoid re-deciding the same thing later."
            icon={Sparkles}
            title="Start your decision log"
            tone="brand"
          />
        )}

        {!loading && !error && hasDecisions && !hasResults && (
          <EmptyState
            actions={
              <button className="ui-button-secondary" onClick={clearFilters} type="button">
                Clear filters
              </button>
            }
            description="Nothing matched. Try changing your filters."
            icon={SearchX}
            title="No matching decisions"
          />
        )}

        {!loading && !error && hasResults && (
          <div className="flex flex-col gap-5">
            <DecisionList
              decisions={visibleDecisions}
              onDelete={setDecisionToDelete}
              onEdit={startEditing}
              onToggle={handleToggle}
              query={debouncedSearch}
            />
            <DecisionPagination
              onPageChange={setPage}
              page={page}
              pageCount={pageCount}
              pageSize={PAGE_SIZE}
              total={filteredDecisions.length}
            />
          </div>
        )}
      </main>

      {formMode !== null && (
        <DecisionForm
          initialValues={formInitialValues}
          isEditing={formMode === "edit"}
          key={editingDecision?.id ?? "create"}
          onCancel={closeForm}
          onSubmit={handleFormSubmit}
          projectOptions={availableProjects}
        />
      )}

      {decisionToDelete && (
        <ConfirmDialog
          confirmLabel="Delete"
          description={`Remove “${decisionToDelete.text}”? This can’t be undone.`}
          onCancel={() => setDecisionToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete this decision?"
          tone="danger"
        />
      )}
    </div>
  );
}
