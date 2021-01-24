import { FoodCategory } from "./food-category";
import { FoodDescription } from "./food-description";

export class FoodDirectory {
  id: number;
  name: String;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  foodCategory: FoodCategory;
  foodDescription: FoodDescription;
  edit: boolean;
}
