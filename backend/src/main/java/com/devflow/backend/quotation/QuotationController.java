package com.devflow.backend.quotation;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quotations")
@CrossOrigin(origins = "*")
public class QuotationController {
    
    private final QuotationRepository repository;

    public QuotationController(QuotationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Quotation> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Quotation get(@PathVariable String id) {
        return repository.findById(id).orElse(new Quotation(id, "DRAFT"));
    }

    @PostMapping
    public Quotation save(@RequestBody Quotation quotation) {
        return repository.save(quotation);
    }
}
