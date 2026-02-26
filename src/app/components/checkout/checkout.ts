import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutFormService } from '../../services/checkout-form-service';
import { Checkout as CheckoutService } from '../../services/checkout';
import { NgFor, NgIf } from '@angular/common';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CustomValidators } from '../../validators/custom-validators';
import { Cart } from '../../services/cart';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { Address } from '../../common/address';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  //collection of form group or form control and other elements
  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] =[];
  creditCardMonths: number[] =[];
  countries: Country[] =[];
  shippingAddressStates: State[]  =[];
  billingAddressStates: State[] =[];

  storage: Storage = sessionStorage;


  constructor(private formBuilder:FormBuilder,
    private checkout:CheckoutFormService,
    private cartService: Cart,
    private CheckoutService: CheckoutService,
    private router: Router
  ){
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    this.checkoutFormGroup= this.formBuilder.group(
      {
        customer:
        this.formBuilder.group({
          firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
          lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
          email: new FormControl(theEmail,
            [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
          )
        }),
        shippingAddress: this.formBuilder.group({
          street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
          city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
          state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace])
        }),
        billingAddress: this.formBuilder.group({
          street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
          city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
          state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace])
        }),
        // creditCard: this.formBuilder.group({
        //   cardType: [''],
        //   nameOnCard: [''],
        //   cardNumber: [''],
        //   securityCode: [''],
        //   expirationMonth: [''],
        //   expirationYear: ['']
        // })
        creditCard: this.formBuilder.group({
          cardType: new FormControl('', [Validators.required]),
          nameOnCard: new FormControl('', [Validators.required,Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
          cardNumber: new FormControl('', [Validators.required,Validators.pattern('[0-9]{16}')]),
          securityCode: new FormControl('', [Validators.required,Validators.pattern('[0-9]{3}')]),
          expirationMonth: new FormControl('', [Validators.required]),
          expirationYear: new FormControl('', [Validators.required])
        })
      });
  }

  ngOnInit(): void {

   const startMonth: number = new Date().getMonth() + 1;
   
   this.checkout.getCreditCardMonths(startMonth).subscribe(
    data =>{
       console.log("Retrieved credit card months: " + JSON.stringify(data))
       this.creditCardMonths = data
  });

   this.checkout.getCreditCardYears().subscribe(
    data =>{
      console.log("Retrieved credit card years: " + JSON.stringify(data)) 
      this.creditCardYears = data
  });

    //populate countries
    this.checkout.getCountries().subscribe(
      data =>{
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

    this.reviewCartDetails();
  }

  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer')?.value.email);

    console.log("The shipping address country is " +this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping address state is " +this.checkoutFormGroup.get('shippingAddress')?.value.state.name);

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    //set up order
    let order = new Order(this.totalQuantity, this.totalPrice);

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //set up purchase
    let purchase= new Purchase();
    
    //populate puchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase-shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State =  JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;
    //populate purchase-billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //populate purchase-order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //call REST API via the CheckoutService

    this.CheckoutService.placeOrder(purchase).subscribe(
      {
        next: response =>{
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
          //reset cart
          this.resetCart();
      },
        error: err =>{
          alert(`There was an error: ${err.message}`);
        }
      }
    )
  }

  resetCart(){
    //reset cart data
    this.cartService.cartItems =[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form
    this.checkoutFormGroup.reset();

    //navigate back to the products page
    this.router.navigateByUrl("/products");


  }

  reviewCartDetails(){
    //subscibe to the cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity= data
    ) 

    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice= data
    )
  }


  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode');}


  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');} 
  get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}
  get creditCardExpirationMonth(){return this.checkoutFormGroup.get('creditCard.expirationMonth');}
  get creditCardExpirationYear(){return this.checkoutFormGroup.get('creditCard.expirationYear');}
  

  copyShippingAddressToBillingAddress(event: any){
    if(event.target.checked){
      const shipping = this.checkoutFormGroup.get('shippingAddress')?.value;
      this.checkoutFormGroup.get('billingAddress')?.setValue(shipping);

      //bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    }else{
      this.checkoutFormGroup.get('billingAddress')?.reset();
      this.billingAddressStates =[];
    }
  }

  

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');


    const currentYear: number = new Date().getFullYear();

    const selectedYear:number =Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }

    this.checkout.getCreditCardMonths(startMonth).subscribe(
      data=>{
        console.log("Retrieved credit card data with handle months and years: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }


  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;


    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.checkout.getStates(countryCode).subscribe(
      data =>{
        if(formGroupName=='shippingAddress'){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }

        //select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }





}
