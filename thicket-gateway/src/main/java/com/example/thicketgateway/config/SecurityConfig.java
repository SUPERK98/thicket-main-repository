package com.example.thicketgateway.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;
import reactor.core.publisher.Mono;

@Configuration
@RequiredArgsConstructor
@EnableWebFluxSecurity
@Slf4j
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http,
                                                         ServerAuthenticationConverter converter,
                                                         ReactiveAuthenticationManager manager) {

        AuthenticationWebFilter webFilter = getAuthenticationWebFilter(converter, manager);

        http.csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(formLoginSpec -> formLoginSpec.authenticationManager(manager))
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authenticationManager(manager)
                .authorizeExchange(exchange -> exchange
                .pathMatchers("/thicket-member/members").hasRole("USER")
                .pathMatchers("/thicket-member/members/master").hasRole("MASTER")
                .pathMatchers("/thicket-member/members/login").hasRole("USER")
                .pathMatchers("/thicket-member/members/**").permitAll()
                .pathMatchers("/thicket-member/email/**").permitAll()
                .pathMatchers("/thicket-member/email").permitAll()
                .pathMatchers("/thicket-member/members/health").permitAll()
                .pathMatchers("/thicket-ticket/reservations").hasRole("USER")
                .pathMatchers("/thicket-ticket/reservations/**").hasRole("USER")
                .pathMatchers("/thicket-ticket/reservations/admin/stage/**").hasRole("ADMIN")
                .pathMatchers("/thicket-ticket/reservations/admin/**").hasRole("ADMIN")
                .pathMatchers("/thicket-ticket/reservations/payments/ready").hasRole("USER")
                .pathMatchers("/thicket-show/shows").hasRole("ADMIN")
                .pathMatchers("/thicket-show/shows/image").hasRole("ADMIN")
                .pathMatchers("/thicket-show/shows/all").hasRole("ADMIN")
                .pathMatchers("/thicket-show/shows/ongoing").permitAll()
                .pathMatchers("/thicket-show/shows/stagedetail/**").permitAll()
                .pathMatchers("/thicket-show/shows/stagetype/**").permitAll()
                .pathMatchers("/thicket-show/shows/before").permitAll()
                .pathMatchers("/thicket-show/shows/search/**").permitAll()
                .pathMatchers("/thicket-show/tickets/all").permitAll()
                .pathMatchers("/thicket-show/tickets/all/**").permitAll()
                .pathMatchers("/thicket-show/chairs/all/**").permitAll()
                .pathMatchers("/thicket-show/shows/serverTime").permitAll()
                .pathMatchers("/thicket-show/shows/ongoing/admin").hasRole("ADMIN")
                .pathMatchers("/thicket-show/chairs").hasRole("ADMIN")
                .pathMatchers("/thicket-show/tickets").hasRole("ADMIN")
                .pathMatchers("/thicket-show/tickets/**").hasRole("ADMIN")
                .pathMatchers("/thicket-show/shows/before/admin").hasRole("ADMIN")
                .pathMatchers("/thicket-show/shows/ended").hasRole("ADMIN")
                .pathMatchers("/thicket-show/shows/update/**").hasRole("ADMIN")
                .pathMatchers("/thicket-show/chairs/**").hasRole("ADMIN")
                .pathMatchers("/thicket-show/shows/**").hasRole("MASTER")
                .anyExchange().authenticated())
                .addFilterAt(webFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .exceptionHandling(
                exceptionHandlingSpec -> exceptionHandlingSpec.accessDeniedHandler((exchange, denied) -> Mono.fromRunnable(() -> {
                    log.error("SecurityWebFilterChain 401 {}", exchange.getRequest().getURI(), denied);
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                })));

        return http.build();
    }

    // 인증 객체 컨버터와 인증 객체 매니저를 이용한 필터를 구성하는 내부 메서드
    private static AuthenticationWebFilter getAuthenticationWebFilter(ServerAuthenticationConverter converter, ReactiveAuthenticationManager manager) {
        // 인증 객체 매니저를 이용해 필터를 만든다.
        // 인증 객체 컨버터를 필터에 등록한다.
        AuthenticationWebFilter webFilter = new AuthenticationWebFilter(manager);
        webFilter.setServerAuthenticationConverter(converter);
        // 필터에 의해 인증이 실패했을때 어떻게 처리할건지 설정
        webFilter.setAuthenticationFailureHandler(
                (exchange, exception) -> Mono.fromRunnable(() -> {
                    log.error("SecurityWebFilterChain 401 {}", exchange.getExchange().getRequest().getURI(), exception);
                    exchange.getExchange().getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                })
        );
        return webFilter;
    }
}
