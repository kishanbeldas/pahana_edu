package com.pahanaedu.controller;

import com.pahanaedu.dto.BillDto;
import com.pahanaedu.entity.Bill;
import com.pahanaedu.service.BillService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*") // Allow all origins
public class BillController {

    private static final Logger logger = LoggerFactory.getLogger(BillController.class);

    @Autowired
    private BillService billService;

    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills() {
        try {
            List<Bill> bills = billService.getAllBills();
            return ResponseEntity.ok(bills);
        } catch (Exception e) {
            logger.error("Error getting bills: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        try {
            return billService.getBillById(id)
                    .map(bill -> ResponseEntity.ok().body(bill))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error getting bill by ID: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@Valid @RequestBody BillDto billDto) {
        try {
            logger.info("Received bill creation request");
            logger.info("Bill DTO: billNumber={}, customerId={}, billDate={}, dueDate={}",
                    billDto.getBillNumber(), billDto.getCustomerId(), billDto.getBillDate(), billDto.getDueDate());
            logger.info("Bill items count: {}", billDto.getBillItems() != null ? billDto.getBillItems().size() : 0);

            if (billDto.getBillItems() != null) {
                for (int i = 0; i < billDto.getBillItems().size(); i++) {
                    var item = billDto.getBillItems().get(i);
                    logger.info("Item {}: itemId={}, quantity={}, unitPrice={}, totalPrice={}",
                            i, item.getItemId(), item.getQuantity(), item.getUnitPrice(), item.getTotalPrice());
                }
            }

            Bill savedBill = billService.createBillFromDTO(billDto);
            return ResponseEntity.ok(savedBill);
        } catch (Exception e) {
            logger.error("Error creating bill: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bill> updateBill(@PathVariable Long id,
                                           @Valid @RequestBody Bill billDetails) {
        try {
            Bill updatedBill = billService.updateBill(id, billDetails);
            return ResponseEntity.ok(updatedBill);
        } catch (RuntimeException e) {
            logger.error("Bill not found with id: {}", id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating bill: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBill(@PathVariable Long id) {
        try {
            billService.deleteBill(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting bill: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Bill>> getBillsByCustomer(@PathVariable Long customerId) {
        try {
            List<Bill> bills = billService.getBillsByCustomer(customerId);
            return ResponseEntity.ok(bills);
        } catch (Exception e) {
            logger.error("Error fetching bills for customer {}: {}", customerId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/number/{billNumber}")
    public ResponseEntity<Bill> getBillByNumber(@PathVariable String billNumber) {
        try {
            return billService.getBillByNumber(billNumber)
                    .map(bill -> ResponseEntity.ok().body(bill))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching bill by number {}: {}", billNumber, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}