package vaid23.spring_boot_ecommerce.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import vaid23.spring_boot_ecommerce.dto.PaymentInfo;
import vaid23.spring_boot_ecommerce.dto.Purchase;
import vaid23.spring_boot_ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
