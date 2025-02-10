import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeType } from '../../models/employeeType.model';

@Component({
  selector: 'app-update-employee',
  imports: [ MatIcon, ReactiveFormsModule, RouterModule ],
  templateUrl: './update-employee.component.html',
  styleUrl: './update-employee.component.css',
})
export class UpdateEmployeeComponent implements OnInit {
  dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  phoneRegex = /^[0-9]{9}$/i;

  employeeId: string | null;
  employee: Employee | null = null;
  employeeTypes: EmployeeType[] = []
  isSubmitted = false

  employeeService = inject(EmployeeService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  updateEmployeeForm = this.formBuilder.group({
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

  constructor(private route: ActivatedRoute) {
    this.employeeId = this.route.snapshot.paramMap.get('id');
  }

  async ngOnInit(): Promise<void> {
    this.employee = await this.employeeService.getEmployee(this.employeeId);
    this.employeeTypes = await this.employeeService.getEmployeeTypes();
    this.loadEmployeeData()
  }

  public nameHasRequiredError(): boolean | undefined {
    return this.updateEmployeeForm.get('fullName')?.hasError('required') && (this.updateEmployeeForm.get('fullName')?.dirty
    || this.updateEmployeeForm.get('fullName')?.touched || this.isSubmitted);
  }

  public dniHasRequiredError(): boolean | undefined {
    return this.updateEmployeeForm.get('dni')?.hasError('required') && (this.updateEmployeeForm.get('dni')?.dirty
    || this.updateEmployeeForm.get('dni')?.touched || this.isSubmitted);
  }

  public dniHasPatternError(): boolean | undefined {
    return this.updateEmployeeForm.get('dni')?.hasError('pattern') && (this.updateEmployeeForm.get('dni')?.dirty
    || this.updateEmployeeForm.get('dni')?.touched || this.isSubmitted);
  }

  public emailHasRequiredError(): boolean | undefined {
    return this.updateEmployeeForm.get('email')?.hasError('required') && (this.updateEmployeeForm.get('email')?.dirty
    || this.updateEmployeeForm.get('email')?.touched || this.isSubmitted);
  }

  public emailHasEmailTypeError(): boolean | undefined {
    return this.updateEmployeeForm.get('email')?.hasError('email') && (this.updateEmployeeForm.get('email')?.dirty
    || this.updateEmployeeForm.get('email')?.touched || this.isSubmitted);
  }

  public phoneHasRequiredError(): boolean | undefined {
    return this.updateEmployeeForm.get('phone')?.hasError('required') && (this.updateEmployeeForm.get('phone')?.dirty
    || this.updateEmployeeForm.get('phone')?.touched || this.isSubmitted);
  }

  public phoneHasPatternError(): boolean | undefined {
    return this.updateEmployeeForm.get('phone')?.hasError('pattern') && (this.updateEmployeeForm.get('phone')?.dirty
    || this.updateEmployeeForm.get('phone')?.touched || this.isSubmitted);
  }

  public employeeTypeHasRequiredError(): boolean | undefined {
    return this.updateEmployeeForm.get('employeeType')?.hasError('required') && (this.updateEmployeeForm.get('employeeType')?.dirty
    || this.updateEmployeeForm.get('employeeType')?.touched || this.isSubmitted);
  }

  public passwordHasRequiredError(): boolean | undefined {
    return this.updateEmployeeForm.get('password')?.hasError('required') && (this.updateEmployeeForm.get('password')?.dirty
    || this.updateEmployeeForm.get('password')?.touched || this.isSubmitted);
  }

  public passwordHasLenghtError(): boolean | undefined {
    return this.updateEmployeeForm.get('password')?.hasError('minlength') && (this.updateEmployeeForm.get('password')?.dirty
    || this.updateEmployeeForm.get('password')?.touched || this.isSubmitted);
  }

  public async onSubmit(): Promise<void> {
    if(this.updateEmployeeForm.valid) {
      const response = await this.employeeService.updateEmployee(
        this.employee?.id!,
        this.employee?.user_id!,
        this.updateEmployeeForm.get('fullName')!.value!,
        this.updateEmployeeForm.get('dni')!.value!,
        this.updateEmployeeForm.get('email')!.value!,
        this.updateEmployeeForm.get('phone')!.value!,
        this.updateEmployeeForm.get('password')!.value!,
        this.updateEmployeeForm.get('updatePassword')!.value!,
        this.updateEmployeeForm.get('admin')!.value!,
        this.updateEmployeeForm.get('employeeType')!.value!
      )

      if(response.ok) {
        this.snackBar.open('Se ha actualizado los datos del trabajador correctamente', 'Ok', { duration: 3000 })
        this.router.navigate(['../../employees'], { relativeTo: this.route })
      }
    } else {
      this.snackBar.open('Los datos para actualizar el empleado no son válidos', 'Ok', { duration: 3000 });
    }

    this.isSubmitted = true
  }

  public tooglePasswordDisabled(): void {
    if(this.updateEmployeeForm.get('updatePassword')?.value) {
      this.updateEmployeeForm.get('password')?.enable()  
    } else {
      this.updateEmployeeForm.get('password')?.disable()
    }
  }

  private loadEmployeeData(): void {
    this.updateEmployeeForm.get('fullName')!.setValue(this.employee?.name ?? '')
    this.updateEmployeeForm.get('dni')!.setValue(this.employee?.dni ?? '')
    this.updateEmployeeForm.get('email')!.setValue(this.employee?.email ?? '')
    this.updateEmployeeForm.get('phone')!.setValue(this.employee?.phone ?? '')
    this.updateEmployeeForm.get('admin')!.setValue(this.employee?.admin ?? false)
    this.updateEmployeeForm.get('employeeType')!.setValue(this.employee?.tipo_trabajador ?? null)
  }
}
