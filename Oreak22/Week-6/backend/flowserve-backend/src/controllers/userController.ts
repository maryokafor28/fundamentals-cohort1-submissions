import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const createUser = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  return res.status(201).send(user);
};

export const listUsers = async (req: Request, res: Response) => {
  const page = Number((req.query as any).page || 1);
  const limit = Number((req.query as any).limit || 20);
  const search = (req.query as any).search || '';
  const data = await userService.listUsers({ page, limit, search });
  return res.send(data);
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUser(id);
  return res.send(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await userService.updateUser(id, req.body);
  return res.send(updated);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await userService.deleteUser(id);
  return res.status(204).send();
};
