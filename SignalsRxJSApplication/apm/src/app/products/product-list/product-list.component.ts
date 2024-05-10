import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { NgIf, NgFor, NgClass } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent]
})
export class ProductListComponent implements OnInit, OnDestroy{
  pageTitle = 'Products';
  errorMessage = '';
  productListSubscription!: Subscription;
  productSubscriptions!: Subscription;

  private productService = inject(ProductService);

  // Products
  products: Product[] = [];

  // Selected product id to highlight the entry
  selectedProductId: number = 0;

  ngOnDestroy(): void {
    this.productListSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.productListSubscription = this.productService.getProducts()
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    ).subscribe(products => this.products = products);
  }

  onSelected(productId: number): void {
    this.selectedProductId = productId;
  }
}
