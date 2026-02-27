import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Cart {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // storage: Storage = sessionStorage;
  storage: Storage = localStorage ;
  constructor() {
    let data= JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null){
      this.cartItems= data;
    }
      this.computeCartTotals();
  }

  addToCartService(theCartItem: CartItem){
    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean= false;
    let existingCartItem: CartItem | undefined= undefined;


    existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id);
    // if(this.cartItems.length >0){
    //   for(let tempCartItem of this.cartItems){
    //     if(tempCartItem.id === theCartItem.id){
    //       existingCartItem= tempCartItem;
    //       break;
    //     }
    //   }
    //   alreadyExistsInCart= (existingCartItem != undefined);
    // }
    alreadyExistsInCart= (existingCartItem != undefined);

    if(alreadyExistsInCart){
      existingCartItem!.quantity++;
    }else{
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
    }

    computeCartTotals(){
      let totalPriceValue: number = 0;
      let totalQuantityValue: number =0;

      for(let currentCartItem of this.cartItems){
        totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
        totalQuantityValue += currentCartItem.quantity;
      }

      //publish thr new vaues....all subscribers will receive the new data
      this.totalPrice.next(totalPriceValue);
      this.totalQuantity.next(totalQuantityValue);

      this.logCartData(totalPriceValue, totalQuantityValue);

      //persist cart data
      this.persistCartItems();
    }


    persistCartItems(){
      this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    logCartData(totalPriceValue:number, totalQuantityValue:number){
      console.log('Contents of the cart');
      for(let tempCartItem of this.cartItems){
        const subTotalPrice= tempCartItem.unitPrice * tempCartItem.quantity;
        console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
      }
      console.log('--------');
    }

    decrementQuantity(theCartItem:CartItem){
      theCartItem.quantity--;
      if(theCartItem.quantity==0){
        this.remove(theCartItem);
      }
      this.computeCartTotals();
    }

    remove(theCartItem:CartItem){
      const itemIndex= this.cartItems.findIndex(tempCartItem => theCartItem.id=== tempCartItem.id);

      if(itemIndex > -1){
        this.cartItems.splice(itemIndex,1);
      }
    }
  
}
