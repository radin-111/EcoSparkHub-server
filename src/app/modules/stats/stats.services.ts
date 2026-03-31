import { IdeaStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getUserStats = async (userId: string) => {
  const [totalIdeas, totalComments, totalReplies, totalCategories] =
    await Promise.all([
      prisma.idea.count({ where: { userId } }),
      prisma.comment.count({ where: { userId } }),
      prisma.reply.count({ where: { userId } }),
      prisma.category.count(),
    ]);

 
  const statusCounts = await prisma.idea.groupBy({
    by: ["status"],
    where: { userId },
    _count: { status: true },
  });

  const pieChartData = Object.values(IdeaStatus).map((status) => {
    const found = statusCounts.find((s) => s.status === status);
    return {
      name: status,
      value: found?._count.status || 0,
    };
  });

 
  const categoryStats = await prisma.idea.groupBy({
    by: ["categoryId"],
    where: { userId },
    _count: { categoryId: true },
  });

  const categories = await prisma.category.findMany();

  const barChartData = categoryStats.map((item) => {
    const category = categories.find((c) => c.id === item.categoryId);
    return {
      name: category?.name || "Unknown",
      total: item._count.categoryId,
    };
  });

  
  const monthlyIdeasRaw = await prisma.idea.findMany({
    where: { userId },
    select: { createdAt: true },
  });

  const monthlyMap: Record<string, number> = {};

  monthlyIdeasRaw.forEach((idea) => {
    const month = idea.createdAt.toISOString().slice(0, 7); // YYYY-MM
    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });

  const monthlyChartData = Object.entries(monthlyMap).map(([month, total]) => ({
    month,
    total,
  }));

  
  const votes = await prisma.idea.aggregate({
    where: { userId },
    _sum: {
      up_vote: true,
      down_vote: true,
    },
  });


  const topIdeas = await prisma.idea.findMany({
    where: { userId },
    orderBy: { up_vote: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      up_vote: true,
    },
  });

  return {
    overview: {
      totalIdeas,
      totalComments,
      totalReplies,
      totalCategories,
      totalUpVotes: votes._sum.up_vote || 0,
      totalDownVotes: votes._sum.down_vote || 0,
    },

    charts: {
      pieChartData,
      barChartData,
      monthlyChartData,
    },

    topIdeas,
  };
};


const getAdminStats = async () => {
  const [totalUsers, totalIdeas, totalComments, totalReplies, totalCategories] =
    await Promise.all([
      prisma.user.count(),
      prisma.idea.count(),
      prisma.comment.count(),
      prisma.reply.count(),
      prisma.category.count(),
    ]);

 
  const statusCounts = await prisma.idea.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const pieChartData = Object.values(IdeaStatus).map((status) => {
    const found = statusCounts.find((s) => s.status === status);
    return {
      name: status,
      value: found?._count.status || 0,
    };
  });


  const categoryStats = await prisma.idea.groupBy({
    by: ["categoryId"],
    _count: { categoryId: true },
  });

  const categories = await prisma.category.findMany();

  const barChartData = categoryStats.map((item) => {
    const category = categories.find((c) => c.id === item.categoryId);
    return {
      name: category?.name || "Unknown",
      total: item._count.categoryId,
    };
  });

  
  const ideas = await prisma.idea.findMany({
    select: { createdAt: true },
  });

  const monthlyMap: Record<string, number> = {};

  ideas.forEach((idea) => {
    const month = idea.createdAt.toISOString().slice(0, 7);
    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });

  const monthlyChartData = Object.entries(monthlyMap).map(([month, total]) => ({
    month,
    total,
  }));

 
  const votes = await prisma.idea.aggregate({
    _sum: {
      up_vote: true,
      down_vote: true,
    },
  });


  const topIdeas = await prisma.idea.findMany({
    orderBy: { up_vote: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      up_vote: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    overview: {
      totalUsers,
      totalIdeas,
      totalComments,
      totalReplies,
      totalCategories,
      totalUpVotes: votes._sum.up_vote || 0,
      totalDownVotes: votes._sum.down_vote || 0,
    },

    charts: {
      pieChartData,
      barChartData,
      monthlyChartData,
    },

    topIdeas,
  };
};


export const statsServices = {
  getUserStats,
  getAdminStats,
};
