package com.devflow.entity;
public class Enums {
    public enum Role { ADMIN, SALES_REP, SALES_MANAGER, FINANCE, CUSTOMER, BUYER, SELLER, VENDOR }
    public enum Mode { LOCAL, PROFESSIONAL }
    public enum Tier { BRONZE, SILVER, GOLD }
    public enum BillingCycle { MONTHLY, QUARTERLY, YEARLY }
    public enum ProrationType { NONE, EXACT_DAYS }
    public enum QuotationStatus { DRAFT, PENDING_L1, PENDING_L2, APPROVED, REJECTED, SENT_TO_CUSTOMER, UNDER_NEGOTIATION, CONFIRMED }
    public enum FulfillmentStatus { PENDING, PARTIAL, COMPLETED }

    /**
     * Escrow lifecycle:
     * PENDING  — payment record created, buyer has not completed the (mock) UPI step
     * HELD     — funds captured and held by the platform
     * RELEASED — delivery confirmed, funds paid out to the seller minus the platform fee
     * REFUNDED — returned to the buyer
     * DISPUTED — frozen pending manual resolution
     */
    public enum PaymentStatus { PENDING, HELD, RELEASED, REFUNDED, DISPUTED }

    public enum BidStatus { SUBMITTED, ACCEPTED, REJECTED, WITHDRAWN }
    public enum RequirementStatus { OPEN, CLOSED, AWARDED }
    public enum AuditAction { CREATED, UPDATED, DELETED }
}
