
package com.fintrack.server.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

//creates signed JWTs containing the user ID, email, issue time, and expiration, using the configured secret key.
//It also verifies a token’s signature and expiration and extracts its claims for JwtAuthenticationFilter.

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs; 

    private SecretKey getSigningKey() {
        byte[] keyBytes =
                java.util.Base64.getDecoder().decode(secret);

        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String userId, String email) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(userId)
                .claim("email", email)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    //Verifies the token's signature and reads its claims.
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    //Gets the user's ID from the token.
    public String extractUserId(String token) {
        return extractAllClaims(token).getSubject();
    }

    //Gets the email claim.
    public String extractEmail(String token) {
        return extractAllClaims(token).get("email", String.class);
    }

    //Checks that the token belongs to the expected user and has not expired.
    public boolean isTokenValid(String token, String userId) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.getSubject().equals(userId)
                    && claims.getExpiration().after(new Date());

        } catch (io.jsonwebtoken.JwtException
                 | IllegalArgumentException exception) {
            return false;
        }
    }
}
