package com.devflow.dto;

/** A rendered invoice plus the metadata the HTTP layer needs to name the download. */
public record InvoiceFile(String invoiceNumber, String fileName, byte[] content) {}
