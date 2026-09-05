package com.devflow.dto;

import com.devflow.entity.Enums;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/** Optional filters shared by the JSON, PDF and XLSX flavours of the sales report. */
public record ReportFilter(
        LocalDate from,
        LocalDate to,
        Enums.QuotationStatus status,
        Long repId,
        Long customerId) {

    public static ReportFilter of(LocalDate from, LocalDate to, String status, Long repId, Long customerId) {
        if (from != null && to != null && from.isAfter(to)) {
            throw new IllegalArgumentException("'from' date must not be after 'to' date");
        }
        return new ReportFilter(from, to, parseStatus(status), repId, customerId);
    }

    /** Human-readable filter line printed on the exported report. */
    public String describe() {
        List<String> parts = new ArrayList<>();
        if (from != null) parts.add("From " + from);
        if (to != null) parts.add("To " + to);
        if (status != null) parts.add("Status " + status);
        if (repId != null) parts.add("Sales rep #" + repId);
        if (customerId != null) parts.add("Customer #" + customerId);
        return parts.isEmpty() ? "All quotations (no filters applied)" : String.join("  |  ", parts);
    }

    // Parsed by hand rather than letting Spring bind the enum, so a bad value is a 400 with a
    // useful message instead of a type-mismatch 500.
    private static Enums.QuotationStatus parseStatus(String status) {
        if (status == null || status.isBlank()) return null;
        try {
            return Enums.QuotationStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unknown quotation status '" + status + "'");
        }
    }
}
