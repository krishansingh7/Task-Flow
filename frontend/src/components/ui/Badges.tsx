import { TaskStatus, Priority } from '@/types';

const statusLabels: Record<TaskStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};
const statusClasses: Record<TaskStatus, string> = {
  PENDING: 'badge-pending',
  IN_PROGRESS: 'badge-in-progress',
  COMPLETED: 'badge-completed',
};

const priorityLabels: Record<Priority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};
const priorityClasses: Record<Priority, string> = {
  LOW: 'badge-low',
  MEDIUM: 'badge-medium',
  HIGH: 'badge-high',
};

interface BadgeProps { className?: string; }

export function StatusBadge({ status, className = '' }: { status: TaskStatus } & BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status]} ${className}`}>
      {statusLabels[status]}
    </span>
  );
}

export function PriorityBadge({ priority, className = '' }: { priority: Priority } & BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityClasses[priority]} ${className}`}>
      {priorityLabels[priority]}
    </span>
  );
}
