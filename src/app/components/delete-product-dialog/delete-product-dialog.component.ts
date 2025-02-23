import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-product-dialog',
  imports: [],
  templateUrl: './delete-product-dialog.component.html',
  styleUrl: './delete-product-dialog.component.css'
})
export class DeleteProductDialogComponent {
  productId: string | null = null

  refDialog = inject(MatDialogRef<DeleteProductDialogComponent>)
  productsService = inject(ProductsService)
  snackBar = inject(MatSnackBar)
  router = inject(Router)

  public closeDialog() {
    this.refDialog.close()
  }

  public async deleteProduct(): Promise<void> {
    const response = await this.productsService.deleteProduct(this.productId!)
    
    if(response.ok) {
      this.snackBar.open('Se ha eliminado el producto correctamente', 'Ok', { duration: 3000 })
      this.router.navigate(['/dashboard/products'])
    }

    this.closeDialog()
  }
}
