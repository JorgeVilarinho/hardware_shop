import { Order } from "../models/order.model";

export interface GetCanceledOrdersResponse {
  orders: Order[]
}