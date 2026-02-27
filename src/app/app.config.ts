import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Route } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { ProductList } from './components/product-list/product-list';
import { Routes} from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ProductDetails } from './components/product-details/product-details';
import { NgbModule  } from '@ng-bootstrap/ng-bootstrap';
import { CartDetails } from './components/cart-details/cart-details';
import { Checkout } from './components/checkout/checkout';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import myAppConfig from './config/my-app-config';
import { AuthInterceptor } from './services/auth-interceptor';
import { AuthGuard } from '@auth0/auth0-angular';
import { MembersPage } from './components/members-page/members-page';
import { OrderHistory } from './common/order-history';
import { OrderHistoryComponent } from './components/order-history/order-history';
const routes: Routes = [
  {path: 'order-history', component: OrderHistoryComponent, canActivate : [AuthGuard]},
  {path: 'members', component: MembersPage, canActivate : [AuthGuard]},
  {path : 'checkout', component: Checkout, canActivate : [AuthGuard]},
  {path : 'cart-details', component: CartDetails},
  {path : 'products/:id', component: ProductDetails},
  {path: 'search/:keyword', component: ProductList},
  {path: 'category/:id', component: ProductList},
  {path: 'category', component: ProductList},
  {path: 'products', component: ProductList},
  {path: '',redirectTo: 'products', pathMatch: 'full'},
  {path: '**', component: ProductList, pathMatch: 'full'},
]


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    importProvidersFrom(ReactiveFormsModule,NgbModule,
      AuthModule.forRoot({
        ...myAppConfig.auth,
        httpInterceptor: {
          ...myAppConfig.httpInterceptor
        } 
      })

    ),
     {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
    
  ]
};
