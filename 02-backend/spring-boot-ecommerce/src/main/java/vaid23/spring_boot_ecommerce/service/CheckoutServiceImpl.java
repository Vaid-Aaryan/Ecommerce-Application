package vaid23.spring_boot_ecommerce.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vaid23.spring_boot_ecommerce.dao.CustomerRepository;
import vaid23.spring_boot_ecommerce.dto.Purchase;
import vaid23.spring_boot_ecommerce.dto.PurchaseResponse;
import vaid23.spring_boot_ecommerce.entity.Customer;
import vaid23.spring_boot_ecommerce.entity.Order;
import vaid23.spring_boot_ecommerce.entity.OrderItem;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{
    private final CustomerRepository customerRepository;
    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        //retrieve the order info from dto
        Order order = purchase.getOrder();

        //Generate OrderTrackingNumber
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with the order Items
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        //populate Order with BillingAddress and SHippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //populate customer with order
        Customer customer = purchase.getCustomer();

        //Check if this is an existing customer
        String theEmail= customer.getEmail();
        Customer customerFromDB = customerRepository.findByEmail(theEmail);
        if(customerFromDB != null){
            //We found them ... let's assign them accordingly
            customer = customerFromDB;
        }

        customer.add(order);

        //save to the database
        customerRepository.save(customer);

        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        // generate a random UUID-> what is it
        //Universal Unique Identifier
        return UUID.randomUUID().toString();
    }
}
