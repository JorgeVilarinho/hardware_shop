import { UserType } from "./userType"

export interface User {
  user_id: number
  kind?: UserType
  email: string
  name: string
  dni?: string
  phone?: string
  password?: string
}
