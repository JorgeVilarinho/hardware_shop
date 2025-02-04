import { User } from "./user.model";

export class Employee implements User {
  email: string
  name: string
  dni?: string
  phone?: string
  password: string
  tipo_trabajador: string
  admin: boolean

  constructor(email: string, name: string, password: string, tipo_trabajador: string, admin: boolean, dni?: string, phone?: string) {
    this.email = email
    this.name = name
    this.password = password
    this.tipo_trabajador = tipo_trabajador
    this.admin = admin
    this.dni = dni
    this.phone = phone
  }
}
