'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { tasksService } from '@/lib/tasks.service';
import { Task, TaskFilters, PaginatedTasks } from '@/types';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import DashboardHeader from '@/components/layout/DashboardHeader';
import TaskCard from '@/components/tasks/TaskCard';
import TaskModal from '@/components/tasks/TaskModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import FilterBar from '@/components/tasks/FilterBar';
import StatsBar from '@/components/tasks/StatsBar';
import Pagination from '@/components/ui/Pagination';

function DashboardContent() {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAuthStore();
  const { showToast } = useToast();

  const [data, setData] = useState<PaginatedTasks | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({ page: 1 });

  const [editingTask, setEditingTask] = useState<Task | null | undefined>(undefined);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    if (!isAuthenticated) router.replace('/auth/login');
  }, [isAuthenticated, router]);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const result = await tasksService.getAll(filters);
      setData(result);
    } catch {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated, showToast]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const updateFilters = (partial: Partial<TaskFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const resetFilters = () => setFilters({ page: 1 });

  const handleCreate = async (payload: Partial<Task>) => {
    setIsSubmitting(true);
    try {
      await tasksService.create(payload);
      showToast('Task created successfully');
      setEditingTask(undefined);
      fetchTasks();
    } catch {
      showToast('Failed to create task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (payload: Partial<Task>) => {
    if (!editingTask) return;
    setIsSubmitting(true);
    try {
      await tasksService.update(editingTask.id, payload);
      showToast('Task updated');
      setEditingTask(undefined);
      fetchTasks();
    } catch {
      showToast('Failed to update task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      await tasksService.delete(deletingTask.id);
      showToast('Task deleted');
      setDeletingTask(null);
      fetchTasks();
    } catch {
      showToast('Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      await tasksService.toggle(task.id);
      showToast(
        task.status === 'COMPLETED' ? 'Task marked as pending' : 'Task completed! 🎉'
      );
      fetchTasks();
    } catch {
      showToast('Failed to update task', 'error');
    }
  };

  const tasks = data?.tasks ?? [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <DashboardHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-800 text-white mb-1">My Tasks</h1>
            <p className="text-white/40">Stay on top of your work, one task at a time.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchTasks}
              className="btn-ghost !px-3 !py-2"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setEditingTask(null)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatsBar tasks={tasks} total={pagination?.total ?? 0} />

        {/* Filters */}
        <FilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />

        {/* Task list */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="card h-28 animate-pulse-soft"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="card p-16 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-jade-500/10 border border-jade-500/20 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="#00C896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="#00C896" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="font-display font-700 text-white text-lg mb-2">
              {filters.search || filters.status || filters.priority
                ? 'No tasks match your filters'
                : 'No tasks yet'}
            </h3>
            <p className="text-white/30 text-sm mb-6">
              {filters.search || filters.status || filters.priority
                ? 'Try adjusting your search or filters.'
                : 'Create your first task to get started.'}
            </p>
            {!filters.search && !filters.status && !filters.priority && (
              <button onClick={() => setEditingTask(null)} className="btn-primary mx-auto">
                <Plus size={16} className="inline mr-2" />
                Create first task
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 animate-fade-in">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => setEditingTask(task)}
                onDelete={() => setDeletingTask(task)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onChange={(p) => updateFilters({ page: p })}
          />
        )}
      </main>

      {/* Task modal (create / edit) */}
      {editingTask !== undefined && (
        <TaskModal
          task={editingTask}
          onClose={() => setEditingTask(undefined)}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete confirmation modal */}
      {deletingTask && (
        <ConfirmModal
          title={deletingTask.title}
          onConfirm={handleDelete}
          onCancel={() => setDeletingTask(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}
