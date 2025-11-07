import { Request, Response } from 'express';
import * as txService from '../services/transactionService';

export const simulateTransaction = async (req: Request, res: Response) => {
  const tx = await txService.simulateTransaction(req.body);
  return res.status(201).send(tx);
};

export const listTransactions = async (req: Request, res: Response) => {
  const page = Number((req.query as any).page || 1);
  const limit = Number((req.query as any).limit || 20);
  const userId = (req.query as any).userId as string | undefined;
  const status = (req.query as any).status as string | undefined;
  const data = await txService.listTransactions({ page, limit, userId, status });
  return res.send(data);
};

export const getTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tx = await txService.getTransaction(id);
  return res.send(tx);
};
