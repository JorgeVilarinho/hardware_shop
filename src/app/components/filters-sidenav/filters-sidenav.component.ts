import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-filters-sidenav',
  imports: [ MatIconModule, MatButtonModule, MatExpansionModule, MatSliderModule ],
  templateUrl: './filters-sidenav.component.html',
  styleUrl: './filters-sidenav.component.css'
})
export class FiltersSidenavComponent {

}
