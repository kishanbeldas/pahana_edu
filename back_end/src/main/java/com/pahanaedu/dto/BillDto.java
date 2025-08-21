package com.pahanaedu.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class BillDto {

    private Long id;

    private String billNumber;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private String customerName;

    @NotNull(message = "Bill date is required")
    private LocalDate billDate;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    // REMOVED @NotNull - these will be calculated by backend
    @DecimalMin(value = "0.0", message = "Subtotal cannot be negative")
    private BigDecimal subtotal;

    @DecimalMin(value = "0.0", message = "Tax amount cannot be negative")
    private BigDecimal taxAmount = BigDecimal.ZERO;

    // REMOVED @NotNull - this will be calculated by backend
    @DecimalMin(value = "0.0", message = "Total amount cannot be negative")
    private BigDecimal totalAmount;

    private String status = "PENDING";

    @NotEmpty(message = "Bill must have at least one item")
    private List<BillItemDto> billItems;

    // Constructors
    public BillDto() {}

    public BillDto(Long customerId, LocalDate billDate, LocalDate dueDate) {
        this.customerId = customerId;
        this.billDate = billDate;
        this.dueDate = dueDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBillNumber() { return billNumber; }
    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<BillItemDto> getBillItems() { return billItems; }
    public void setBillItems(List<BillItemDto> billItems) { this.billItems = billItems; }
}