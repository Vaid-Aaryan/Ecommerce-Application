import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive, RouterLink } from '@angular/router';
import { ProductList } from "./components/product-list/product-list";
import { ProductCategoryMenu } from "./components/product-category-menu/product-category-menu";
import { Search } from "./components/search/search";
import { CartStatus } from "./components/cart-status/cart-status";
import { LoginStatusComponent } from "./components/login-status/login-status";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductList, RouterLinkWithHref, RouterLink, RouterLinkActive, ProductCategoryMenu, Search, CartStatus, LoginStatusComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('angular-commerce');
}
