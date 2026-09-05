package com.devflow.service;
import com.devflow.entity.Quotation;
import org.springframework.stereotype.Service;

@Service
public class PdfService {
    public byte[] generateGstInvoice(Quotation quotation) {
        // mock implementation
        String content = "GST INVOICE FOR QUOTATION: " + quotation.getId();
        return content.getBytes();
    }
}
