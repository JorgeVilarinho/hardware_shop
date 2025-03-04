import { Brand } from "./brand.model";
import { Category } from "./category.model";
import { OrderBy } from "./orderBy.model";

export interface Filters {
  orderBy?: OrderBy,
  minPrice?: number,
  maxPrice?: number,
  category?: Category,
  brands: Brand[],
  searchByText?: string
}