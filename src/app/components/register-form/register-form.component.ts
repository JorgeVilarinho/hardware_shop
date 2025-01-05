import { AuthenticationService } from './../../services/authentication.service';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-form',
  imports: [ ReactiveFormsModule, NgClass, RouterLink ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  formBuilder = inject(FormBuilder);
  snackbar = inject(MatSnackBar);
  authenticationService = inject(AuthenticationService);
  registerForm = this.formBuilder.group({
    clientName: ['', [ Validators.required ]],
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [ Validators.required, Validators.minLength(6) ]]
  });
  isSubmited = false

  onSubmit(): void {
    if(this.registerForm.valid) {
      this.registerUser(this.registerForm.get('clientName')!.value!,
      this.registerForm.get('email')!.value!,
      this.registerForm.get('password')!.value!)
    } else {
      this.snackbar.open("No se puede hacer el registro debido a que los campos son inválidos", 'Ok', { duration: 3000 });
    }

    this.isSubmited = true;
  }

  registerUser(name: string, email: string, password: string): void {
    this.authenticationService.registerUser(name, email, password);
  }

  emailHasRequiredError(): boolean | undefined {
    return this.registerForm.get('email')?.hasError('required') && (this.registerForm.get('email')?.dirty
    || this.registerForm.get('email')?.touched || this.isSubmited);
  }

  emailHasEmailTypeError(): boolean | undefined {
    return this.registerForm.get('email')?.hasError('email') && (this.registerForm.get('email')?.dirty
    || this.registerForm.get('email')?.touched || this.isSubmited);
  }

  passwordHasRequiredError(): boolean | undefined {
    return this.registerForm.get('password')?.hasError('required') && (this.registerForm.get('password')?.dirty
    || this.registerForm.get('password')?.touched || this.isSubmited);
  }

  passwordHasLenghtError(): boolean | undefined {
    return this.registerForm.get('password')?.hasError('minlength') && (this.registerForm.get('password')?.dirty
    || this.registerForm.get('password')?.touched || this.isSubmited);
  }

  clientNameHasRequiredError(): boolean | undefined {
    return this.registerForm.get('clientName')?.hasError('required') && (this.registerForm.get('usernclientNameame')?.dirty
    || this.registerForm.get('clientName')?.touched || this.isSubmited);
  }

  invalidEmail(): boolean | undefined {
    return this.registerForm.get('email')?.invalid && (this.registerForm.get('email')?.dirty
          || this.registerForm.get('email')?.touched || this.isSubmited);
  }

  invalidPassword(): boolean | undefined {
    return  this.registerForm.get('password')?.invalid && (this.registerForm.get('password')?.dirty
      || this.registerForm.get('password')?.touched || this.isSubmited);
  }

  invalidClientName(): boolean | undefined {
    return this.registerForm.get('clientName')?.invalid && (this.registerForm.get('clientName')?.dirty
    || this.registerForm.get('clientName')?.touched || this.isSubmited);
  }
}
