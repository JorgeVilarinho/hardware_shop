import { ShippingOptionValue } from "./shippingOptionValue.model";

export interface ShippingOption {
  id: number,
  valor: ShippingOptionValue,
  descripcion: string,
  coste: number,
  imagen: string
}