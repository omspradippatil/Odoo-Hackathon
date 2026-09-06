package com.devflow.backend.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class SqlTestController {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/api/sql-test")
    public List<Map<String, Object>> runSql() {
        return jdbcTemplate.queryForList("SELECT id, name, image_url, seller_name FROM products WHERE image_url IS NOT NULL");
    }
}
