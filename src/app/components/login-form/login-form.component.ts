import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [ ReactiveFormsModule, MatIconModule, NgClass, RouterLink ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  formBuilder = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  registerForm = this.formBuilder.group({
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [Validators.required, Validators.minLength(6) ]]
  });
  isSubmited = false

  onSubmit(): void {
    this.snackBar.open("TODO", 'Ok', { duration: 3000 });
    this.isSubmited = true;
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

  invalidEmail(): boolean | undefined {
    return this.registerForm.get('email')?.invalid && (this.registerForm.get('email')?.dirty
          || this.registerForm.get('email')?.touched || this.isSubmited);
  }

  invalidPassword(): boolean | undefined {
    return  this.registerForm.get('password')?.invalid && (this.registerForm.get('password')?.dirty
      || this.registerForm.get('password')?.touched || this.isSubmited);
  }
}
