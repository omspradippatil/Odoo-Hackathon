package com.devflow.backend.order;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    private final OrderRepository repository;

    public OrderController(OrderRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Order getOrder(@PathVariable String id) {
        return repository.findById(id).orElse(null);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        if (order.getId() == null || order.getId().isEmpty()) {
            order.setId("ORD-" + UUID.randomUUID().toString().substring(0, 8));
        }
        return repository.save(order);
    }
}
