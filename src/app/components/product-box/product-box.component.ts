import { Component, Input } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { Product } from '../../models/product.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-box',
  imports: [ MatCard, MatButtonModule ],
  templateUrl: './product-box.component.html',
  styleUrl: './product-box.component.css'
})
export class ProductBoxComponent {
  @Input() product: Product | undefined;
}
