package com.pahanaedu.service;

import com.pahanaedu.dto.BillDto;
import com.pahanaedu.dto.BillItemDto;
import com.pahanaedu.entity.Bill;
import com.pahanaedu.entity.BillItem;
import com.pahanaedu.entity.Item;
import com.pahanaedu.repository.BillRepository;
import com.pahanaedu.repository.ItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BillService {

    private static final Logger logger = LoggerFactory.getLogger(BillService.class);

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private ItemRepository itemRepository;

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
    }

    public Optional<Bill> getBillByNumber(String billNumber) {
        return billRepository.findByBillNumber(billNumber);
    }

    public List<Bill> getBillsByCustomer(Long customerId) {
        return billRepository.findByCustomerId(customerId);
    }

    /**
     * Create a bill from DTO (this method properly handles JSON data)
     */
    public Bill createBillFromDTO(BillDto billDto) {
        logger.info("Creating bill from DTO: {}", billDto.getBillNumber());
        logger.info("Received DTO with {} items", billDto.getBillItems() != null ? billDto.getBillItems().size() : 0);

        try {
            // Create new Bill entity
            Bill bill = new Bill();

            // Generate bill number if not provided
            if (billDto.getBillNumber() == null || billDto.getBillNumber().isEmpty()) {
                bill.setBillNumber(generateBillNumber());
            } else {
                bill.setBillNumber(billDto.getBillNumber());
            }

            // Set basic properties
            bill.setCustomerId(billDto.getCustomerId());
            bill.setBillDate(billDto.getBillDate());
            bill.setDueDate(billDto.getDueDate());

            // Initialize totals
            BigDecimal subtotal = BigDecimal.ZERO;

            // Process bill items from DTO
            if (billDto.getBillItems() != null && !billDto.getBillItems().isEmpty()) {
                logger.info("Processing {} bill items", billDto.getBillItems().size());

                for (int i = 0; i < billDto.getBillItems().size(); i++) {
                    BillItemDto itemDto = billDto.getBillItems().get(i);
                    logger.info("Processing item {}: itemId={}, quantity={}, unitPrice={}, totalPrice={}",
                            i, itemDto.getItemId(), itemDto.getQuantity(), itemDto.getUnitPrice(), itemDto.getTotalPrice());

                    // Validate itemId
                    if (itemDto.getItemId() == null) {
                        logger.error("Item {} has null itemId: {}", i, itemDto);
                        throw new RuntimeException("Item ID is required for all bill items");
                    }

                    // Fetch the item entity
                    Item item = itemRepository.findById(itemDto.getItemId())
                            .orElseThrow(() -> new RuntimeException("Item not found with ID: " + itemDto.getItemId()));

                    // Create bill item
                    BillItem billItem = new BillItem();
                    billItem.setItem(item);
                    billItem.setQuantity(itemDto.getQuantity());
                    billItem.setUnitPrice(itemDto.getUnitPrice());
                    billItem.setTotalPrice(itemDto.getTotalPrice());

                    // Use helper method to set relationships
                    bill.addBillItem(billItem);

                    // Add to subtotal
                    subtotal = subtotal.add(itemDto.getTotalPrice());

                    logger.info("Successfully added bill item: itemId={}, quantity={}, unitPrice={}, totalPrice={}",
                            item.getId(), itemDto.getQuantity(), itemDto.getUnitPrice(), itemDto.getTotalPrice());
                }
            } else {
                throw new RuntimeException("Bill must have at least one item");
            }

            // Calculate totals
            BigDecimal taxAmount = subtotal.multiply(new BigDecimal("0.10"));
            BigDecimal totalAmount = subtotal.add(taxAmount);

            bill.setSubtotal(subtotal);
            bill.setTaxAmount(taxAmount);
            bill.setTotalAmount(totalAmount);

            logger.info("Bill totals - Subtotal: {}, Tax: {}, Total: {}", subtotal, taxAmount, totalAmount);

            // Save the bill
            Bill savedBill = billRepository.save(bill);
            logger.info("Successfully created bill with ID: {}", savedBill.getId());

            return savedBill;

        } catch (Exception e) {
            logger.error("Error creating bill from DTO: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create bill: " + e.getMessage(), e);
        }
    }

    public Bill saveBill(Bill bill) {
        logger.info("Saving bill: {}", bill.getBillNumber());

        try {
            // Generate bill number if not provided
            if (bill.getBillNumber() == null || bill.getBillNumber().isEmpty()) {
                bill.setBillNumber(generateBillNumber());
            }

            // Debug: Log the incoming bill items
            if (bill.getBillItems() != null) {
                logger.info("Received {} bill items", bill.getBillItems().size());
                int itemIndex = 0;
                for (BillItem item : bill.getBillItems()) {
                    logger.debug("BillItem {}: itemId={}, item={}, quantity={}, unitPrice={}",
                            itemIndex++, item.getItemId(), item.getItem(), item.getQuantity(), item.getUnitPrice());
                }
            }

            // Process bill items to ensure proper relationships
            if (bill.getBillItems() != null && !bill.getBillItems().isEmpty()) {
                // Create a new list to store properly configured items
                List<BillItem> originalItems = List.copyOf(bill.getBillItems());

                // Clear existing items
                bill.clearBillItems();

                // Process each item and add it back using helper method
                for (BillItem sourceItem : originalItems) {
                    BillItem billItem = new BillItem();

                    // Copy basic properties
                    billItem.setQuantity(sourceItem.getQuantity());
                    billItem.setUnitPrice(sourceItem.getUnitPrice());
                    billItem.setTotalPrice(sourceItem.getTotalPrice());

                    // Handle Item relationship properly - check JSON itemId first
                    Long itemId = null;
                    if (sourceItem.getItem() != null) {
                        billItem.setItem(sourceItem.getItem());
                        logger.debug("Using existing Item entity: {}", sourceItem.getItem().getId());
                    } else if (sourceItem.getItemId() != null) {
                        itemId = sourceItem.getItemId();
                        logger.debug("Got itemId from relationship: {}", itemId);
                    } else {
                        logger.error("BillItem debug - Item: {}, ItemId: {}, Quantity: {}, UnitPrice: {}, TotalPrice: {}",
                                sourceItem.getItem(), sourceItem.getItemId(), sourceItem.getQuantity(),
                                sourceItem.getUnitPrice(), sourceItem.getTotalPrice());
                        throw new RuntimeException("Item selection is required for all bill items. Frontend sent itemId but backend received null. Check your BillItem entity mapping.");
                    }

                    // Load item if we have an itemId
                    if (itemId != null) {
                        final Long finalItemId = itemId;
                        Item item = itemRepository.findById(finalItemId)
                                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + finalItemId));
                        billItem.setItem(item);
                        logger.debug("Loaded Item entity from database: {}", item.getId());
                    }

                    // Use helper method to properly set Bill relationship
                    bill.addBillItem(billItem);
                }
            }

            // Calculate totals
            calculateBillTotals(bill);

            // Save the bill
            Bill savedBill = billRepository.save(bill);
            logger.info("Successfully saved bill with ID: {}", savedBill.getId());

            return savedBill;

        } catch (Exception e) {
            logger.error("Error saving bill: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save bill: " + e.getMessage(), e);
        }
    }

    public Bill updateBill(Long id, Bill billDetails) {
        logger.info("Updating bill with ID: {}", id);

        try {
            Bill bill = billRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));

            bill.setBillDate(billDetails.getBillDate());
            bill.setDueDate(billDetails.getDueDate());
            bill.setStatus(billDetails.getStatus());

            // Handle bill items update properly
            if (billDetails.getBillItems() != null) {
                // Clear existing items
                bill.clearBillItems();

                // Process and add new items
                for (BillItem sourceItem : billDetails.getBillItems()) {
                    BillItem billItem = new BillItem();

                    // Copy properties
                    billItem.setQuantity(sourceItem.getQuantity());
                    billItem.setUnitPrice(sourceItem.getUnitPrice());
                    billItem.setTotalPrice(sourceItem.getTotalPrice());

                    // Handle Item relationship
                    if (sourceItem.getItem() != null) {
                        billItem.setItem(sourceItem.getItem());
                    } else if (sourceItem.getItemId() != null) {
                        Item item = itemRepository.findById(sourceItem.getItemId())
                                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + sourceItem.getItemId()));
                        billItem.setItem(item);
                    }

                    // Use helper method
                    bill.addBillItem(billItem);
                }
            }

            calculateBillTotals(bill);
            return billRepository.save(bill);

        } catch (Exception e) {
            logger.error("Error updating bill: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update bill: " + e.getMessage(), e);
        }
    }

    public void deleteBill(Long id) {
        billRepository.deleteById(id);
    }

    private void calculateBillTotals(Bill bill) {
        if (bill.getBillItems() != null && !bill.getBillItems().isEmpty()) {
            BigDecimal subtotal = bill.getBillItems().stream()
                    .map(BillItem::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            bill.setSubtotal(subtotal);

            // Calculate tax (10% for example)
            BigDecimal taxRate = new BigDecimal("0.10");
            BigDecimal taxAmount = subtotal.multiply(taxRate);
            bill.setTaxAmount(taxAmount);

            bill.setTotalAmount(subtotal.add(taxAmount));
        }
    }

    private String generateBillNumber() {
        long count = billRepository.count();
        return String.format("BILL%06d", count + 1);
    }
}