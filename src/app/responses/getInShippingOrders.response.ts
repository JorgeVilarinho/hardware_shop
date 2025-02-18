import { Order } from "../models/order.model";

export interface GetInShippingOrdersResponse {
  orders: Order[]
}