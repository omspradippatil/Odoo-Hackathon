import { estimateDelivery } from "@/lib/deliveryEstimate";

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

export type BiddingStatus = 'SCHEDULED' | 'LIVE' | 'CLOSED';

export interface BidEntry {
  id: string;
  vendorName: string;
  vendorTier: 'GOLD' | 'SILVER' | 'BRONZE';
  amount: number;
  timestamp: string;
  isYou?: boolean;
}

export interface BuyerProfile {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  gstin: string;
}

export interface BiddingSession {
  id: string;
  title: string;
  requirementId: string;
  quantity: number;
  unit: string;
  reservePrice: number;
  scheduledStart: string;
  durationMinutes: number;
  bids: BidEntry[];
  createdAt: string;
  anonymous: boolean;
  buyer: BuyerProfile;
  awardedBidId?: string;
  sellerConfirmed?: boolean;
}

// BIDDING: both sides masked. AWARDED: buyer picked a bid, seller has yet to accept.
// CONFIRMED: seller accepted — identities and customer contact details are released.
export type DealStage = 'BIDDING' | 'AWARDED' | 'CONFIRMED';

export function getDealStage(session: BiddingSession): DealStage {
  if (session.awardedBidId && session.sellerConfirmed) return 'CONFIRMED';
  if (session.awardedBidId) return 'AWARDED';
  return 'BIDDING';
}

// A vendor's real name is only visible once they have won and accepted the deal.
// Reveal is keyed on the vendor, not the single winning bid — otherwise their own
// earlier bids stay aliased in the same ladder and can be correlated back by tier.
export function isIdentityRevealed(session: BiddingSession, bid: BidEntry): boolean {
  if (!session.anonymous) return true;
  if (getDealStage(session) !== 'CONFIRMED') return false;
  const awarded = session.bids.find((b) => b.id === session.awardedBidId);
  return !!awarded && awarded.vendorName === bid.vendorName;
}

export function getSessionStatus(session: BiddingSession, now: Date = new Date()): BiddingStatus {
  const start = new Date(session.scheduledStart).getTime();
  const end = start + session.durationMinutes * 60_000;
  if (now.getTime() < start) return 'SCHEDULED';
  if (now.getTime() < end) return 'LIVE';
  return 'CLOSED';
}

export function getLeadingBid(session: BiddingSession): BidEntry | undefined {
  if (!session.bids.length) return undefined;
  return session.bids.reduce((best, bid) => (bid.amount < best.amount ? bid : best));
}

const INITIAL_NOTIFICATIONS: DemoNotification[] = [
  {
    id: "notif-1",
    title: "Approval Requested",
    message: "Approval requested for QT-2048",
    type: "approval",
    timestamp: "10m ago",
    read: false,
    targetUrl: "/approvals/QT-2048",
    badgeText: "Approval"
  },
  {
    id: "notif-2",
    title: "Customer Counter-Offer",
    message: "Customer requested a 15% discount",
    type: "negotiation",
    timestamp: "25m ago",
    read: false,
    targetUrl: "/negotiation/QT-2048",
    badgeText: "Negotiation"
  },
  {
    id: "notif-3",
    title: "Reapproval Required",
    message: "Reapproval required for quotation V2",
    type: "approval",
    timestamp: "35m ago",
    read: false,
    targetUrl: "/approvals/QT-2048",
    badgeText: "Reapproval"
  },
  {
    id: "notif-4",
    title: "Quotation Approved",
    message: "QT-2048 was approved",
    type: "approval",
    timestamp: "50m ago",
    read: true,
    targetUrl: "/negotiation/QT-2048",
    badgeText: "Approved"
  },
  {
    id: "notif-5",
    title: "Payment Received",
    message: "Payment of ₹2.52L received",
    type: "payment",
    timestamp: "1h ago",
    read: true,
    targetUrl: "/operations/payments/DF-2048",
    badgeText: "Payment"
  },
  {
    id: "notif-6",
    title: "Shipment Dispatched",
    message: "Shipment from Mumbai warehouse dispatched",
    type: "fulfilment",
    timestamp: "2h ago",
    read: true,
    targetUrl: "/operations/fulfilment/DF-2048",
    badgeText: "Fulfilment"
  },
  {
    id: "notif-7",
    title: "Delivery Confirmation",
    message: "Delivery confirmation received",
    type: "fulfilment",
    timestamp: "3h ago",
    read: true,
    targetUrl: "/customer/deals/DF-2048/fulfilment",
    badgeText: "Delivery"
  },
  {
    id: "notif-8",
    title: "Invoice Generated",
    message: "INV-2048-01 generated",
    type: "billing",
    timestamp: "Yesterday",
    read: true,
    targetUrl: "/operations/billing/DF-2048",
    badgeText: "Billing"
  }
];

const NOTIFICATIONS_STORAGE_KEY = "devflow_demo_notifications";
const APPROVAL_STATE_STORAGE_KEY = "devflow_demo_approval_state_";
const BIDDING_STORAGE_KEY = "devflow_demo_bidding_sessions";

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
    const delivery = estimateDelivery(cartItems);
    const newOrder = {
      id: orderId,
      buyerId: "USER-LOCAL-01",
      subtotal: total,
      platformFee: platformFee,
      total: total + platformFee,
      paymentStatus: "ESCROW_HELD",
      fulfilmentStatus: "PENDING_DISPATCH",
      createdAt: new Date().toISOString(),
      estimatedDelivery: delivery,
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

  // Live Bidding (reverse auction — lowest compliant bid leads)
  getBiddingSessions(): BiddingSession[] {
    if (typeof window === "undefined") return seedBiddingSessions();
    try {
      const stored = sessionStorage.getItem(BIDDING_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      const seeded = seedBiddingSessions();
      sessionStorage.setItem(BIDDING_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    } catch {
      return seedBiddingSessions();
    }
  },

  getBiddingSession(sessionId: string): BiddingSession | undefined {
    return this.getBiddingSessions().find((s) => s.id === sessionId);
  },

  scheduleBiddingSession(input: {
    title: string;
    quantity: number;
    unit?: string;
    reservePrice: number;
    scheduledStart: string;
    durationMinutes?: number;
    anonymous?: boolean;
  }): string {
    const id = `BID-${Math.floor(1000 + Math.random() * 9000)}`;
    const session: BiddingSession = {
      id,
      title: input.title,
      requirementId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      quantity: input.quantity,
      unit: input.unit || "units",
      reservePrice: input.reservePrice,
      scheduledStart: input.scheduledStart,
      durationMinutes: input.durationMinutes ?? 45,
      bids: [],
      createdAt: new Date().toISOString(),
      anonymous: input.anonymous ?? true,
      buyer: DEMO_BUYER,
    };

    if (typeof window !== "undefined") {
      try {
        const sessions = [session, ...this.getBiddingSessions()];
        sessionStorage.setItem(BIDDING_STORAGE_KEY, JSON.stringify(sessions));
        biddingListeners.forEach((l) => l());
        this.addNotification({
          title: "Bidding Scheduled",
          message: `${input.title} opens ${new Date(input.scheduledStart).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`,
          type: "negotiation",
          targetUrl: `/demo/live-bidding?session=${id}`,
          badgeText: "Bidding",
        });
      } catch (e) {
        console.error("Failed to schedule bidding session", e);
      }
    }
    return id;
  },

  placeBid(sessionId: string, bid: { vendorName: string; vendorTier: BidEntry["vendorTier"]; amount: number; isYou?: boolean }): void {
    if (typeof window === "undefined") return;
    try {
      const sessions = this.getBiddingSessions().map((session) => {
        if (session.id !== sessionId) return session;
        const entry: BidEntry = {
          id: `bid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          vendorName: bid.vendorName,
          vendorTier: bid.vendorTier,
          amount: bid.amount,
          timestamp: new Date().toISOString(),
          isYou: bid.isYou,
        };
        return { ...session, bids: [entry, ...session.bids] };
      });
      sessionStorage.setItem(BIDDING_STORAGE_KEY, JSON.stringify(sessions));
      biddingListeners.forEach((l) => l());
    } catch (e) {
      console.error("Failed to place bid", e);
    }
  },

  // Buyer picks a winning bid. The vendor stays masked until they accept.
  awardBid(sessionId: string, bidId: string): void {
    if (typeof window === "undefined") return;
    try {
      const sessions = this.getBiddingSessions().map((session) =>
        session.id === sessionId ? { ...session, awardedBidId: bidId, sellerConfirmed: false } : session
      );
      sessionStorage.setItem(BIDDING_STORAGE_KEY, JSON.stringify(sessions));
      biddingListeners.forEach((l) => l());

      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        this.addNotification({
          title: "Bid Awarded",
          message: `${session.title} awarded — awaiting seller acceptance.`,
          type: "negotiation",
          targetUrl: `/demo/live-bidding?session=${sessionId}`,
          badgeText: "Awarded",
        });
      }
    } catch (e) {
      console.error("Failed to award bid", e);
    }
  },

  // Seller accepts the award. This is the moment identities unmask and the
  // buyer's contact and delivery details are released to the winning vendor.
  confirmDealBySeller(sessionId: string): void {
    if (typeof window === "undefined") return;
    try {
      const sessions = this.getBiddingSessions().map((session) =>
        session.id === sessionId && session.awardedBidId ? { ...session, sellerConfirmed: true } : session
      );
      sessionStorage.setItem(BIDDING_STORAGE_KEY, JSON.stringify(sessions));
      biddingListeners.forEach((l) => l());

      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        this.addNotification({
          title: "Deal Confirmed",
          message: `${session.title} confirmed — customer details released to the seller.`,
          type: "system",
          targetUrl: `/demo/live-bidding?session=${sessionId}`,
          badgeText: "Confirmed",
        });
      }
    } catch (e) {
      console.error("Failed to confirm deal", e);
    }
  },

  cancelBiddingSession(sessionId: string): void {
    if (typeof window === "undefined") return;
    try {
      const sessions = this.getBiddingSessions().filter((s) => s.id !== sessionId);
      sessionStorage.setItem(BIDDING_STORAGE_KEY, JSON.stringify(sessions));
      biddingListeners.forEach((l) => l());
    } catch (e) {
      console.error("Failed to cancel bidding session", e);
    }
  },

  subscribeBidding(callback: Listener): () => void {
    biddingListeners.add(callback);
    return () => {
      biddingListeners.delete(callback);
    };
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
const biddingListeners: Set<Listener> = new Set();

const DEMO_BUYER: BuyerProfile = {
  company: "ABC Enterprises Pvt Ltd",
  contactName: "Rhea Malhotra",
  email: "procurement@abcenterprises.in",
  phone: "+91 98204 41172",
  deliveryAddress: "12th Floor, Tower B, Tech Park, Andheri East, Mumbai 400093",
  gstin: "27AABCA1234F1Z5",
};

// Seeds are anchored to the current clock so the demo always has one live room,
// upcoming rooms on the calendar, and a settled room to inspect.
function seedBiddingSessions(): BiddingSession[] {
  const now = new Date();

  const at = (dayOffset: number, hour: number, minute = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };

  const liveStart = new Date(now.getTime() - 6 * 60_000).toISOString();
  const closedStart = at(-2, 11);

  const seeds: Omit<BiddingSession, "anonymous" | "buyer">[] = [
    {
      id: "BID-2048",
      title: "50 Enterprise Laptops",
      requirementId: "REQ-2048",
      quantity: 50,
      unit: "units",
      reservePrice: 94000,
      scheduledStart: liveStart,
      durationMinutes: 45,
      createdAt: closedStart,
      bids: [
        { id: "bid-s1", vendorName: "Vertex Systems", vendorTier: "GOLD", amount: 91500, timestamp: new Date(now.getTime() - 5 * 60_000).toISOString() },
        { id: "bid-s2", vendorName: "Nova Supply Co", vendorTier: "SILVER", amount: 90800, timestamp: new Date(now.getTime() - 4 * 60_000).toISOString() },
        { id: "bid-s3", vendorName: "Orbit Traders", vendorTier: "BRONZE", amount: 90200, timestamp: new Date(now.getTime() - 2 * 60_000).toISOString() },
      ],
    },
    {
      id: "BID-2049",
      title: "120 Ergonomic Office Chairs",
      requirementId: "REQ-2049",
      quantity: 120,
      unit: "units",
      reservePrice: 12000,
      scheduledStart: at(1, 11),
      durationMinutes: 60,
      createdAt: now.toISOString(),
      bids: [],
    },
    {
      id: "BID-2050",
      title: "Annual Network Hardware Refresh",
      requirementId: "REQ-2050",
      quantity: 30,
      unit: "racks",
      reservePrice: 245000,
      scheduledStart: at(3, 15, 30),
      durationMinutes: 90,
      createdAt: now.toISOString(),
      bids: [],
    },
    {
      id: "BID-2051",
      title: "Warehouse Forklift Fleet",
      requirementId: "REQ-2051",
      quantity: 8,
      unit: "units",
      reservePrice: 680000,
      scheduledStart: closedStart,
      durationMinutes: 45,
      createdAt: at(-5, 9),
      bids: [
        { id: "bid-c1", vendorName: "Vertex Systems", vendorTier: "GOLD", amount: 664000, timestamp: at(-2, 11, 12) },
        { id: "bid-c2", vendorName: "Orbit Traders", vendorTier: "BRONZE", amount: 651000, timestamp: at(-2, 11, 26) },
        { id: "bid-c3", vendorName: "Nova Supply Co", vendorTier: "SILVER", amount: 648500, timestamp: at(-2, 11, 39) },
      ],
      // Already settled, so this room demonstrates the post-reveal state.
      awardedBidId: "bid-c3",
      sellerConfirmed: true,
    },
  ];

  return seeds.map((seed) => ({ ...seed, anonymous: true, buyer: DEMO_BUYER }));
}
