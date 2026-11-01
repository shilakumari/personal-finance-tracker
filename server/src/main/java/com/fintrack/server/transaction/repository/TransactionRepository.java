package com.fintrack.server.transaction.repository;

import com.fintrack.server.transaction.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

//This Repository is responsible for communicating with the database
//I'll connect our Transaction model with MongoDB so that Spring Boot can save, retrieve, and delete transactions.
public interface TransactionRepository
        extends MongoRepository<Transaction, String> {

    List<Transaction> findByUserId(String userId);
    Optional<Transaction> findByIdAndUserId(String id, String userId);
    void deleteByIdAndUserId(String id, String userId);
}
