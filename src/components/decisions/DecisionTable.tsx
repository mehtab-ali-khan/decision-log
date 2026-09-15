import type { Decision } from "../../types/decision";
import { formatDate } from "./formatDate";

type DecisionTableProps = { decisions: Decision[]; onDelete: (decision: Decision) => void; onEdit: (decision: Decision) => void; onToggle: (decision: Decision) => void };

export function DecisionTable({ decisions, onDelete, onEdit, onToggle }: DecisionTableProps) {
  return (
    <div className="overflow-hidden rounded border border-border bg-surface">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="border-b border-border text-text-secondary"><tr>
          <th className="px-4 py-3 font-medium" scope="col">Date</th><th className="px-4 py-3 font-medium" scope="col">Project</th><th className="px-4 py-3 font-medium" scope="col">Decision</th><th className="px-4 py-3 font-medium" scope="col">Reason</th><th className="px-4 py-3 font-medium" scope="col">Status</th><th className="px-4 py-3 font-medium" scope="col">Actions</th>
        </tr></thead>
        <tbody>{decisions.map((decision) => (
          <tr className="border-b border-border last:border-b-0" key={decision.id}>
            <td className="whitespace-nowrap px-4 py-4 text-text-secondary">{formatDate(decision.date)}</td>
            <td className="whitespace-nowrap px-4 py-4 font-medium">{decision.project}</td>
            <td className="px-4 py-4">{decision.text}</td><td className="px-4 py-4 text-text-secondary">{decision.reason}</td>
            <td className="whitespace-nowrap px-4 py-4"><button className="inline-flex items-center gap-2 rounded px-1 py-1 text-sm transition-opacity hover:opacity-70" onClick={() => onToggle(decision)} type="button"><span aria-hidden="true" className={`h-2 w-2 rounded-full ${decision.active ? "bg-primary" : "bg-text-secondary"}`} />{decision.active ? "Active" : "Inactive"}</button></td>
            <td className="whitespace-nowrap px-4 py-4"><div className="flex gap-3"><button className="text-sm font-medium text-primary transition-opacity hover:opacity-70" onClick={() => onEdit(decision)} type="button">Edit</button><button className="text-sm font-medium text-text-secondary transition-opacity hover:opacity-70" onClick={() => onDelete(decision)} type="button">Delete</button></div></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

export function DecisionTableSkeleton() {
  return <div className="overflow-hidden rounded border border-border bg-surface"><div className="grid grid-cols-6 gap-4 border-b border-border px-4 py-3">{Array.from({ length: 6 }, (_, index) => <div className="h-4 animate-pulse rounded bg-border" key={index} />)}</div>{Array.from({ length: 5 }, (_, index) => <div className="grid grid-cols-6 gap-4 border-b border-border px-4 py-5 last:border-b-0" key={index}>{Array.from({ length: 6 }, (_, cellIndex) => <div className="h-4 animate-pulse rounded bg-border" key={cellIndex} />)}</div>)}</div>;
}

type DecisionPaginationProps = { page: number; pageCount: number; onNext: () => void; onPrevious: () => void };

export function DecisionPagination({ page, pageCount, onNext, onPrevious }: DecisionPaginationProps) {
  return <nav aria-label="Decision pagination" className="flex items-center justify-between"><p className="text-sm text-text-secondary">Page {page} of {pageCount}</p><div className="flex gap-2"><button className="rounded border border-border bg-surface px-4 py-2 text-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-50" disabled={page === 1} onClick={onPrevious} type="button">Previous</button><button className="rounded border border-border bg-surface px-4 py-2 text-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-50" disabled={page === pageCount} onClick={onNext} type="button">Next</button></div></nav>;
}
