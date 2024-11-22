import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidenav-custom',
  imports: [ MatIconModule, MatIconButton, MatListModule ],
  templateUrl: './sidenav-custom.component.html',
  styleUrl: './sidenav-custom.component.css'
})
export class SidenavCustomComponent {
  @Output() collapsedEvent = new EventEmitter<boolean>();
  opened: boolean = false;

  changeOpened() {
    this.opened = !this.opened;
    this.collapsedEvent.emit(this.opened);
  }
}
