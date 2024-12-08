import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NgClass } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-data',
  imports: [ ReactiveFormsModule, NgClass ],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css'
})
export class UserDataComponent {
  dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  phoneRegex = /^[0-9]{9}$/i;

  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  snackbar = inject(MatSnackBar);

  fullname: string = this.userService.getNameFromLoggedInUser();
  dni: string = this.userService.getDniFromLoggedInUser();
  email: string = this.userService.getEmailFromLoggedInUser();
  phone: string = this.userService.getPhoneFromLoggedInUser();
  password: string = this.generateExamplePassword();

  dataForm = this.formBuilder.group({
    fullName: [this.fullname, Validators.required ],
    dni: [this.dni, [ Validators.required, Validators.pattern(this.dniRegex) ]],
    email: [this.email, [ Validators.required, Validators.email ]],
    phone: [this.phone, [ Validators.required, Validators.pattern(this.phoneRegex) ]]
  });
  passwordForm = this.formBuilder.group({
    password: [this.password, [ Validators.required, Validators.minLength(6) ]]
  });

  dataFormIsSubmited = false;
  passwordFormIsSubmited = false;

  constructor() {

  }

  public onSubmitUserData(): void {
    if(this.dataForm.valid) {
      this.changeUserData();
    } else {
      this.snackbar.open("Los datos introducidos no son válidos", "Ok", { duration: 3000 });
    }
  }

  public onSubmitPasswordForm(): void {
    if(this.passwordForm.valid) {
      this.changePassword();
    } else {
      this.snackbar.open("La contraseña no es válida", "Ok", { duration: 3000 });
    }
  }

  private changeUserData(): void {
    this.userService.changeUserData(
      this.dataForm.get('fullName')!.value!,
      this.dataForm.get('dni')!.value!,
      this.dataForm.get('email')!.value!,
      this.dataForm.get('phone')!.value!
    )
  }

  private changePassword(): void {
    this.userService.changePassword(this.passwordForm.get('password')!.value!)
  }

  private generateExamplePassword(): string {
    return 'io~ptMwtE7';
  }

  public nameHasRequiredError(): boolean | undefined {
    return this.dataForm.get('fullName')?.hasError('required') && (this.dataForm.get('fullName')?.dirty
    || this.dataForm.get('fullName')?.touched || this.dataFormIsSubmited);
  }

  public dniHasRequiredError(): boolean | undefined {
    return this.dataForm.get('dni')?.hasError('required') && (this.dataForm.get('dni')?.dirty
    || this.dataForm.get('dni')?.touched || this.dataFormIsSubmited);
  }

  public dniHasPatternError(): boolean | undefined {
    return this.dataForm.get('dni')?.hasError('pattern') && (this.dataForm.get('dni')?.dirty
    || this.dataForm.get('dni')?.touched || this.dataFormIsSubmited);
  }

  public dniToUpperCase(): void {
    this.dataForm.get('dni')!.setValue(this.dataForm.get('dni')?.getRawValue().toUpperCase());
  }

  public phoneHasRequiredError(): boolean | undefined {
    return this.dataForm.get('phone')?.hasError('required') && (this.dataForm.get('phone')?.dirty
    || this.dataForm.get('phone')?.touched || this.dataFormIsSubmited);
  }

  public phoneHasPatternError(): boolean | undefined {
    return this.dataForm.get('phone')?.hasError('pattern') && (this.dataForm.get('phone')?.dirty
    || this.dataForm.get('phone')?.touched || this.dataFormIsSubmited);
  }

  public emailHasRequiredError(): boolean | undefined {
    return this.dataForm.get('email')?.hasError('required') && (this.dataForm.get('email')?.dirty
    || this.dataForm.get('email')?.touched || this.dataFormIsSubmited);
  }

  public emailHasEmailTypeError(): boolean | undefined {
    return this.dataForm.get('email')?.hasError('email') && (this.dataForm.get('email')?.dirty
    || this.dataForm.get('email')?.touched || this.dataFormIsSubmited);
  }

  public passwordHasRequiredError(): boolean | undefined {
    return this.passwordForm.get('password')?.hasError('required') && (this.passwordForm.get('password')?.dirty
    || this.passwordForm.get('password')?.touched || this.passwordFormIsSubmited);
  }

  public passwordHasLenghtError(): boolean | undefined {
    return this.passwordForm.get('password')?.hasError('minlength') && (this.passwordForm.get('password')?.dirty
    || this.passwordForm.get('password')?.touched || this.passwordFormIsSubmited);
  }

  public invalidName(): boolean | undefined {
    return this.dataForm.get('fullName')?.invalid && (this.dataForm.get('fullName')?.dirty
          || this.dataForm.get('fullName')?.touched || this.dataFormIsSubmited);
  }

  public invalidDni(): boolean | undefined {
    return this.dataForm.get('dni')?.invalid && (this.dataForm.get('dni')?.dirty
          || this.dataForm.get('dni')?.touched || this.dataFormIsSubmited);
  }

  public invalidEmail(): boolean | undefined {
    return this.dataForm.get('email')?.invalid && (this.dataForm.get('email')?.dirty
          || this.dataForm.get('email')?.touched || this.dataFormIsSubmited);
  }

  public invalidPhone(): boolean | undefined {
    return this.dataForm.get('phone')?.invalid && (this.dataForm.get('phone')?.dirty
          || this.dataForm.get('phone')?.touched || this.dataFormIsSubmited);
  }

  public invalidPassword(): boolean | undefined {
    return  this.passwordForm.get('password')?.invalid && (this.passwordForm.get('password')?.dirty
      || this.passwordForm.get('password')?.touched || this.passwordFormIsSubmited);
  }
}