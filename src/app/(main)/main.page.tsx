import React from "react";

import { OrderManager } from "@/app/(main)/manager/order-manager";
import { getMeals, getOrders } from "@/app/(main)/manager/create/create-order.actions";
import { formatPrice } from "@/utils/format";

export async function MainPage() {
  const [meals, orders] = await Promise.all([
    getMeals(),
    getOrders()
  ]);

  return (
    <div className="min-h-screen p-12">
      <header className="flex justify-between items-center mb-6">
        <h1 className="font-black text-xl">Orders</h1>
        <OrderManager meals={meals} />
      </header>

      <div className="flex flex-col gap-4">
        {orders.map((order) => {
          const totalPrice = order.orderItems.reduce((sum, item) => {
            return sum + (item.meal.price * item.quantity);
          }, 0);

          return (
            <div key={order.id} className="border rounded-md p-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Order ID: {order.id}</span>
                <span className="text-sm text-gray-500">
                  Created: {order.createdAt.toLocaleDateString()}
                </span>
              </div>

              <div className="mt-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2">
                    <div>
                      <span className="font-medium">{item.meal.name}</span>
                      <span className="text-gray-500 ml-2">Quantity: {item.quantity}</span>
                    </div>
                    <span className="text-gray-600">
                      Meal Price: {formatPrice(item.meal.price)}
                    </span>
                  </div>
                ))}

                <div className="w-full flex justify-end border-t pt-4 mt-4">
                  <span className="font-bold text-lg">
                    Total Price: {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
