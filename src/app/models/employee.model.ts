import { User } from './user.model';
import { UserType } from './userType';

export class Employee implements User {
  user_id: number;
  kind: UserType;
  id: number;
  email: string;
  name: string;
  dni?: string;
  phone?: string;
  password: string;
  admin: boolean;
  tipo_trabajador: string;
  tipo_trabajador_desc: string;

  constructor(
    user_id: number,
    kind: UserType,
    id: number,
    email: string,
    name: string,
    password: string,
    tipo_trabajador: string,
    tipo_trabajador_desc: string,
    admin: boolean,
    dni?: string,
    phone?: string
  ) {
    this.user_id = user_id;
    this.kind = kind;
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
    this.tipo_trabajador = tipo_trabajador;
    this.tipo_trabajador_desc = tipo_trabajador_desc;
    this.admin = admin;
    this.dni = dni;
    this.phone = phone;
  }
}
