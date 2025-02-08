import { Address } from './address.model';
import { User } from './user.model';
import { UserType } from './userType';

export class Client implements User {
  user_id: number;
  kind: UserType;
  email: string;
  name: string;
  dni?: string;
  phone?: string;
  password?: string;
  address?: Address;

  constructor(
    user_id: number,
    kind: UserType,
    email: string,
    name: string,
    password?: string,
    dni?: string,
    phone?: string,
    address?: Address
  ) {
    this.user_id = user_id;
    this.kind = kind;
    this.email = email;
    this.name = name;
    this.dni = dni;
    this.phone = phone;
    this.address = address;
    this.password = password;
  }
}
