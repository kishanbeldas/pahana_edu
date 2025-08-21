package com.pahanaedu.service;

import com.pahanaedu.entity.Customer;
import com.pahanaedu.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public Optional<Customer> getCustomerByAccountNumber(String accountNumber) {
        return customerRepository.findByAccountNumber(accountNumber);
    }

    public Customer saveCustomer(Customer customer) {
        // Generate account number if not provided
        if (customer.getAccountNumber() == null || customer.getAccountNumber().isEmpty()) {
            customer.setAccountNumber(generateAccountNumber());
        }
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        customer.setName(customerDetails.getName());
        customer.setAddress(customerDetails.getAddress());
        customer.setTelephone(customerDetails.getTelephone());
        customer.setEmail(customerDetails.getEmail());
        customer.setUnitsConsumed(customerDetails.getUnitsConsumed());

        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    private String generateAccountNumber() {
        long count = customerRepository.count();
        return String.format("ACC%06d", count + 1);
    }
}