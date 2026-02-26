import { Component } from '@angular/core';
import { Product } from '../../common/product';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/productService';
import { NgFor } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-product-category-menu',
  imports: [NgFor, RouterLink],
  templateUrl: './product-category-menu.html',
  styleUrl: './product-category-menu.css',
})
export class ProductCategoryMenu  {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listProductCategories();
  }

  listProductCategories(){
    this.productService.getProductCategoties().subscribe(
      data => {
        console.log('Product Categories=' + JSON.stringify(data));
        this.productCategories = data;
      }
    )
  }
}
