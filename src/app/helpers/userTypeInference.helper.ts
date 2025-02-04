import { User } from './../models/user.model';
import { Client } from "../models/client.model";
import { Employee } from "../models/employee.model";

export class UserTypeInferenceHelper {
  public static isClient(user: User): Client | undefined {
    if('address' in user) return user as Client

    return undefined
  }

  public static isEmployee(user: User): Employee | undefined {
    if('tipo_trabajador' in user) {
      return user as Employee
    }

    return undefined
  }
}