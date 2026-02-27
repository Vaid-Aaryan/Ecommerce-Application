import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/productService';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartItem } from '../../common/cart-item';
import { Cart } from '../../services/cart';


@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, RouterLink,RouterLink ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit{

  product! :Product;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService:Cart){}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.handleProductDetails();
    })  
  }

  handleProductDetails(){
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe(
      data =>{
        this.product=data;
      }
    )
      
  }

  addToCart(product: Product){
    console.log('Adding to cart from detail view: '+ product.name + ', ' + product.unitPrice);
    const cartItem = new CartItem(product);
    this.cartService.addToCartService(cartItem);
  }
    
}
