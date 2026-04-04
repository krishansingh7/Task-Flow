import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

const updateTaskSchema = createTaskSchema.partial();

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.userId;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const status = req.query.status as TaskStatus | undefined;
  const search = req.query.search as string | undefined;
  const priority = req.query.priority as Priority | undefined;

  const where = {
    userId,
    ...(status && { status }),
    ...(priority && { priority }),
    ...(search && {
      title: { contains: search },
    }),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.task.count({ where }),
  ]);

  res.json({
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const task = await prisma.task.findFirst({ where: { id, userId } });

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.json(task);
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const parsed = createTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { title, description, priority, dueDate, status } = parsed.data;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority: priority ?? 'MEDIUM',
      status: status ?? 'PENDING',
      dueDate: dueDate ? new Date(dueDate) : null,
      userId,
    },
  });

  res.status(201).json(task);
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { title, description, priority, dueDate, status } = parsed.data;

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(priority !== undefined && { priority }),
      ...(status !== undefined && { status }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
    },
  });

  res.json(task);
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  await prisma.task.delete({ where: { id } });
  res.json({ message: 'Task deleted successfully' });
};

export const toggleTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const nextStatus = existing.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

  const task = await prisma.task.update({
    where: { id },
    data: { status: nextStatus },
  });

  res.json(task);
};