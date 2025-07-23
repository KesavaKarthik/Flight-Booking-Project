package com.example.flight_project_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.util.Collections;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String email = null;
        String jwt = null;

        System.out.println("==== JwtRequestFilter triggered ====");
        System.out.println("Authorization Header: " + authHeader);

        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                jwt = authHeader.substring(7);
                email = jwtUtil.extractUsername(jwt);
                System.out.println("Extracted email from token: " + email);
            } else {
                System.out.println("No Bearer token found in header.");
            }

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                boolean isValid = jwtUtil.validateToken(jwt, email);
                System.out.println("Is token valid? " + isValid);

                if (isValid) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    System.out.println("Authentication set for user: " + email);
                } else {
                    System.out.println("Token validation failed.");
                }
            } else {
                System.out.println("Email is null or authentication already exists.");
            }
        } catch (Exception e) {
            System.out.println("JWT Filter error: " + e.getMessage());
        }

        System.out.println("Auth context at end: " + SecurityContextHolder.getContext().getAuthentication());

        filterChain.doFilter(request, response);
    }
}
