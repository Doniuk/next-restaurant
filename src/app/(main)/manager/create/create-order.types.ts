export type MealData = {
  mealId: string;
  quantity: number;
};

export type CreateOrderValue = {
  meals: MealData[];
};
