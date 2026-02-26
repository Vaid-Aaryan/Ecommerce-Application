package vaid23.spring_boot_ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vaid23.spring_boot_ecommerce.entity.Customer;
@Repository
public interface CustomerRepository extends JpaRepository<Customer,Long> {


    Customer findByEmail(String theEmail);
}
