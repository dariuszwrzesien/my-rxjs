import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { computed, inject, Injectable, signal } from '@angular/core'
import {
  catchError,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs'
import { Product, Result } from './product'
import { ReviewService } from '../reviews/review.service'
import { Review } from '../reviews/review'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products'
  private http = inject(HttpClient)
  private reviewService = inject(ReviewService)

  selectedProductId = signal<number | undefined>(undefined)

  private productsResult$: Observable<Result<Product[]>> = this.http
    .get<Product[]>(this.productsUrl)
    .pipe(
      map((product) => ({ data: product }) as Result<Product[]>),
      tap((data) => console.log('Products: ', JSON.stringify(data))),
      shareReplay(1), //cache, umiejscowienie w pipe ma znaczenie, gdy wejdziemy drugi raz na strone to co jest przed shareReplay się nie wyświeli, jedynie After shareReplay.
      tap((data) => console.log('After shareReplay', data)),
      catchError((err) =>
        of({
          data: [],
          error: `Server returned code: ${err.status}, error message is: ${err.statusText}`,
        } as Result<Product[]>)
      )
    )

  private productsResult = toSignal(this.productsResult$, {
    initialValue: { data: [] } as Result<Product[]>,
  })
  products = computed(() => this.productsResult().data)
  productsError = computed(() => this.productsResult().error)

  // private productResult1$ = toObservable(this.selectedProductId).pipe(
  //   filter(Boolean),
  //   switchMap((id) => {
  //     const url = `${this.productsUrl}/${id}`
  //     return this.http.get<Product>(url).pipe(
  //       switchMap((product) => this.getProductWithReviews(product)),
  //       //https://blog.angular-university.io/rxjs-higher-order-mapping/
  //       catchError((err) =>
  //         of({
  //           data: undefined,
  //           error: `Server returned code: ${err.status}, error message is: ${err.statusText}`,
  //         } as Result<Product>)
  //       )
  //     )
  //   }),
  //   map((product) => ({ data: product }) as Result<Product>)
  //   // shareReplay(1)
  // )

  private productResult$ = combineLatest([
    toObservable(this.selectedProductId),
    this.productsResult$,
  ]).pipe(
    map(([selectedProductId, products]) =>
      products.data?.find(
        (product: Product) => product.id === selectedProductId
      )
    ),
    filter(Boolean),
    switchMap((product) => this.getProductWithReviews(product)),
    //https://blog.angular-university.io/rxjs-higher-order-mapping/
    catchError((err) => this.handleError(err)),
    map((product) => ({ data: product }) as Result<Product>)
  )

  private productResult = toSignal(this.productResult$, {
    initialValue: { data: undefined } as Result<Product>,
  })
  product = computed(() => this.productResult().data)
  productError = computed(() => this.productResult()?.error)

  productSelected(selectedProductId: number): void {
    this.selectedProductId.set(selectedProductId)
  }

  getProductWithReviews(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.http
        .get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(
          map((reviews) => ({ ...product, reviews }) as Product),
          catchError((err) => this.handleError(err))
        )
    }

    return of(product)
  }

  handleError(err: HttpErrorResponse): Observable<never> {
    const formattedError = `Server returned code: ${err.status}, error message is: ${err.statusText}`
    return throwError(() => formattedError)
  }
}
