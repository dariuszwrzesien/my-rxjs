import { computed, Injectable, signal } from '@angular/core'
import { CartItem } from './cart'
import { Product } from '../products/product'

@Injectable({
  providedIn: 'root',
})
export class CartService {
  taxRate = 10.75
  freeDeliveryThreshold = 50
  deliveryCost = 5.99

  cartItems = signal<CartItem[]>([])
  cartCount = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  )
  cartSubtotal = computed(() =>
    this.cartItems().reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    )
  )
  deliveryFee = computed(() =>
    this.cartSubtotal() > this.freeDeliveryThreshold ? 0 : this.deliveryCost
  )
  tax = computed(() => (this.cartSubtotal() * this.taxRate) / 100)
  totalPrice = computed(
    () => this.cartSubtotal() + this.deliveryFee() + this.tax()
  )

  addToCart(product: Product) {
    this.cartItems.update((items) => {
      if (items.some((item) => item.product === product)) {
        return items.map((item) =>
          item.product === product
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      }
      return [...items, { product, quantity: 1 }]
    })
  }

  updateQuantity(cartItem: CartItem, quantity: number) {
    this.cartItems.update((items) =>
      items.map((item) => (item === cartItem ? { ...item, quantity } : item))
    )
  }

  removeFromCart(cartItem: CartItem) {
    this.cartItems.update((items) => items.filter((item) => item !== cartItem))
  }
}
