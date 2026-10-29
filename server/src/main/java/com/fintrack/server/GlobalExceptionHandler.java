
package com.fintrack.server;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.dao.DuplicateKeyException;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(
            IllegalArgumentException exception) {

        Map<String, String> body = Map.of("error", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(body);
    }

        @ExceptionHandler(ResponseStatusException.class)
        public ResponseEntity<Map<String, String>> handleResponseStatus(
                        ResponseStatusException exception) {
                Map<String, String> body = Map.of("error", exception.getReason());
                return ResponseEntity.status(exception.getStatusCode()).body(body);
        }

        @ExceptionHandler(DuplicateKeyException.class)
        public ResponseEntity<Map<String, String>> handleDuplicateKey() {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(Map.of("error", "An account with this email already exists."));
        }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException exception) {

        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .findFirst()
                .orElse("Invalid request data");

        Map<String, String> body = Map.of(
                "error", message
        );

        return ResponseEntity
                .badRequest()
                .body(body);
    }
}
