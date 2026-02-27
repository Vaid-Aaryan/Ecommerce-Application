import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../common/order';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private orderUrl = 'http://localhost:8080/api/orders';
  constructor(private httpClient: HttpClient) {

  }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {
    const orderHistoryUrl =
    `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;
   // const orderHistoryUrl = 'http://localhost:8080/api/orders/search/findByCustomerEmail?email=ansuvaid@gmail.com';
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}


interface GetResponseOrderHistory{
  _embedded: {
    orders: OrderHistory[];
  }
}
