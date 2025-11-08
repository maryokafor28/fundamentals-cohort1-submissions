import { prisma } from '../config/prisma';
import bcrypt from 'bcrypt';

export async function createUser(payload: any) {
  const hashed = await bcrypt.hash(payload.password, 10);
  const user = await prisma.user.create({
    data: { ...payload, password: hashed },
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }
  });
  return user;
}

export async function listUsers({ page = 1, limit = 20, search = '' }: any) {
  const skip = (page - 1) * limit;
  const where = search
    ? { OR: [ { name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } } ] }
    : {};

  const [total, data] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true } })
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true } });
  if (!user) throw { status: 404, message: 'User not found' };
  return user;
}

export async function updateUser(id: string, payload: any) {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }
  const updated = await prisma.user.update({ where: { id }, data: payload, select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true } });
  return updated;
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
}
