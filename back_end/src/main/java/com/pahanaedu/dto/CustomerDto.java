package com.pahanaedu.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class CustomerDto {

    private Long id;

    private String accountNumber;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @NotBlank(message = "Telephone is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid telephone format")
    private String telephone;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @DecimalMin(value = "0.0", message = "Units consumed cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Invalid units consumed format")
    private BigDecimal unitsConsumed = BigDecimal.ZERO;

    // Constructors
    public CustomerDto() {}

    public CustomerDto(String name, String address, String telephone) {
        this.name = name;
        this.address = address;
        this.telephone = telephone;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public BigDecimal getUnitsConsumed() { return unitsConsumed; }
    public void setUnitsConsumed(BigDecimal unitsConsumed) { this.unitsConsumed = unitsConsumed; }
}
