import { Component, computed, inject, Input, signal } from '@angular/core'
import { CurrencyPipe, NgFor, NgIf } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { CartItem } from '../cart'
import { CartService } from '../cart.service'

@Component({
  selector: 'pm-cart-item',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, NgFor, NgIf],
  templateUrl: './cart-item.component.html',
})
export class CartItemComponent {
  @Input({ required: true })
  set cartItem(value: CartItem) {
    this.item.set(value)
  }

  private cartService = inject(CartService)

  item = signal<CartItem>(undefined!)

  exPrice = computed(() => this.item()?.quantity * this.item()?.product.price)

  onQuantityUpdated(quantity: number): void {
    this.cartService.updateQuantity(this.item(), quantity < 0 ? 0 : quantity)
  }

  removeFromCart(): void {
    this.cartService.removeFromCart(this.item())
  }
}
