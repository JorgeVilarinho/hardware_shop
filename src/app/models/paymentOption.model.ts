import { PaymentOptionValue } from "./paymentOptionValue.models";

export interface PaymentOption {
  id: number,
  valor: PaymentOptionValue,
  descripcion: string,
  imagen: string,
  informacion_adicional: string
}