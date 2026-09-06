export interface DemoNotification {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'payment' | 'fulfilment' | 'billing' | 'negotiation' | 'system';
  timestamp: string;
  read: boolean;
  targetUrl: string;
  badgeText: string;
}

export type QuotationApprovalState = 
  | 'DRAFT' 
  | 'REQUESTING' 
  | 'PENDING_APPROVAL' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'REAPPROVAL_REQUIRED' 
  | 'REAPPROVAL_PENDING';

const INITIAL_NOTIFICATIONS: DemoNotification[] = [
  {
    id: "notif-1",
    title: "Approval Requested",
    message: "Approval requested for QT-2048 (12% discount exceeds 5% authority)",
    type: "approval",
    timestamp: "10m ago",
    read: false,
    targetUrl: "/approvals/QT-2048",
    badgeText: "Approval"
  },
  {
    id: "notif-2",
    title: "Customer Counter-Offer",
    message: "Customer requested a 15% discount on quotation V2",
    type: "negotiation",
    timestamp: "25m ago",
    read: false,
    targetUrl: "/negotiation/QT-2048",
    badgeText: "Negotiation"
  },
  {
    id: "notif-3",
    title: "Payment Received",
    message: "Payment of ₹2.52L received for Deal DF-2048",
    type: "payment",
    timestamp: "1h ago",
    read: false,
    targetUrl: "/operations/payments/DF-2048",
    badgeText: "Payment"
  },
  {
    id: "notif-4",
    title: "Warehouse Dispatch",
    message: "Shipment from Mumbai warehouse dispatched (Trk #WB-88219)",
    type: "fulfilment",
    timestamp: "2h ago",
    read: true,
    targetUrl: "/operations/fulfilment/DF-2048",
    badgeText: "Fulfilment"
  },
  {
    id: "notif-5",
    title: "Delivery Confirmed",
    message: "Delivery confirmation received for Nova Retail expansion",
    type: "fulfilment",
    timestamp: "3h ago",
    read: true,
    targetUrl: "/customer/deals/DF-2048/fulfilment",
    badgeText: "Delivery"
  },
  {
    id: "notif-6",
    title: "Invoice Generated",
    message: "INV-2048-01 generated for ₹8.40L",
    type: "billing",
    timestamp: "Yesterday",
    read: true,
    targetUrl: "/operations/billing/DF-2048",
    badgeText: "Billing"
  }
];

const NOTIFICATIONS_STORAGE_KEY = "devflow_demo_notifications";
const APPROVAL_STATE_STORAGE_KEY = "devflow_demo_approval_state_";

// In-memory subscribers
type Listener = () => void;
const notificationListeners: Set<Listener> = new Set();
const approvalStateListeners: Set<Listener> = new Set();

function notifyNotificationListeners() {
  notificationListeners.forEach(listener => {
    try {
      listener();
    } catch (e) {
      console.error("Error in notification listener:", e);
    }
  });
}

function notifyApprovalStateListeners() {
  approvalStateListeners.forEach(listener => {
    try {
      listener();
    } catch (e) {
      console.error("Error in approval listener:", e);
    }
  });
}

export const demoState = {
  getNotifications(): DemoNotification[] {
    if (typeof window === "undefined") return INITIAL_NOTIFICATIONS;
    try {
      const stored = sessionStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize if absent
      sessionStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  getUnreadCount(): number {
    const list = this.getNotifications();
    return list.filter(n => !n.read).length;
  },

  markAsRead(id: string): void {
    if (typeof window === "undefined") return;
    try {
      const list = this.getNotifications();
      const updated = list.map(item => item.id === id ? { ...item, read: true } : item);
      sessionStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
      notifyNotificationListeners();
    } catch (e) {
      console.error("Failed to mark notification read", e);
    }
  },

  markAllAsRead(): void {
    if (typeof window === "undefined") return;
    try {
      const list = this.getNotifications();
      const updated = list.map(item => ({ ...item, read: true }));
      sessionStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
      notifyNotificationListeners();
    } catch (e) {
      console.error("Failed to mark all notifications read", e);
    }
  },

  addNotification(notification: {
    title: string;
    message: string;
    type: DemoNotification['type'];
    targetUrl: string;
    badgeText?: string;
  }): void {
    if (typeof window === "undefined") return;
    try {
      const list = this.getNotifications();
      // Remove any existing notification with identical title to avoid duplicate clutter
      const filtered = list.filter(n => !(n.title === notification.title && n.targetUrl === notification.targetUrl));
      const newItem: DemoNotification = {
        id: `notif-${Date.now()}`,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        timestamp: "Just now",
        read: false,
        targetUrl: notification.targetUrl,
        badgeText: notification.badgeText || notification.type.charAt(0).toUpperCase() + notification.type.slice(1)
      };
      const updated = [newItem, ...filtered];
      sessionStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
      notifyNotificationListeners();
    } catch (e) {
      console.error("Failed to add notification", e);
    }
  },

  subscribeNotifications(callback: Listener): () => void {
    notificationListeners.add(callback);
    return () => {
      notificationListeners.delete(callback);
    };
  },

  getQuotationApprovalState(quotationId: string = "QT-2048"): QuotationApprovalState {
    if (typeof window === "undefined") return "DRAFT";
    try {
      const stored = sessionStorage.getItem(`${APPROVAL_STATE_STORAGE_KEY}${quotationId}`);
      if (stored) {
        return stored as QuotationApprovalState;
      }
      return "DRAFT";
    } catch {
      return "DRAFT";
    }
  },

  setQuotationApprovalState(quotationId: string = "QT-2048", state: QuotationApprovalState): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(`${APPROVAL_STATE_STORAGE_KEY}${quotationId}`, state);
      notifyApprovalStateListeners();
    } catch (e) {
      console.error("Failed to set quotation approval state", e);
    }
  },

  subscribeQuotationState(callback: Listener): () => void {
    approvalStateListeners.add(callback);
    return () => {
      approvalStateListeners.delete(callback);
    };
  },
  
  // Anonymous Bidding
  getAnonymousBidding(): boolean {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("devflow_demo_anon_bidding") === "true";
  },
  setAnonymousBidding(enabled: boolean): void {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("devflow_demo_anon_bidding", enabled.toString());
  },

  // Cart
  getCartItems(): any[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(sessionStorage.getItem("devflow_demo_cart") || "[]");
    } catch { return []; }
  },
  setCartItems(items: any[]): void {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("devflow_demo_cart", JSON.stringify(items));
    cartListeners.forEach(l => l());
  },
  subscribeCart(callback: Listener): () => void {
    cartListeners.add(callback);
    return () => {
      cartListeners.delete(callback);
    };
  },
  
  // Local Orders
  getLocalOrders(): any[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(sessionStorage.getItem("devflow_demo_local_orders") || "[]");
    } catch { return []; }
  },
  createLocalOrder(cartItems: any[]): string {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const total = cartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const platformFee = total * 0.02;
    const newOrder = {
      id: orderId,
      buyerId: "USER-LOCAL-01",
      subtotal: total,
      platformFee: platformFee,
      total: total + platformFee,
      paymentStatus: "ESCROW_HELD",
      fulfilmentStatus: "PENDING_DISPATCH",
      createdAt: new Date().toISOString(),
      title: `Local Order - ${cartItems.length} items`,
      items: cartItems.map((item: any) => ({
        productId: item.productId,
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };
    
    const orders = this.getLocalOrders();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("devflow_demo_local_orders", JSON.stringify([newOrder, ...orders]));
      this.setCartItems([]); // Clear cart
      this.addNotification({
        title: "Order Placed",
        message: `Local order ${orderId} placed successfully.`,
        type: "payment",
        targetUrl: `/customer/deals/${orderId}/payment`,
        badgeText: "Local Order"
      });
    }
    return orderId;
  },

  // Mock Products
  getMockProducts(): any[] {
    return [
      {
        id: "PRD-1", name: "Dell Latitude 5420 (Refurbished)", category: "Electronics", brand: "Dell", 
        sellerName: "Gadget Fix", sellerId: "VND-LOC-01", price: 35000, originalPrice: 45000, sellingPrice: 35000, 
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800",
        stock: 5, sellerLocation: "Mumbai", trustScore: 88, verificationStatus: "VERIFIED", distanceKm: 4.2, 
        rating: 4.5, trustTier: "Silver", availabilityStatus: "Low Stock", deliveryAvailable: true, pickupAvailable: true
      },
      {
        id: "PRD-2", name: "Ergonomic Office Chair", category: "Furniture", brand: "Herman Miller", 
        sellerName: "Office Solutions", sellerId: "VND-LOC-02", price: 12000, originalPrice: 15000, sellingPrice: 12000, 
        image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800",
        stock: 12, sellerLocation: "Pune", trustScore: 92, verificationStatus: "VERIFIED", distanceKm: 120, 
        rating: 4.8, trustTier: "Gold", availabilityStatus: "In Stock", deliveryAvailable: true, pickupAvailable: false
      },
      {
        id: "PRD-3", name: "Logitech MX Master 3S", category: "Electronics", brand: "Logitech", 
        sellerName: "Tech Store", sellerId: "VND-LOC-03", price: 8500, originalPrice: 10000, sellingPrice: 8500, 
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800",
        stock: 25, sellerLocation: "Mumbai", trustScore: 95, verificationStatus: "VERIFIED", distanceKm: 2.1, 
      }
    ];
  }
};

const cartListeners: Set<Listener> = new Set();
