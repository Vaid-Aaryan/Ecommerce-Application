package vaid23.spring_boot_ecommerce.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import vaid23.spring_boot_ecommerce.entity.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Value("${allowed.origins}")
    private String[] theAllowedOrigins;

    @Autowired
    public MyDataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] theUnsupportedAction = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        //disable HTTP methods for Product: PUT,POST, DELETE
        disableHttpMethods(Product.class,config,cors,theUnsupportedAction);
        disableHttpMethods(ProductCategory.class,config, cors, theUnsupportedAction);
        disableHttpMethods(Country.class,config, cors, theUnsupportedAction);
        disableHttpMethods(State.class,config, cors, theUnsupportedAction);
        disableHttpMethods(Order.class,config, cors, theUnsupportedAction);

        //call an internal helper method
        exposeIds(config);

        //configure CORS MAPPING

        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(theAllowedOrigins);
    }

    private void disableHttpMethods(Class theClass ,RepositoryRestConfiguration config, CorsRegistry cors, HttpMethod[] theUnsupportedAction) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedAction))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedAction));
        RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        //expose entity ids
        //

        //get a list of all entity classes from entity manager
        Set<EntityType<?>> entities= entityManager.getMetamodel().getEntities();

        //create an array list of the entity types
        List<Class> entityClasses= new ArrayList<Class>();

        //get the entity types for the entities
        for(EntityType tempEntityType: entities){
            entityClasses.add(tempEntityType.getJavaType());
        }
        //expose the entity ids for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[entityClasses.size()]);
        config.exposeIdsFor(domainTypes);
    }
}
