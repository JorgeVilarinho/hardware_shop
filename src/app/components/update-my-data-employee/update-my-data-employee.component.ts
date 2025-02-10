import { AuthenticationService } from './../../services/authentication.service';
import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeType } from '../../models/employeeType.model';
import { Employee } from '../../models/employee.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-my-data-employee',
  imports: [ReactiveFormsModule],
  templateUrl: './update-my-data-employee.component.html',
  styleUrl: './update-my-data-employee.component.css',
})
export class UpdateMyDataEmployeeComponent implements OnInit {
  dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  phoneRegex = /^[0-9]{9}$/i;

  employeeService = inject(EmployeeService);
  authenticationService = inject(AuthenticationService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  employeeTypes: EmployeeType[] = []
  employee: Employee

  updateMyDataEmployee = this.formBuilder.group({
    fullName: new FormControl<string>('', Validators.required),
    dni: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(this.dniRegex),
    ]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phone: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(this.phoneRegex),
    ]),
    password: new FormControl<string>({ value: '', disabled: true }, [
      Validators.required,
      Validators.minLength(6),
    ]),
    updatePassword: new FormControl<boolean>(false, Validators.required),
    admin: new FormControl<boolean>(false, Validators.required),
    employeeType: new FormControl<string | null>(null, Validators.required),
  });
  isSubmitted = false

  constructor() {
    this.employee = this.authenticationService.loggedInUser as Employee
  }

  async ngOnInit(): Promise<void> {
    this.employeeTypes = await this.employeeService.getEmployeeTypes()
    this.employee = this.authenticationService.loggedInUser as Employee
    this.loadEmployeeData()
  }

  public nameHasRequiredError(): boolean | undefined {
    return this.updateMyDataEmployee.get('fullName')?.hasError('required') && (this.updateMyDataEmployee.get('fullName')?.dirty
    || this.updateMyDataEmployee.get('fullName')?.touched || this.isSubmitted);
  }

  public dniHasRequiredError(): boolean | undefined {
    return this.updateMyDataEmployee.get('dni')?.hasError('required') && (this.updateMyDataEmployee.get('dni')?.dirty
    || this.updateMyDataEmployee.get('dni')?.touched || this.isSubmitted);
  }

  public dniHasPatternError(): boolean | undefined {
    return this.updateMyDataEmployee.get('dni')?.hasError('pattern') && (this.updateMyDataEmployee.get('dni')?.dirty
    || this.updateMyDataEmployee.get('dni')?.touched || this.isSubmitted);
  }

  public emailHasRequiredError(): boolean | undefined {
    return this.updateMyDataEmployee.get('email')?.hasError('required') && (this.updateMyDataEmployee.get('email')?.dirty
    || this.updateMyDataEmployee.get('email')?.touched || this.isSubmitted);
  }

  public emailHasEmailTypeError(): boolean | undefined {
    return this.updateMyDataEmployee.get('email')?.hasError('email') && (this.updateMyDataEmployee.get('email')?.dirty
    || this.updateMyDataEmployee.get('email')?.touched || this.isSubmitted);
  }

  public phoneHasRequiredError(): boolean | undefined {
    return this.updateMyDataEmployee.get('phone')?.hasError('required') && (this.updateMyDataEmployee.get('phone')?.dirty
    || this.updateMyDataEmployee.get('phone')?.touched || this.isSubmitted);
  }

  public phoneHasPatternError(): boolean | undefined {
    return this.updateMyDataEmployee.get('phone')?.hasError('pattern') && (this.updateMyDataEmployee.get('phone')?.dirty
    || this.updateMyDataEmployee.get('phone')?.touched || this.isSubmitted);
  }

  public employeeTypeHasRequiredError(): boolean | undefined {
    return this.updateMyDataEmployee.get('employeeType')?.hasError('required') && (this.updateMyDataEmployee.get('employeeType')?.dirty
    || this.updateMyDataEmployee.get('employeeType')?.touched || this.isSubmitted);
  }

  public passwordHasRequiredError(): boolean | undefined {
    return this.updateMyDataEmployee.get('password')?.hasError('required') && (this.updateMyDataEmployee.get('password')?.dirty
    || this.updateMyDataEmployee.get('password')?.touched || this.isSubmitted);
  }

  public passwordHasLenghtError(): boolean | undefined {
    return this.updateMyDataEmployee.get('password')?.hasError('minlength') && (this.updateMyDataEmployee.get('password')?.dirty
    || this.updateMyDataEmployee.get('password')?.touched || this.isSubmitted);
  }

  public async onSubmit(): Promise<void> {
    if(this.updateMyDataEmployee.valid) {
      const response = await this.employeeService.updateEmployee(
        this.employee?.id!,
        this.employee?.user_id!,
        this.updateMyDataEmployee.get('fullName')!.value!,
        this.updateMyDataEmployee.get('dni')!.value!,
        this.updateMyDataEmployee.get('email')!.value!,
        this.updateMyDataEmployee.get('phone')!.value!,
        this.updateMyDataEmployee.get('password')!.value!,
        this.updateMyDataEmployee.get('updatePassword')!.value!,
        this.updateMyDataEmployee.get('admin')!.value!,
        this.updateMyDataEmployee.get('employeeType')!.value!
      )

      if(response.ok) {
        this.snackBar.open('Se ha actualizado los datos del trabajador correctamente', 'Ok', { duration: 3000 })
        this.router.navigate(['dashboard/employees'])
      }
    } else {
      this.snackBar.open('Los datos no son válidos', 'Ok', { duration: 3000 });
    }

    this.isSubmitted = true
  }

  public tooglePasswordDisabled(): void {
    if(this.updateMyDataEmployee.get('updatePassword')?.value) {
      this.updateMyDataEmployee.get('password')?.enable()  
    } else {
      this.updateMyDataEmployee.get('password')?.disable()
    }
  }

  private loadEmployeeData(): void {
    this.updateMyDataEmployee.get('fullName')!.setValue(this.employee?.name ?? '')
    this.updateMyDataEmployee.get('dni')!.setValue(this.employee?.dni ?? '')
    this.updateMyDataEmployee.get('email')!.setValue(this.employee?.email ?? '')
    this.updateMyDataEmployee.get('phone')!.setValue(this.employee?.phone ?? '')
    this.updateMyDataEmployee.get('admin')!.setValue(this.employee?.admin ?? false)
    this.updateMyDataEmployee.get('employeeType')!.setValue(this.employee?.tipo_trabajador ?? null)
  }
}
