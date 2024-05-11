import { Component, inject, Input, OnChanges, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription } from 'rxjs';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements OnChanges, OnDestroy {
  // Just enough here for the template to compile
  @Input() productId: number = 0;
  errorMessage = '';

  private productService = inject(ProductService);
  private productSubscription = new Subscription();

  // Product to display
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const productId = changes['productId'].currentValue;
    if (productId) {
      this.productSubscription = this.productService.getProduct(productId)
      .pipe(
        catchError(err => {
          this.errorMessage = err;
          return EMPTY;
        })
      )
      .subscribe(product => this.product = product);
    }
  }

  addToCart(product: Product) {

  }
}
