import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/productService';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CartItem } from '../../common/cart-item';
import { Cart } from '../../services/cart';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgIf, RouterLink, NgbPagination],
  templateUrl: './product-list-grid.html',
  styleUrls: ['./product-list.css'],
})
export class ProductList implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;
  previousCategoryId: number = 1;
  previousKeyword: string = "";

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalELements: number = 0;


  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: Cart) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    console.log(this.searchMode);
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    //now search for the products using the given keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                              this.thePageSize,
                                              theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;
    }

    //check if we have a different category than previous
    //Note angular will reuse a component if it is currently being viewed

    //if we have a different category id than previous
    //then set thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    //now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
    .subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult(){
    return (data: any) =>{
      this.products= data._embedded.products;
      this.thePageNumber= data.page.number + 1;
      this.thePageSize= data.page.size;
      this.theTotalELements= data.page.totalElements;
    }
  }


  addToCart(theProduct: Product){
    console.log('Adding to cart: '+ theProduct.name + ', ' + theProduct.unitPrice);
    const theCartItem= new CartItem(theProduct);
    this.cartService.addToCartService(theCartItem);
  }
}
