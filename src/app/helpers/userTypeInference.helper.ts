import { User } from './../models/user.model';
import { Client } from "../models/client.model";
import { Employee } from "../models/employee.model";
import { UserType } from '../models/userType';

export class UserTypeInferenceHelper {
  public static isClient(user: User): Client | undefined {
    if(user.kind == UserType.CLIENT) return user as Client

    return undefined
  }

  public static isEmployee(user: User): Employee | undefined {
    if(user.kind == UserType.EMPLOYEE) return user as Employee

    return undefined
  }
}