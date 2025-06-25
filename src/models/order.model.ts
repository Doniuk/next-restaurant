import { MealModel } from "@/models/meal.model";

export type OrderItemModel = {
  id: string;
  quantity: number;
  mealId: string;
  orderId: string;
  meal: MealModel;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderModel = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItemModel[];
};
