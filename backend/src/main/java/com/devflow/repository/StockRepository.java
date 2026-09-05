package com.devflow.repository;
import com.devflow.entity.Stock;
import com.devflow.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    List<Stock> findByProductOrderByWarehouseShippingWeightDescQtyAvailableDesc(Product product);
}
