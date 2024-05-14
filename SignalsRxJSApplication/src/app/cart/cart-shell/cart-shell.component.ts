import { Component } from '@angular/core'
import { CartTotalComponent } from '../cart-total/cart-total.component'
import { CartListComponent } from '../cart-list/cart-list.component'

@Component({
  standalone: true,
  imports: [CartListComponent, CartTotalComponent],
  template: `
    <div class="row">
      <apm-cart-list />
    </div>
    <div class="row">
      <div class="offset-md-6 col-md-6">
        <apm-cart-total />
      </div>
    </div>
  `,
})
export class CartShellComponent {}
