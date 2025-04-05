import { Pc } from "./pc.model";
import { Product } from "./product.model";

export interface Cart {
  items: Product[],
  pcs: Pc[]
}
