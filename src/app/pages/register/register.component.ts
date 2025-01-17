import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RegisterFormComponent } from "../../components/register-form/register-form.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ MatIconModule, RegisterFormComponent, RouterLink ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

}
