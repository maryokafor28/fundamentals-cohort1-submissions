import { prisma } from '../config/prisma';
import { generateReference } from '../utils/generateReference';

const SUCCESS_RATE = Number(process.env.SIMULATOR_SUCCESS_RATE ?? 0.85);

export async function simulateTransaction(payload: any) {
  const reference = generateReference();
  const created = await prisma.transaction.create({
    data: {
      reference,
      amount: payload.amount.toString(),
      currency: payload.currency,
      type: payload.type,
      status: 'pending',
      fromUserId: payload.fromUserId,
      toUserId: payload.toUserId,
      metadata: { note: 'simulated' }
    }
  });

  // simple deterministic simulation
  const success = Math.random() < SUCCESS_RATE;
  const status = success ? 'completed' : 'failed';

  const updated = await prisma.transaction.update({
    where: { id: created.id },
    data: { status, metadata: { processedAt: new Date().toISOString(), success } }
  });

  return updated;
}

export async function listTransactions({ page = 1, limit = 20, userId, status }: any) {
  const skip = (page - 1) * limit;
  const where: any = {};
  if (userId) where.OR = [{ fromUserId: userId }, { toUserId: userId }];
  if (status) where.status = status;

  const [total, data] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } })
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getTransaction(id: string) {
  const tx = await prisma.transaction.findUnique({ where: { id } });
  if (!tx) throw { status: 404, message: 'Transaction not found' };
  return tx;
}
