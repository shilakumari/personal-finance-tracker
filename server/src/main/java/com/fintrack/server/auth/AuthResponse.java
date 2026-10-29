
package com.fintrack.server.auth;

//This class will define what your backend sends back after successful registration or login. 
//It will include the JWT token that your React frontend can use to access protected API routes.
public class AuthResponse {
    private String token;
    private String id;
    private String name;
    private String email;

    public AuthResponse() {
    }

    public AuthResponse(String token, String id, String name, String email) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
