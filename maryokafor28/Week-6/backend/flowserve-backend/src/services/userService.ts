import prisma from "../client";

export const userService = {
  async createUser(name: string, email: string) {
    return prisma.user.create({
      data: { name, email },
    });
  },

  async getUsersPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);

    return {
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  },

  async getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async updateUser(id: string, name?: string, email?: string) {
    return prisma.user.update({
      where: { id },
      data: { name, email },
    });
  },

  async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
