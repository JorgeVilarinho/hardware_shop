import { EmployeeService } from './../../services/employee.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeType } from '../../models/employeeType.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-employee',
  imports: [ MatIcon, RouterModule, ReactiveFormsModule ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent implements OnInit {
  dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  phoneRegex = /^[0-9]{9}$/i;

  employeeTypes: EmployeeType[] = []
  isSubmitted = false

  employeeService = inject(EmployeeService)
  formBuilder = inject(FormBuilder)
  snackBar = inject(MatSnackBar)
  router = inject(Router)

  addEmployeeForm = this.formBuilder.group({
    fullName: new FormControl<string>('', Validators.required),
    dni: new FormControl<string>('', [ Validators.required, Validators.pattern(this.dniRegex) ]),
    email: new FormControl<string>('', [ Validators.required, Validators.email ]),
    phone: new FormControl<string>('', [ Validators.required, Validators.pattern(this.phoneRegex) ]),
    password: new FormControl<string>('', [ Validators.required, Validators.minLength(6) ]),
    admin: new FormControl<boolean>(false, Validators.required),
    employeeType: new FormControl<string | null>(null, Validators.required)
  })

  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.employeeTypes = await this.employeeService.getEmployeeTypes()
  }

  public nameHasRequiredError(): boolean | undefined {
    return this.addEmployeeForm.get('fullName')?.hasError('required') && (this.addEmployeeForm.get('fullName')?.dirty
    || this.addEmployeeForm.get('fullName')?.touched || this.isSubmitted);
  }

  public dniHasRequiredError(): boolean | undefined {
    return this.addEmployeeForm.get('dni')?.hasError('required') && (this.addEmployeeForm.get('dni')?.dirty
    || this.addEmployeeForm.get('dni')?.touched || this.isSubmitted);
  }

  public dniHasPatternError(): boolean | undefined {
    return this.addEmployeeForm.get('dni')?.hasError('pattern') && (this.addEmployeeForm.get('dni')?.dirty
    || this.addEmployeeForm.get('dni')?.touched || this.isSubmitted);
  }

  public emailHasRequiredError(): boolean | undefined {
    return this.addEmployeeForm.get('email')?.hasError('required') && (this.addEmployeeForm.get('email')?.dirty
    || this.addEmployeeForm.get('email')?.touched || this.isSubmitted);
  }

  public emailHasEmailTypeError(): boolean | undefined {
    return this.addEmployeeForm.get('email')?.hasError('email') && (this.addEmployeeForm.get('email')?.dirty
    || this.addEmployeeForm.get('email')?.touched || this.isSubmitted);
  }

  public phoneHasRequiredError(): boolean | undefined {
    return this.addEmployeeForm.get('phone')?.hasError('required') && (this.addEmployeeForm.get('phone')?.dirty
    || this.addEmployeeForm.get('phone')?.touched || this.isSubmitted);
  }

  public phoneHasPatternError(): boolean | undefined {
    return this.addEmployeeForm.get('phone')?.hasError('pattern') && (this.addEmployeeForm.get('phone')?.dirty
    || this.addEmployeeForm.get('phone')?.touched || this.isSubmitted);
  }

  public employeeTypeHasRequiredError(): boolean | undefined {
    return this.addEmployeeForm.get('employeeType')?.hasError('required') && (this.addEmployeeForm.get('employeeType')?.dirty
    || this.addEmployeeForm.get('employeeType')?.touched || this.isSubmitted);
  }

  public passwordHasRequiredError(): boolean | undefined {
    return this.addEmployeeForm.get('password')?.hasError('required') && (this.addEmployeeForm.get('password')?.dirty
    || this.addEmployeeForm.get('password')?.touched || this.isSubmitted);
  }

  public passwordHasLenghtError(): boolean | undefined {
    return this.addEmployeeForm.get('password')?.hasError('minlength') && (this.addEmployeeForm.get('password')?.dirty
    || this.addEmployeeForm.get('password')?.touched || this.isSubmitted);
  }

  public invalidName(): boolean | undefined {
    return this.addEmployeeForm.get('fullName')?.invalid && (this.addEmployeeForm.get('fullName')?.dirty
          || this.addEmployeeForm.get('fullName')?.touched || this.isSubmitted);
  }

  public invalidDni(): boolean | undefined {
    return this.addEmployeeForm.get('dni')?.invalid && (this.addEmployeeForm.get('dni')?.dirty
          || this.addEmployeeForm.get('dni')?.touched || this.isSubmitted);
  }

  public invalidEmail(): boolean | undefined {
    return this.addEmployeeForm.get('email')?.invalid && (this.addEmployeeForm.get('email')?.dirty
          || this.addEmployeeForm.get('email')?.touched || this.isSubmitted);
  }

  public invalidPhone(): boolean | undefined {
    return this.addEmployeeForm.get('phone')?.invalid && (this.addEmployeeForm.get('phone')?.dirty
          || this.addEmployeeForm.get('phone')?.touched || this.isSubmitted);
  }

  public invalidPassword(): boolean | undefined {
    return this.addEmployeeForm.get('password')?.invalid && (this.addEmployeeForm.get('password')?.dirty
          || this.addEmployeeForm.get('password')?.touched || this.isSubmitted);
  }

  public invalidEmployeeType(): boolean | undefined {
    return this.addEmployeeForm.get('employeeType')?.invalid && (this.addEmployeeForm.get('employeeType')?.dirty
          || this.addEmployeeForm.get('employeeType')?.touched || this.isSubmitted);
  }

  public async onSubmit(): Promise<void> {
    if(this.addEmployeeForm.valid) {
      const response = await this.employeeService.createEmployee(
        this.addEmployeeForm.get('fullName')!.value!,
        this.addEmployeeForm.get('dni')!.value!,
        this.addEmployeeForm.get('email')!.value!,
        this.addEmployeeForm.get('phone')!.value!,
        this.addEmployeeForm.get('password')!.value!,
        this.addEmployeeForm.get('admin')!.value!,
        this.addEmployeeForm.get('employeeType')!.value!
      )

      if(response.ok) {
        this.snackBar.open('Se ha creado el trabajador correctamente', 'Ok', { duration: 3000 })
        this.router.navigate(['..'], { relativeTo: this.route })
      } else {
        this.snackBar.open('No se ha podido crear el trabajador', 'Ok', { duration: 3000 })
      }
    } else {
      this.snackBar.open('Los datos para crear el empleado no son válidos', 'Ok', { duration: 3000 });
    }

    this.isSubmitted = true
  }
}
