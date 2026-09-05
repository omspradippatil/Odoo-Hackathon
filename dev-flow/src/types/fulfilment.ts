export type FulfilmentStatus = 
  | 'PENDING'
  | 'PARTIALLY_ALLOCATED'
  | 'FULLY_ALLOCATED'
  | 'BACKORDERED'
  | 'PARTIALLY_SHIPPED'
  | 'SHIPPED'
  | 'PARTIALLY_DELIVERED'
  | 'DELIVERED'
  | 'CONFIRMED'
  | 'ISSUE_REPORTED'
  | 'COMPLETED';

export type ShipmentStatus =
  | 'ALLOCATION_PENDING'
  | 'ALLOCATED'
  | 'PICKING'
  | 'PACKED'
  | 'READY_TO_DISPATCH'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'DELIVERY_CONFIRMED'
  | 'FAILED_DELIVERY'
  | 'RETURNED'
  | 'CANCELLED';

export interface Warehouse {
  id: string;
  vendorId: string;
  name: string;
  location: string;
}

export interface Allocation {
  id: string;
  fulfilmentId: string;
  vendorId: string;
  vendorName: string;
  warehouseId: string;
  warehouseName: string;
  productId: string;
  quantity: number;
  status: 'PENDING' | 'RESERVED' | 'ALLOCATED' | 'SHIPPED';
}

export interface Shipment {
  id: string;
  fulfilmentId: string;
  vendorId: string;
  vendorName: string;
  warehouseName: string;
  status: ShipmentStatus;
  trackingNumber?: string;
  carrier?: string;
  dispatchDate?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  quantity: number;
}

export interface Backorder {
  id: string;
  productId: string;
  quantity: number;
  expectedAvailability: string;
  status: 'PENDING' | 'RESOLVED' | 'CANCELLED';
}
