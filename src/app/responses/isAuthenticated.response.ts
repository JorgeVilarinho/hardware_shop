import { Client } from "../models/client.model";
import { Employee } from "../models/employee.model";

export interface isAuthenticatedResponse {
  user: Client | Employee
}