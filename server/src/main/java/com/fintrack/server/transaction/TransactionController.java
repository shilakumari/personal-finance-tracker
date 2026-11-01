
package com.fintrack.server.transaction;

import com.fintrack.server.transaction.service.TransactionService;
import com.fintrack.server.user.User;
import com.fintrack.server.user.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//This do CRUD operation for transacton.

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;
    private final UserRepository userRepository;

    public TransactionController(TransactionService transactionService,
            UserRepository userRepository) {
        this.transactionService = transactionService;
        this.userRepository = userRepository;
    }

    //Get the currently authenticated user's database ID
    private String getCurrentUserId(Authentication authentication) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getId();
    }

    //Create a transaction
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Transaction createTransaction(@RequestBody Transaction transaction,
            Authentication authentication) {

        String userId = getCurrentUserId(authentication);

        return transactionService.createTransaction(
                transaction, userId);
    }

    //Get all transactions of the logged-in user
    @GetMapping
    public List<Transaction> getTransactions(Authentication authentication) {
        String userId = getCurrentUserId(authentication);

        return transactionService.getUserTransactions(userId);
    }

    //Delete a transaction
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTransaction(@PathVariable String id,
            Authentication authentication) {
        String userId = getCurrentUserId(authentication);

        transactionService.deleteTransaction(id, userId);
    }
}
