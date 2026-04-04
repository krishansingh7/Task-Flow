'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, total, limit, onChange }: Props) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/[0.06]">
      <span className="text-white/30 text-sm">
        Showing {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="btn-secondary !px-3 !py-2 disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p = totalPages <= 5 ? i + 1 : Math.max(1, page - 2) + i;
            if (p > totalPages) return null;
            return (
              <button
                key={p}
                onClick={() => onChange(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  p === page
                    ? 'bg-jade-500 text-ink-900'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="btn-secondary !px-3 !py-2 disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
