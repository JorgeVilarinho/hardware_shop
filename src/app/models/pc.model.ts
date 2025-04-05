import { Product } from "./product.model";

export interface Pc {
  id: number,
  components: Product[],
  assembly: boolean
}