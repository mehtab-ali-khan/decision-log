import { ChevronLeft, ChevronRight } from "lucide-react";

type DecisionPaginationProps = {
  onPageChange: (page: number) => void;
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
};

function getPageItems(page: number, pageCount: number): Array<number | "gap"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const pages = new Set([1, pageCount, page, page - 1, page + 1]);
  const visible = [...pages].filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b);

  return visible.flatMap((value, index) =>
    index > 0 && value - visible[index - 1] > 1 ? ["gap" as const, value] : [value],
  );
}

export function DecisionPagination({
  onPageChange,
  page,
  pageCount,
  pageSize,
  total,
}: DecisionPaginationProps) {
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label="Decision pagination"
      className="flex flex-col items-center justify-between gap-3 pt-1 sm:flex-row"
    >
      <p className="text-caption text-text-secondary">
        Showing <span className="font-medium tabular-nums text-text-primary">{firstItem}-{lastItem}</span> of{" "}
        <span className="font-medium tabular-nums text-text-primary">{total}</span>
      </p>

      {pageCount > 1 && (
        <div className="flex max-w-full items-center gap-0 sm:gap-1">
          <button
            aria-label="Previous page"
            className="ui-button-icon"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </button>

          {getPageItems(page, pageCount).map((item, index) =>
            item === "gap" ? (
              <span aria-hidden="true" className="px-1 text-caption text-text-tertiary" key={`gap-${index}`}>
                ...
              </span>
            ) : (
              <button
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={`ui-focus h-8 min-w-[1.75rem] rounded-md px-1 text-small font-medium tabular-nums transition-colors sm:min-w-[2rem] sm:px-2 ${
                  item === page
                    ? "bg-primary text-surface shadow-raised"
                    : "text-text-secondary hover:bg-muted hover:text-text-primary"
                }`}
                key={item}
                onClick={() => onPageChange(item)}
                type="button"
              >
                {item}
              </button>
            ),
          )}

          <button
            aria-label="Next page"
            className="ui-button-icon"
            disabled={page === pageCount}
            onClick={() => onPageChange(page + 1)}
            type="button"
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      )}
    </nav>
  );
}
