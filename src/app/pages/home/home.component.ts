import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductBoxComponent } from "../../components/product-box/product-box.component";

@Component({
  selector: 'app-home',
  imports: [MatGridListModule, ProductBoxComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  cols: number = 4;

  constructor() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).pipe(takeUntilDestroyed())
    .subscribe(_result => {
      const breakpoints = _result.breakpoints;

      if(breakpoints[Breakpoints.XSmall]) {
        this.cols = 1;
      } else if(breakpoints[Breakpoints.Small]) {
        this.cols = 2;
      } else if(breakpoints[Breakpoints.Medium]) {
        this.cols = 3;
      } else if(breakpoints[Breakpoints.Large]) {
        this.cols = 4;
      }
    });
  }
}
