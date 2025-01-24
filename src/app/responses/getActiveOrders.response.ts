import { ActiveOrder } from "../models/activeOrder.model";

export interface GetActiveOrdersResponse {
  orders: ActiveOrder[]
}