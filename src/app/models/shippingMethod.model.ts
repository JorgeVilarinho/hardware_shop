import { ShippingMethodValue } from "./shippingMethodValue.model";

export interface ShippingMethod {
  id: number,
  valor: ShippingMethodValue,
  descripcion: string,
  coste: number
}