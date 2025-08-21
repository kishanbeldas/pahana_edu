package com.pahanaedu.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

@Entity
@Table(name = "bill_items")
public class BillItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Use @JsonProperty to handle the JSON mapping properly
    @JsonProperty("itemId")
    @Transient
    private Long itemIdFromJson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(nullable = false)
    @DecimalMin(value = "0.0", message = "Quantity cannot be negative")
    private BigDecimal quantity;

    @Column(name = "unit_price", nullable = false)
    @DecimalMin(value = "0.0", message = "Unit price cannot be negative")
    private BigDecimal unitPrice;

    @Column(name = "total_price", nullable = false)
    @DecimalMin(value = "0.0", message = "Total price cannot be negative")
    private BigDecimal totalPrice;

    // Constructors
    public BillItem() {}

    public BillItem(Bill bill, Item item, BigDecimal quantity, BigDecimal unitPrice) {
        this.bill = bill;
        this.item = item;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = quantity.multiply(unitPrice);
    }

    // Convenience methods to get IDs from relationships
    public Long getBillId() {
        return bill != null ? bill.getId() : null;
    }

    public Long getItemId() {
        return item != null ? item.getId() : null;
    }

    // Special setter for JSON deserialization
    @JsonProperty("itemId")
    public void setItemIdFromJson(Long itemId) {
        this.itemIdFromJson = itemId;
    }

    @JsonProperty("itemId")
    public Long getItemIdFromJson() {
        return itemIdFromJson != null ? itemIdFromJson : getItemId();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Bill getBill() { return bill; }
    public void setBill(Bill bill) {
        this.bill = bill;
    }

    public Item getItem() { return item; }
    public void setItem(Item item) {
        this.item = item;
    }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
        calculateTotalPrice();
    }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
        calculateTotalPrice();
    }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    private void calculateTotalPrice() {
        if (quantity != null && unitPrice != null) {
            this.totalPrice = quantity.multiply(unitPrice);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BillItem)) return false;
        BillItem billItem = (BillItem) o;
        return id != null && id.equals(billItem.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}