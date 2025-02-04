import { UserType } from "../models/userType";

export interface LogInUserResponse {
  name: string,
  email: string,
  dni?: string,
  phone?: string,
  userType: UserType,
  admin: boolean
}