import { useEffect, useMemo, useState } from "react";
import { useDecisions } from "../hooks/useDecisions";

const PAGE_SIZE = 10;

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(`${date}T00:00:00`));
}

function DecisionTableSkeleton() {
  return (
    <div className="overflow-hidden rounded border border-border bg-surface">
      <div className="grid grid-cols-5 gap-4 border-b border-border px-4 py-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            className="h-4 animate-pulse rounded bg-border"
            key={index}
          />
        ))}
      </div>
      {Array.from({ length: 5 }, (_, index) => (
        <div
          className="grid grid-cols-5 gap-4 border-b border-border px-4 py-5 last:border-b-0"
          key={index}
        >
          {Array.from({ length: 5 }, (_, cellIndex) => (
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

export default function DecisionLog() {
  const { decisions, loading, error, fetchDecisions } = useDecisions();
  const [page, setPage] = useState(1);

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

  return (
    <main className="min-h-screen bg-background px-page py-section font-sans text-text-primary">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-section">
        <div>
          <p className="mb-2 text-sm text-text-secondary">Workspace</p>
          <h1 className="text-2xl font-semibold">Decision Log</h1>
        </div>

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
                    <th className="px-4 py-3 font-medium" scope="col">
                      Date
                    </th>
                    <th className="px-4 py-3 font-medium" scope="col">
                      Project
                    </th>
                    <th className="px-4 py-3 font-medium" scope="col">
                      Decision
                    </th>
                    <th className="px-4 py-3 font-medium" scope="col">
                      Reason
                    </th>
                    <th className="px-4 py-3 font-medium" scope="col">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleDecisions.map((decision) => (
                    <tr
                      className="border-b border-border last:border-b-0"
                      key={decision.id}
                    >
                      <td className="whitespace-nowrap px-4 py-4 text-text-secondary">
                        {formatDate(decision.date)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-medium">
                        {decision.project}
                      </td>
                      <td className="px-4 py-4">{decision.text}</td>
                      <td className="px-4 py-4 text-text-secondary">
                        {decision.reason}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="inline-flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={`h-2 w-2 rounded-full ${decision.active ? "bg-primary" : "bg-text-secondary"}`}
                          />
                          {decision.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <nav
              aria-label="Decision pagination"
              className="flex items-center justify-between"
            >
              <p className="text-sm text-text-secondary">
                Page {page} of {pageCount}
              </p>
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
    </main>
  );
}
