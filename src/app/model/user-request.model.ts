export class UserRequest {
  private firstName: string;
  private lastName: string;
  private email: string;
  private password: string;

  set setFirstName(firstName: string) {
    this.firstName = firstName;
  }

  get getFirstName() {
    return this.firstName;
  }

  set setLastName(lastName: string) {
    this.lastName = lastName;
  }

  get getLastName() {
    return this.lastName;
  }

  set setEmail(email: string) {
    this.email = email;
  }

  get getEmail() {
    return this.email;
  }

  set setPassword(password: string) {
    this.password = password;
  }

  get getPassword() {
    return this.password;
  }
}
