"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Minus, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/form/select";
import { CreateOrderValue } from "./create-order.types";
import { MealModel } from "@/models/meal.model";
import { createOrder } from "./create-order.actions";
import { formatPrice } from "@/utils/format";

type CreateOrderProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  meals: MealModel[];
};

const initialValues: CreateOrderValue = {
  meals: [{ mealId: "", quantity: 1 }],
};

const schema = z.object({
  meals: z.array(
    z.object({
      mealId: z.string().min(1, "Please select a meal"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ).min(1, "At least one meal is required"),
});

export function CreateOrder({ open, onOpenChange, meals }: CreateOrderProps) {
  const form = useForm<CreateOrderValue>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "meals",
  });

  const onSubmit = async (values: CreateOrderValue) => {
    try {
      await createOrder(values.meals);
      form.reset(initialValues);
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  const handleIncrement = (index: number) => () => {
    const currentQuantity = form.watch(`meals.${index}.quantity`);
    form.setValue(`meals.${index}.quantity`, currentQuantity + 1);
  };

  const handleDecrement = (index: number) => () => {
    const currentQuantity = form.watch(`meals.${index}.quantity`);
    if (currentQuantity > 1) {
      form.setValue(`meals.${index}.quantity`, currentQuantity - 1);
    }
  };

  const handleNewMeal = () => {
    append({ mealId: "", quantity: 1 });
  };

  const handleMealRemove = (index: number) => () => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-0">
          <DialogTitle className="text-md">Create an order</DialogTitle>
          <DialogDescription className="text-xs">
            Select meals and quantities for your order
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-0">
              <div className="flex gap-2 items-center">
                <Select
                  value={form.watch(`meals.${index}.mealId`)}
                  onValueChange={(value: string) => form.setValue(`meals.${index}.mealId`, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a meal" />
                  </SelectTrigger>
                  <SelectContent>
                    {meals.map((meal) => (
                      <SelectItem key={meal.id} value={meal.id}>
                        {meal.name} - {formatPrice(meal.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1 border rounded-md">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleDecrement(index)}
                    disabled={form.watch(`meals.${index}.quantity`) <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {form.watch(`meals.${index}.quantity`)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleIncrement(index)}
                    className="h-8 w-8"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleMealRemove(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {form.formState.errors.meals?.[index]?.mealId && (
                <div className="pl-1 pt-1">
                  <p className="text-sm text-red-500">
                    {form.formState.errors.meals[index]?.mealId?.message}
                  </p>
                </div>
              )}
              {form.formState.errors.meals?.[index]?.quantity && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.meals[index]?.quantity?.message}
                </p>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={handleNewMeal}
            className="w-full"
            size="sm"
          >
            Add another meal
          </Button>

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
