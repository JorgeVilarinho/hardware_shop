import { Component, Signal, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidenavCustomComponent } from './components/sidenav-custom/sidenav-custom.component';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, HeaderComponent, MatSidenavModule, SidenavCustomComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  opened: boolean = false;

  setOpened(collapsed: boolean) {
    this.opened = collapsed;
  }
}
