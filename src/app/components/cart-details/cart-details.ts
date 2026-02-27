import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { Cart } from '../../services/cart';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart-details',
  imports: [NgFor, CurrencyPipe, NgIf, RouterLink],
  templateUrl: './cart-details.html',
  styleUrl: './cart-details.css',
})
export class CartDetails implements OnInit{

  cartItems: CartItem[] = [];
  totalPrice: number =0;
  totalQuantity: number=0;
  
  
  constructor(private cartService:Cart){
  }
  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails(){
    this.cartItems=this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice=data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity=data
    );

    this.cartService.computeCartTotals();
  }

  incrementQuantity(theCartItem:CartItem){
    this.cartService.addToCartService(theCartItem);
  }

  decrementQuantity(theCartItem:CartItem){
    this.cartService.decrementQuantity(theCartItem);
  }

  remove(tempCartItem:CartItem){
    this.cartService.remove(tempCartItem);
  }

}
