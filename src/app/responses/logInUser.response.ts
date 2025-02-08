import { UserType } from "../models/userType";

export interface LogInUserResponse {
  user_id: number,
  kind: UserType,
  name: string,
  email: string,
  dni?: string,
  phone?: string,
  userType: UserType,
  admin: boolean,
  tipo_trabajador: string,
  tipo_trabajador_desc: string
}