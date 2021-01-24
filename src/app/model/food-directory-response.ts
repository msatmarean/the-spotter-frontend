import { FoodCategory } from "./food-category";
import { FoodDescription } from "./food-description";

export class FoodDirectoryResponse {
  id: number;
  name: String;
  calories: Number;
  proteins: Number;
  carbs: Number;
  fats: Number;
  foodCategory: FoodCategory;
  foodDescription: FoodDescription;
}
