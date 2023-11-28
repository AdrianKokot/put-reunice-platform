package com.example.cms.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.HandlerTypePredicate;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configures the application.
 *
 * @author Marcin Szeląg (<a href="mailto:marcin.szelag@cs.put.poznan.pl">marcin.szelag@cs.put.poznan.pl</a>)
 */
@Configuration
public class CustomApplicationConfiguration implements WebMvcConfigurer {
    private final ApplicationConfigurationProvider config;

    @Autowired
    public CustomApplicationConfiguration(ApplicationConfigurationProvider config) {
        this.config = config;
    }

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().addServersItem(new Server().url("/api").description("backend RESTfull API server behind nginx reverse proxy"))
                .info(new Info().title("REUNICE CMS API").version("V1")
                        .license(new License().name("MIT License")));
    }

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.addPathPrefix("/api", HandlerTypePredicate.forAnnotation(RestController.class));
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("file://" + this.config.getUploadsDirectory());
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
}
