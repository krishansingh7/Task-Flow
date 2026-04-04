'use client';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { TaskFilters } from '@/types';

interface Props {
  filters: TaskFilters;
  onChange: (f: Partial<TaskFilters>) => void;
  onReset: () => void;
}

export default function FilterBar({ filters, onChange, onReset }: Props) {
  const hasActiveFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        <input
          value={filters.search ?? ''}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
          placeholder="Search tasks..."
          className="input pl-10"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ search: '', page: 1 })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status filter */}
      <select
        value={filters.status ?? ''}
        onChange={(e) => onChange({ status: e.target.value as TaskFilters['status'], page: 1 })}
        className="input sm:w-40"
      >
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>

      {/* Priority filter */}
      <select
        value={filters.priority ?? ''}
        onChange={(e) => onChange({ priority: e.target.value as TaskFilters['priority'], page: 1 })}
        className="input sm:w-36"
      >
        <option value="">All priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      {/* Reset */}
      {hasActiveFilters && (
        <button onClick={onReset} className="btn-ghost flex items-center gap-1.5 text-sm whitespace-nowrap">
          <X size={14} /> Clear
        </button>
      )}
    </div>
  );
}
