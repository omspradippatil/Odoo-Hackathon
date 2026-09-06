package com.devflow.backend.cart;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
    
    private final CartItemRepository repository;

    public CartController(CartItemRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CartItem> getCart() {
        return repository.findAll();
    }

    @PostMapping
    public CartItem addItem(@RequestBody CartItem item) {
        if (item.getId() == null) {
            item.setId(UUID.randomUUID().toString());
        }
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public CartItem updateItem(@PathVariable String id, @RequestBody CartItem item) {
        item.setId(id);
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable String id) {
        repository.deleteById(id);
    }
    
    @DeleteMapping
    public void clearCart() {
        repository.deleteAll();
    }
}
