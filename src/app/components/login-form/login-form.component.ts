import { AuthenticationService } from './../../services/authentication.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [ ReactiveFormsModule, MatIconModule, RouterLink ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  formBuilder = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  authenticationService = inject(AuthenticationService);
  router = inject(Router);

  registerForm = this.formBuilder.group({
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [Validators.required, Validators.minLength(6) ]]
  });
  isSubmited = false

  public onSubmit(): void {
    if(this.registerForm.valid) {
      this.logInUser(this.registerForm.get('email')!.value!, this.registerForm.get('password')!.value!);
    } else {
      this.snackBar.open("Los campos introducidos no son válidos", 'Ok', { duration: 3000 });
    }
    this.isSubmited = true;
  }

  private logInUser(email: string, password: string): void {
    this.authenticationService.logInUser(email, password);
  }

  public emailHasRequiredError(): boolean | undefined {
    return this.registerForm.get('email')?.hasError('required') && (this.registerForm.get('email')?.dirty
    || this.registerForm.get('email')?.touched || this.isSubmited);
  }

  public emailHasEmailTypeError(): boolean | undefined {
    return this.registerForm.get('email')?.hasError('email') && (this.registerForm.get('email')?.dirty
    || this.registerForm.get('email')?.touched || this.isSubmited);
  }

  public passwordHasRequiredError(): boolean | undefined {
    return this.registerForm.get('password')?.hasError('required') && (this.registerForm.get('password')?.dirty
    || this.registerForm.get('password')?.touched || this.isSubmited);
  }

  public passwordHasLenghtError(): boolean | undefined {
    return this.registerForm.get('password')?.hasError('minlength') && (this.registerForm.get('password')?.dirty
    || this.registerForm.get('password')?.touched || this.isSubmited);
  }

  public invalidEmail(): boolean | undefined {
    return this.registerForm.get('email')?.invalid && (this.registerForm.get('email')?.dirty
          || this.registerForm.get('email')?.touched || this.isSubmited);
  }

  public invalidPassword(): boolean | undefined {
    return  this.registerForm.get('password')?.invalid && (this.registerForm.get('password')?.dirty
      || this.registerForm.get('password')?.touched || this.isSubmited);
  }
}
