package com.fintrack.server.transaction.service;

import com.fintrack.server.transaction.Transaction;
import com.fintrack.server.transaction.repository.TransactionRepository;

import org.springframework.stereotype.Service;

import java.util.List;

//Here, Business logic for creating, retrieving, and deleting transactions.

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;

    //constructor dependency injection
    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // Add a new transaction
    public Transaction createTransaction(Transaction transaction, String userId) {
        if (transaction.getTitle() == null || transaction.getTitle().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }

        if (transaction.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        if (transaction.getType() == null) {
            throw new IllegalArgumentException("Transaction type is required");
        }

        if (transaction.getDate() == null) {
            throw new IllegalArgumentException("Date is required");
        }

        transaction.setUserId(userId);

        return transactionRepository.save(transaction);
    }

    // Get all transactions of a particular user
    public List<Transaction> getUserTransactions(String userId) {
        return transactionRepository.findByUserId(userId);
    }

    // Delete a transaction belonging to a particular user
    public void deleteTransaction(String id, String userId) {
        Transaction transaction = transactionRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found"));

        transactionRepository.deleteById(transaction.getId());
    }
}
