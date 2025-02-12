import { Order } from "../models/order.model";

export interface GetUnassignedOrdersResponse {
  orders: Order[]
}