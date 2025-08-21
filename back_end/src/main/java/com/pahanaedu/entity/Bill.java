//package com.pahanaedu.entity;
//
//import jakarta.persistence.*;
//import jakarta.validation.constraints.*;
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Entity
//@Table(name = "bills")
//public class Bill {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "bill_number", unique = true, nullable = false)
//    @NotBlank(message = "Bill number is required")
//    private String billNumber;
//
//    @Column(name = "customer_id", nullable = false)
//    private Long customerId;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
//    private Customer customer;
//
//    @Column(name = "bill_date", nullable = false)
//    @NotNull(message = "Bill date is required")
//    private LocalDate billDate;
//
//    @Column(name = "due_date", nullable = false)
//    @NotNull(message = "Due date is required")
//    private LocalDate dueDate;
//
//    @Column(nullable = false)
//    @DecimalMin(value = "0.0", message = "Subtotal cannot be negative")
//    private BigDecimal subtotal;
//
//    @Column(name = "tax_amount")
//    @DecimalMin(value = "0.0", message = "Tax amount cannot be negative")
//    private BigDecimal taxAmount = BigDecimal.ZERO;
//
//    @Column(name = "total_amount", nullable = false)
//    @DecimalMin(value = "0.0", message = "Total amount cannot be negative")
//    private BigDecimal totalAmount;
//
//    @Enumerated(EnumType.STRING)
//    private BillStatus status = BillStatus.PENDING;
//
//    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    private List<BillItem> billItems;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    @Column(name = "updated_at")
//    private LocalDateTime updatedAt;
//
//    @PrePersist
//    protected void onCreate() {
//        createdAt = LocalDateTime.now();
//        updatedAt = LocalDateTime.now();
//    }
//
//    @PreUpdate
//    protected void onUpdate() {
//        updatedAt = LocalDateTime.now();
//    }
//
//    public enum BillStatus {
//        PENDING, PAID, OVERDUE
//    }
//
//    // Constructors, getters, and setters
//    public Bill() {}
//
//    // Full getters and setters implementation
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//
//    public String getBillNumber() { return billNumber; }
//    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }
//
//    public Long getCustomerId() { return customerId; }
//    public void setCustomerId(Long customerId) { this.customerId = customerId; }
//
//    public Customer getCustomer() { return customer; }
//    public void setCustomer(Customer customer) { this.customer = customer; }
//
//    public LocalDate getBillDate() { return billDate; }
//    public void setBillDate(LocalDate billDate) { this.billDate = billDate; }
//
//    public LocalDate getDueDate() { return dueDate; }
//    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
//
//    public BigDecimal getSubtotal() { return subtotal; }
//    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
//
//    public BigDecimal getTaxAmount() { return taxAmount; }
//    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
//
//    public BigDecimal getTotalAmount() { return totalAmount; }
//    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
//
//    public BillStatus getStatus() { return status; }
//    public void setStatus(BillStatus status) { this.status = status; }
//
//    public List<BillItem> getBillItems() { return billItems; }
//    public void setBillItems(List<BillItem> billItems) { this.billItems = billItems; }
//
//    public LocalDateTime getCreatedAt() { return createdAt; }
//    public LocalDateTime getUpdatedAt() { return updatedAt; }
//}

package com.pahanaedu.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bills")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bill_number", unique = true, nullable = false)
    @NotBlank(message = "Bill number is required")
    private String billNumber;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    private Customer customer;

    @Column(name = "bill_date", nullable = false)
    @NotNull(message = "Bill date is required")
    private LocalDate billDate;

    @Column(name = "due_date", nullable = false)
    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    @Column(nullable = false)
    @DecimalMin(value = "0.0", message = "Subtotal cannot be negative")
    private BigDecimal subtotal;

    @Column(name = "tax_amount")
    @DecimalMin(value = "0.0", message = "Tax amount cannot be negative")
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false)
    @DecimalMin(value = "0.0", message = "Total amount cannot be negative")
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private BillStatus status = BillStatus.PENDING;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<BillItem> billItems = new ArrayList<>(); // Initialize the list

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum BillStatus {
        PENDING, PAID, OVERDUE
    }

    // CRITICAL: Helper methods for proper bidirectional relationship management
    public void addBillItem(BillItem billItem) {
        if (billItems == null) {
            billItems = new ArrayList<>();
        }
        billItems.add(billItem);
        billItem.setBill(this); // Set the parent reference
    }

    public void removeBillItem(BillItem billItem) {
        if (billItems != null) {
            billItems.remove(billItem);
            billItem.setBill(null);
        }
    }

    public void clearBillItems() {
        if (billItems != null) {
            billItems.forEach(item -> item.setBill(null));
            billItems.clear();
        }
    }

    // Constructors
    public Bill() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBillNumber() { return billNumber; }
    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public LocalDate getBillDate() { return billDate; }
    public void setBillDate(LocalDate billDate) { this.billDate = billDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BillStatus getStatus() { return status; }
    public void setStatus(BillStatus status) { this.status = status; }

    public List<BillItem> getBillItems() {
        if (billItems == null) {
            billItems = new ArrayList<>();
        }
        return billItems;
    }

    public void setBillItems(List<BillItem> billItems) {
        // Clear existing items first
        clearBillItems();
        // Add new items using helper method
        if (billItems != null) {
            billItems.forEach(this::addBillItem);
        }
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}