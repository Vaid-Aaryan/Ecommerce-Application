package vaid23.spring_boot_ecommerce.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import vaid23.spring_boot_ecommerce.entity.Address;
import vaid23.spring_boot_ecommerce.entity.Customer;
import vaid23.spring_boot_ecommerce.entity.Order;
import vaid23.spring_boot_ecommerce.entity.OrderItem;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address billingAddress;
    private Address shippingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
