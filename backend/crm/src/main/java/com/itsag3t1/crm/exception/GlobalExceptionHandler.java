package com.itsag3t1.crm.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidDataException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<String> handleInvalidDataException(InvalidDataException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<String> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        // Check if the error is related to enum parsing
        if (ex.getMessage().contains("AccountType")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("accountType should be SAVINGS, CHECKING, or BUSINESS");
        } else if (ex.getMessage().contains("AccountStatus")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("accountStatus should be ACTIVE, INACTIVE, or PENDING");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request format.");
    }

    @ExceptionHandler(UnderageException.class)
    public ResponseEntity<String> handleUnderageException(UnderageException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
    // other exception handlers
}
