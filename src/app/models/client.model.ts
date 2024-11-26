import { Address } from "./address.model";
import { User } from "./user.model";

export class Client implements User {
  email: string;
  name: string;
  password: string;
  address?: Address;

  constructor(email: string, name: string, password: string, address?: Address) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.address = address;
  }
}
