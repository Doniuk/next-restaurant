"use server";

import { PrismaClient } from "@/generated/prisma";
import { MealModel } from "@/models/meal.model";
import { OrderModel } from "@/models/order.model";

const prisma = new PrismaClient();

export async function getMeals(): Promise<MealModel[]> {
  const meals = await prisma.meal.findMany({
    orderBy: {
      name: 'asc'
    }
  });
  
  return meals.map(meal => ({
    ...meal,
    price: Number(meal.price)
  }));
}

export async function getOrders(): Promise<OrderModel[]> {
  const orders = await prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          meal: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return orders.map(order => ({
    ...order,
    orderItems: order.orderItems.map(item => ({
      ...item,
      meal: {
        ...item.meal,
        price: Number(item.meal.price)
      }
    }))
  }));
}

export async function createOrder(meals: Array<{ mealId: string; quantity: number }>): Promise<OrderModel> {
  const order = await prisma.order.create({
    data: {
      orderItems: {
        create: meals.map(meal => ({
          mealId: meal.mealId,
          quantity: meal.quantity,
        })),
      },
    },
    include: {
      orderItems: {
        include: {
          meal: true,
        },
      },
    },
  });

  return {
    ...order,
    orderItems: order.orderItems.map(item => ({
      ...item,
      meal: {
        ...item.meal,
        price: Number(item.meal.price),
      },
    })),
  };
}
