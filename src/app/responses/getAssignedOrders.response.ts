import { Order } from "../models/order.model";

export interface GetAssignedOrdersResponse {
  orders: Order[]
}