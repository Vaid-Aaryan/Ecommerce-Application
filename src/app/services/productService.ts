import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page : {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number //0-base indexed wise current page number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';


  constructor(private http: HttpClient) {

  }

  getProductListPaginate(thePage: number,thePageSize: number,theCategoryId: number ): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;
      console.log(searchUrl);
    return this.http.get<GetResponseProducts>(searchUrl)
  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
      console.log(searchUrl);
    return this.http.get<GetResponseProducts
  >(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategoties(): Observable<ProductCategory[]>{
    return this.http.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response =>response._embedded.productCategory)
    )
  }

  searchProducts(theKeyword: string): Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
      console.log(searchUrl);
    return this.http.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  searchProductsPaginate(thePage: number,
                         thePageSize: number,
                         theKeyword: string ): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    + `&page=${thePage}&size=${thePageSize}`;
      console.log(searchUrl);
    return this.http.get<GetResponseProducts>(searchUrl)
  }

  getProduct(theProductId: number): Observable<Product>{
    const productUrl=`${this.baseUrl}/${theProductId}`;
    return this.http.get<Product>(productUrl);
  }  
} 
