import { Address } from "./address.model";
import { User } from "./user.model";

export class Client implements User {
  email: string;
  name: string;
  dni?: string;
  phone?: string;
  password?: string;
  address?: Address;

  constructor(email: string, name: string, dni?: string, phone?: string, address?: Address, password?: string) {
    this.email = email;
    this.name = name;
    this.dni = dni;
    this.phone = phone;
    this.address = address;
    this.password = password;
  }
}
