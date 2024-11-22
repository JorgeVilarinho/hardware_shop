import { Component, EventEmitter, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
  selector: 'app-header',
  imports: [ MatToolbarModule, MatIconModule, MatButtonModule, MatBadgeModule, MatSidenavModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() collapsedEvent = new EventEmitter<boolean>();

  opened = false;

  changeOpened() {
    this.opened = !this.opened;
    this.collapsedEvent.emit(this.opened);
  }
}
