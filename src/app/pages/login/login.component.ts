import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ MatButtonModule, MatIconModule, LoginFormComponent, RouterLink ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  {
  redirectToCheckout: boolean = false

  constructor(private router: Router) {
    if(this.router.getCurrentNavigation()?.extras.state) {
      this.redirectToCheckout = this.router.getCurrentNavigation()?.extras.state!['redirectToCheckout'] ?? false
    }
  }
}
