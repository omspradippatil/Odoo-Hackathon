package com.devflow.entity;
public class Enums {
    public enum Role { ADMIN, SALES_REP, SALES_MANAGER, FINANCE, CUSTOMER, BUYER, SELLER, VENDOR }
    public enum Mode { LOCAL, PROFESSIONAL }
    public enum Tier { BRONZE, SILVER, GOLD }
    public enum BillingCycle { MONTHLY, QUARTERLY, YEARLY }
    public enum ProrationType { NONE, EXACT_DAYS }
    public enum QuotationStatus { DRAFT, PENDING_L1, PENDING_L2, APPROVED, REJECTED, SENT_TO_CUSTOMER, UNDER_NEGOTIATION, CONFIRMED }
    public enum FulfillmentStatus { PENDING, PARTIAL, COMPLETED }
    public enum PaymentStatus { HELD, RELEASED, DISPUTED }
    public enum BidStatus { SUBMITTED, ACCEPTED, REJECTED }
    public enum RequirementStatus { OPEN, CLOSED }
    public enum AuditAction { CREATED, UPDATED, DELETED }
}
