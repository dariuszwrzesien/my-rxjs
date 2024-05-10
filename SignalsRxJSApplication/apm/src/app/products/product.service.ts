import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      catchError(err => this.handleError(err))
    );
  }

  getProduct(id: number): Observable<Product> {
    const url = `${this.productsUrl}/s${id}`;
    return this.http.get<Product>(url).pipe(
      catchError(err => this.handleError(err))
    );
  }

  handleError(err: HttpErrorResponse): Observable<never> {
    const  formattedError = `Server returned code: ${err.status}, error message is: ${err.statusText}`;
    return throwError(() => formattedError);
  }

}
