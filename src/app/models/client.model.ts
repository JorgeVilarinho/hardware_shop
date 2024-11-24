import { User } from "./user.model";

export class Client implements User {
  email: string;
  name: string;
  password: string;
  address?: string;

  constructor(email: string, name: string, password: string, address?: string) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.address = address;
  }
}
