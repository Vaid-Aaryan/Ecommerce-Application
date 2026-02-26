import { Component } from '@angular/core';
import { OrderHistoryService } from '../../services/order-history';
import { NgIf,NgFor } from '@angular/common';
import { DatePipe } from '@angular/common';
import { OrderHistory } from '../../common/order-history';  
@Component({
  selector: 'app-order-history',
  imports: [NgIf, NgFor, DatePipe],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistoryComponent {
  orderHistoryList : OrderHistory[] = [];
  storage: Storage = sessionStorage;
  constructor(private orderHistoryService: OrderHistoryService) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    //const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    console.log('Email from storage: ', theEmail);
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
        console.log('Order history list: ', this.orderHistoryList);
      }
      
    )
    
  }
}
