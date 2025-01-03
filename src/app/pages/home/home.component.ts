import { StateService } from './../../services/state.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductBoxComponent } from "../../components/product-box/product-box.component";
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-home',
  imports: [MatGridListModule, ProductBoxComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  breakpointObserver = inject(BreakpointObserver);
  stateService = inject(StateService);
  productsService = inject(ProductsService);

  cols: number = 5;
  products: Array<Product> = []

  constructor() {
    this.setBreakPoints();
    this.listenToGetAllProducts();
  }

  ngOnInit(): void {
    this.productsService.getAllProducts();
  }

  // TODO: Instead of mediaquery establish a container query
  private setBreakPoints(): void {
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

  private listenToGetAllProducts(): void {
    this.productsService.getAllProducts$
    .pipe(takeUntilDestroyed())
    .subscribe(products => {
      this.products = products;
    })
  }
}
