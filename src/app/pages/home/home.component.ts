import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductBoxComponent } from "../../components/product-box/product-box.component";
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  imports: [MatGridListModule, ProductBoxComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  cols: number = 5;

  products: Array<Product> = [
    {
      id: 1,
      description: "Intel Core i5-12400F 4.4GHz Socket 1700 Boxed",
      discount: 38,
      imageUrl: "https://placehold.co/300x300",
      price: 124.95,
      units: 1
    },
    {
      id: 2,
      description: "Intel Core i5-12400F 4.4GHz Socket 1700 Boxed",
      discount: 38,
      imageUrl: "https://placehold.co/300x300",
      price: 124.95,
      units: 1
    },
    {
      id: 3,
      description: "Intel Core i5-12400F 4.4GHz Socket 1700 Boxed",
      discount: 38,
      imageUrl: "https://placehold.co/300x300",
      price: 124.95,
      units: 1
    },
    {
      id: 4,
      description: "Intel Core i5-12400F 4.4GHz Socket 1700 Boxed",
      discount: 38,
      imageUrl: "https://placehold.co/300x300",
      price: 124.95,
      units: 1
    },
    {
      id: 5,
      description: "Intel Core i5-12400F 4.4GHz Socket 1700 Boxed",
      discount: 38,
      imageUrl: "https://placehold.co/300x300",
      price: 124.95,
      units: 1
    },
    {
      id: 6,
      description: "Intel Core i5-12400F 4.4GHz Socket 1700 Boxed",
      discount: 38,
      imageUrl: "https://placehold.co/300x300",
      price: 124.95,
      units: 1
    },
    {
      id: 7,
      description: "Intel Core i5-12400F 4.4GHz Socket 1700 Boxed",
      discount: 38,
      imageUrl: "https://placehold.co/300x300",
      price: 124.95,
      units: 1
    },
    {
      id: 8,
      description: "Intel Core i5-12400F 4.4GHz Socket 1700 Boxed",
      discount: 38,
      imageUrl: "https://placehold.co/300x300",
      price: 124.95,
      units: 1
    }
  ]

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
        this.cols = 2;
      } else if(breakpoints[Breakpoints.Small]) {
        this.cols = 3;
      } else if(breakpoints[Breakpoints.Medium]) {
        this.cols = 4;
      } else if(breakpoints[Breakpoints.Large]) {
        this.cols = 5;
      }
    });
  }
}
