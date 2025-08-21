package com.pahanaedu.service;

import com.pahanaedu.entity.Item;
import com.pahanaedu.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    public Optional<Item> getItemByCode(String itemCode) {
        return itemRepository.findByItemCode(itemCode);
    }

    public List<Item> getItemsByCategory(String category) {
        return itemRepository.findByCategory(category);
    }

    public Item saveItem(Item item) {
        if (item.getItemCode() == null || item.getItemCode().isEmpty()) {
            item.setItemCode(generateItemCode());
        }
        return itemRepository.save(item);
    }

    public Item updateItem(Long id, Item itemDetails) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));

        item.setName(itemDetails.getName());
        item.setDescription(itemDetails.getDescription());
        item.setUnitPrice(itemDetails.getUnitPrice());
        item.setCategory(itemDetails.getCategory());
        item.setStockQuantity(itemDetails.getStockQuantity());

        return itemRepository.save(item);
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    private String generateItemCode() {
        long count = itemRepository.count();
        return String.format("ITM%06d", count + 1);
    }
}