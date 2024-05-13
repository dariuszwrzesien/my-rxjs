import { Component, inject, Input, OnChanges, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription } from 'rxjs';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [AsyncPipe, NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent {
  errorMessage = '';
  private productService = inject(ProductService);

  // Product to display
  product$ = this.productService.product$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    )

  // pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : this.pageTitle;
  pageTitle = 'Product Detail';

  addToCart(product: Product) {

  }
}
