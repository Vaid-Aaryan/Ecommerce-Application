import { Component } from '@angular/core';
import { Cart } from '../../services/cart';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart-status',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-status.html',
  styleUrl: './cart-status.css',
})
export class CartStatus {

  totalPrice: number =0;
  totalQuantity: number =0;

  constructor(private cartService: Cart){}

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus(){
    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice= data
    )

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity= data
    )
  }

}
