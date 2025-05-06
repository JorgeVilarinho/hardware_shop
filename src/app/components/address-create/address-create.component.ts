import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StateService } from '../../services/state.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-address-create',
  imports: [ReactiveFormsModule],
  templateUrl: './address-create.component.html',
  styleUrl: './address-create.component.css'
})
export class AddressCreateComponent {
  cpRegex = /^[0-9]{5}$/i;
  phoneRegex = /^[0-9]{9}$/i

  formBuilder = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  stateService = inject(StateService);
  userService = inject(UserService);
  addressForm = this.formBuilder.group({
    fullName: ['', Validators.required],
    address: ['', Validators.required],
    cp: ['', [ Validators.required, Validators.pattern(this.cpRegex) ]],
    region: ['', Validators.required],
    city: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(this.phoneRegex) ]]
  });
  isSubmited = false;

  onSubmit(): void {
    if(this.addressForm.valid) {
      this.addAddress();
    } else {
      this.snackBar.open("Los campos introducidos no son válidos", 'Ok', { duration: 3000 });
    }
    this.isSubmited = true;
  }

  nameHasRequiredError(): boolean | undefined {
    return this.addressForm.get('fullName')?.hasError('required') && (this.addressForm.get('fullName')?.dirty
    || this.addressForm.get('fullName')?.touched || this.isSubmited);
  }

  addressHasRequiredError(): boolean | undefined {
    return this.addressForm.get('address')?.hasError('required') && (this.addressForm.get('address')?.dirty
    || this.addressForm.get('address')?.touched || this.isSubmited);
  }

  cpHasRequiredError(): boolean | undefined {
    return this.addressForm.get('cp')?.hasError('required') && (this.addressForm.get('cp')?.dirty
    || this.addressForm.get('cp')?.touched || this.isSubmited);
  }

  cpHasPatternError(): boolean | undefined {
    return this.addressForm.get('cp')?.hasError('pattern') && (this.addressForm.get('cp')?.dirty
    || this.addressForm.get('cp')?.touched || this.isSubmited);
  }

  provinciaHasRequiredError(): boolean | undefined {
    return this.addressForm.get('region')?.hasError('required') && (this.addressForm.get('region')?.dirty
    || this.addressForm.get('region')?.touched || this.isSubmited);
  }

  cityHasRequiredError(): boolean | undefined {
    return this.addressForm.get('city')?.hasError('required') && (this.addressForm.get('city')?.dirty
    || this.addressForm.get('city')?.touched || this.isSubmited);
  }

  phoneHasRequiredError(): boolean | undefined {
    return this.addressForm.get('phone')?.hasError('required') && (this.addressForm.get('phone')?.dirty
    || this.addressForm.get('phone')?.touched || this.isSubmited);
  }

  phoneHasPatternError(): boolean | undefined {
    return this.addressForm.get('phone')?.hasError('pattern') && (this.addressForm.get('phone')?.dirty
    || this.addressForm.get('phone')?.touched || this.isSubmited);
  }

  invalidName(): boolean | undefined {
    return this.addressForm.get('fullName')?.invalid && (this.addressForm.get('fullName')?.dirty
          || this.addressForm.get('fullName')?.touched || this.isSubmited);
  }

  invalidAddress(): boolean | undefined {
    return this.addressForm.get('address')?.invalid && (this.addressForm.get('address')?.dirty
          || this.addressForm.get('address')?.touched || this.isSubmited);
  }

  invalidCP(): boolean | undefined {
    return this.addressForm.get('cp')?.invalid && (this.addressForm.get('cp')?.dirty
          || this.addressForm.get('cp')?.touched || this.isSubmited);
  }

  invalidProvincia(): boolean | undefined {
    return this.addressForm.get('region')?.invalid && (this.addressForm.get('region')?.dirty
          || this.addressForm.get('region')?.touched || this.isSubmited);
  }

  invalidCity(): boolean | undefined {
    return this.addressForm.get('city')?.invalid && (this.addressForm.get('city')?.dirty
          || this.addressForm.get('city')?.touched || this.isSubmited);
  }

  invalidPhone(): boolean | undefined {
    return this.addressForm.get('phone')?.invalid && (this.addressForm.get('phone')?.dirty
          || this.addressForm.get('phone')?.touched || this.isSubmited);
  }

  changeInitialAddressComponentToActive(): void {
    this.stateService.changeInitialAddressComponentToActive();
  }

  addAddress(): void {
    this.userService.addAddress(
      this.addressForm.get('fullName')!.value!,
      this.addressForm.get('address')!.value!,
      this.addressForm.get('cp')!.value!,
      this.addressForm.get('region')!.value!,
      this.addressForm.get('city')!.value!,
      this.addressForm.get('phone')!.value!)
  }
}
