import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, share, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private http = inject(HttpClient);
  private reviewService = inject(ReviewService);

  readonly products$: Observable<Product[]> = this.http.get<Product[]>(this.productsUrl)
  .pipe(
    tap(data => console.log('Products: ', JSON.stringify(data))),
    shareReplay(1), //cache, umiejscowienie w pipe ma znaczenie, gdy wejdziemy drugi raz na strone to co jest przed shareReplay się nie wyświeli, jedynie After shareReplay.
    tap(data => console.log('After shareReplay')),
    catchError(err => this.handleError(err))
  );

  getProduct(id: number): Observable<Product> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      switchMap(product => this.getProductWithReviews(product)),
      //https://blog.angular-university.io/rxjs-higher-order-mapping/
      tap(x => console.log(x)),
      catchError(err => this.handleError(err))
    );
  }

  getProductWithReviews(product: Product): Observable<Product> {
    if(product.hasReviews) {
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id)).pipe(
        map(reviews => ({...product, reviews} as Product)),
        catchError(err => this.handleError(err))
      )
    }

    return of(product);
  }

  handleError(err: HttpErrorResponse): Observable<never> {
    const  formattedError = `Server returned code: ${err.status}, error message is: ${err.statusText}`;
    return throwError(() => formattedError);
  }

}
