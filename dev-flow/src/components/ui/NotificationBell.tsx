"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, Check, CheckCheck, X, ShieldCheck, CreditCard, Truck, 
  Receipt, Handshake, Info, ArrowRight 
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { demoState, DemoNotification } from "@/lib/demoState";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  className?: string;
  iconClassName?: string;
}

export function NotificationBell({ className, iconClassName }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<DemoNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Load initial and subscribe to updates
  useEffect(() => {
    const syncState = () => {
      setNotifications(demoState.getNotifications());
      setUnreadCount(demoState.getUnreadCount());
    };

    syncState();
    const unsubscribe = demoState.subscribeNotifications(syncState);
    return () => unsubscribe();
  }, []);

  // Handle ESC key and outside clicks
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current && 
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (item: DemoNotification) => {
    demoState.markAsRead(item.id);
    setIsOpen(false);
    if (item.targetUrl) {
      router.push(item.targetUrl);
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    demoState.markAllAsRead();
  };

  const getTypeIcon = (type: DemoNotification['type']) => {
    switch (type) {
      case 'approval':
        return <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />;
      case 'negotiation':
        return <Handshake className="w-4 h-4 text-cobalt shrink-0" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-lime-600 shrink-0" />;
      case 'fulfilment':
        return <Truck className="w-4 h-4 text-sky-500 shrink-0" />;
      case 'billing':
        return <Receipt className="w-4 h-4 text-purple-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-navy/40 shrink-0" />;
    }
  };

  return (
    <div className="relative inline-block">
      {/* BELL TRIGGER BUTTON */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          "relative text-navy/60 hover:text-navy transition-colors focus:outline-none p-1.5 rounded-lg hover:bg-navy/5",
          isOpen && "text-navy bg-navy/5",
          className
        )}
        aria-label="Toggle notifications"
        aria-expanded={isOpen}
      >
        <Bell className={cn("w-5 h-5", iconClassName)} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* NOTIFICATION PANEL DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop for clean drawer feel */}
            <div 
              className="sm:hidden fixed inset-0 bg-navy/20 backdrop-blur-[2px] z-[54]" 
              onClick={() => setIsOpen(false)} 
            />

            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={cn(
                "fixed top-16 left-3 right-3 sm:left-auto sm:right-0 sm:absolute sm:top-full sm:mt-2",
                "w-auto sm:w-96 max-h-[80vh] sm:max-h-[500px] flex flex-col",
                "bg-white rounded-2xl shadow-2xl border border-navy/10 z-[55] overflow-hidden"
              )}
            >
              {/* HEADER */}
              <div className="p-4 border-b border-navy/5 bg-warm/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Notifications</h3>
                  {unreadCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-coral/10 text-coral border border-coral/20">
                      {unreadCount} unread
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime/20 text-lime-800">
                      All caught up
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs font-bold text-cobalt hover:text-cobalt/80 hover:underline px-2 py-1 rounded flex items-center gap-1 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="sm:hidden p-1 text-navy/40 hover:text-navy rounded-lg"
                    aria-label="Close panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* LIST */}
              <div className="overflow-y-auto flex-1 divide-y divide-navy/5 no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-navy/40 text-xs font-medium">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={cn(
                        "w-full text-left p-4 hover:bg-warm/40 transition-colors flex items-start gap-3 group relative",
                        !item.read ? "bg-white font-medium" : "bg-warm/15 opacity-75"
                      )}
                    >
                      {/* Left status bar indicator for unread */}
                      {!item.read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cobalt" />
                      )}

                      {/* Icon container */}
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border mt-0.5",
                        !item.read ? "bg-white border-navy/10 shadow-sm" : "bg-navy/5 border-transparent"
                      )}>
                        {getTypeIcon(item.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={cn(
                            "text-xs truncate",
                            !item.read ? "font-bold text-navy" : "font-medium text-navy/70"
                          )}>
                            {item.title}
                          </span>
                          <span className="text-[10px] text-navy/40 shrink-0 font-medium">
                            {item.timestamp}
                          </span>
                        </div>

                        <p className={cn(
                          "text-xs leading-relaxed line-clamp-2 mb-1.5",
                          !item.read ? "text-navy/80" : "text-navy/50"
                        )}>
                          {item.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-navy/5 text-navy/60">
                            {item.badgeText}
                          </span>
                          <span className="text-[11px] font-bold text-cobalt opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                            Open <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>

                      {/* Unread indicator / action */}
                      {!item.read && (
                        <div className="flex flex-col items-center gap-2 shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-cobalt" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              demoState.markAsRead(item.id);
                            }}
                            className="p-1 rounded-md text-navy/30 hover:text-cobalt hover:bg-navy/5 transition-colors opacity-0 group-hover:opacity-100"
                            title="Mark as read"
                            aria-label="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* FOOTER */}
              <div className="p-3 bg-warm/20 border-t border-navy/5 text-center shrink-0">
                <span className="text-[10px] font-medium text-navy/40">
                  Demo Mode • Notifications update in real-time
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
