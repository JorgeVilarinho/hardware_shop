import { Product } from "./product.model";

export interface PcData {
  components: Product[],
  assembly: boolean
}