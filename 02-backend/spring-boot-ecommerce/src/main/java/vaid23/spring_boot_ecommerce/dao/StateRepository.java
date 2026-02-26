package vaid23.spring_boot_ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import vaid23.spring_boot_ecommerce.entity.Country;
import vaid23.spring_boot_ecommerce.entity.State;

import java.util.List;

@RepositoryRestResource
public interface StateRepository extends JpaRepository<State,Integer> {

    List<State> findByCountryCode(@Param("code") String code);
}
