import { PcProduct } from "./pcProduct.model";
import { Product } from "./product.model";

export interface Cart {
  items: Product[],
  pcs: PcProduct[]
}
