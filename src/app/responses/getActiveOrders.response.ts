import { Order } from "../models/order.model";

export interface GetActiveOrdersResponse {
  orders: Order[]
}