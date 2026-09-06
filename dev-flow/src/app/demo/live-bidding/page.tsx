"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Gavel, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, X,
  TrendingDown, ShieldCheck, Activity, ArrowLeft, Radio, CheckCircle2, Timer, Users,
  EyeOff, Building2, Mail, Phone, MapPin, FileText, Unlock, Handshake
} from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  demoState, getSessionStatus, getLeadingBid, getDealStage, isIdentityRevealed,
  type BiddingSession, type BiddingStatus, type BidEntry
} from "@/lib/demoState";
import { assignAliases } from "@/lib/anonymity";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const RIVAL_VENDORS: { name: string; tier: BidEntry["vendorTier"] }[] = [
  { name: "Vertex Systems", tier: "GOLD" },
  { name: "Nova Supply Co", tier: "SILVER" },
  { name: "Orbit Traders", tier: "BRONZE" },
  { name: "Meridian Industrial", tier: "GOLD" },
];

const TIER_STYLES: Record<BidEntry["vendorTier"], string> = {
  GOLD: "bg-gold/20 text-yellow-700 border-gold/40",
  SILVER: "bg-silver/20 text-navy/70 border-silver/50",
  BRONZE: "bg-bronze/20 text-orange-800 border-bronze/40",
};

const STATUS_STYLES: Record<BiddingStatus, string> = {
  LIVE: "bg-coral text-white border-coral",
  SCHEDULED: "bg-cobalt/10 text-cobalt border-cobalt/20",
  CLOSED: "bg-navy/5 text-navy/50 border-navy/10",
};

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildMonthGrid(month: Date): (Date | null)[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  // Monday-first grid: JS getDay() is Sunday-first, so Sunday (0) becomes index 6.
  const leadingBlanks = (first.getDay() + 6) % 7;

  const cells: (Date | null)[] = Array(leadingBlanks).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function countdownLabel(target: number, now: number): string {
  const diff = Math.max(0, target - now);
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  return `${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

export default function LiveBiddingPage() {
  const [mounted, setMounted] = useState(false);
  const [sessions, setSessions] = useState<BiddingSession[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");

  const refresh = useCallback(() => setSessions(demoState.getBiddingSessions()), []);

  useEffect(() => {
    setMounted(true);
    refresh();
    return demoState.subscribeBidding(refresh);
  }, [refresh]);

  // Drives countdowns and SCHEDULED -> LIVE -> CLOSED transitions.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const activeStatus = activeSession ? getSessionStatus(activeSession, new Date(now)) : null;

  // Rival vendors keep undercutting each other while a room is live.
  useEffect(() => {
    if (!activeSession || activeStatus !== "LIVE") return;

    const id = setInterval(() => {
      const session = demoState.getBiddingSession(activeSession.id);
      if (!session || getSessionStatus(session) !== "LIVE") return;
      if (session.awardedBidId) return;

      const leading = getLeadingBid(session);
      const ceiling = leading ? leading.amount : session.reservePrice;
      const floor = session.reservePrice * 0.88;
      const next = Math.round(ceiling - ceiling * (0.004 + Math.random() * 0.008));
      if (next <= floor) return;

      const vendor = RIVAL_VENDORS[Math.floor(Math.random() * RIVAL_VENDORS.length)];
      demoState.placeBid(session.id, { vendorName: vendor.name, vendorTier: vendor.tier, amount: next });
    }, 7000);

    return () => clearInterval(id);
  }, [activeSession?.id, activeStatus]);

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, BiddingSession[]>();
    sessions.forEach((session) => {
      const key = new Date(session.scheduledStart).toDateString();
      map.set(key, [...(map.get(key) || []), session]);
    });
    return map;
  }, [sessions]);

  const daySessions = useMemo(() => {
    const list = sessionsByDay.get(selectedDate.toDateString()) || [];
    return [...list].sort((a, b) => +new Date(a.scheduledStart) - +new Date(b.scheduledStart));
  }, [sessionsByDay, selectedDate]);

  const liveCount = sessions.filter((s) => getSessionStatus(s, new Date(now)) === "LIVE").length;
  const grid = useMemo(() => buildMonthGrid(month), [month]);

  const handlePlaceBid = () => {
    if (!activeSession) return;
    const amount = Number(bidAmount);
    const leading = getLeadingBid(activeSession);

    if (!Number.isFinite(amount) || amount <= 0) {
      setBidError("Enter a valid bid amount.");
      return;
    }
    if (amount >= activeSession.reservePrice) {
      setBidError(`Bid must come in under the reserve of ${formatCurrency(activeSession.reservePrice)}.`);
      return;
    }
    if (leading && amount >= leading.amount) {
      setBidError(`Undercut the leading bid of ${formatCurrency(leading.amount)} to take the lead.`);
      return;
    }

    demoState.placeBid(activeSession.id, {
      vendorName: "Your Bid",
      vendorTier: "GOLD",
      amount,
      isYou: true,
    });
    setBidAmount("");
    setBidError("");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-warm/30 font-sans text-navy">
      <header className="bg-navy text-white px-4 md:px-8 py-4 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/demo" className="flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Demo Hub</span>
          </Link>
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <Gavel className="w-5 h-5 text-lime" /> Live Bidding
          </div>
          <div className="flex items-center gap-2">
            {liveCount > 0 && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-coral text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> {liveCount} Live
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Scheduled Reverse Auctions</div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Book a room. Let vendors bid it down.</h1>
          <p className="text-navy/60 font-medium max-w-2xl">
            Every requirement gets a scheduled bidding window. Vendors compete live against the reserve price —
            the lowest compliant bid when the clock stops wins the deal.
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8">
          {/* CALENDAR */}
          <section className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-navy/5 bg-warm/40">
              <div className="flex items-center gap-2 font-bold">
                <CalendarIcon className="w-4 h-4 text-cobalt" />
                {month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                  className="w-8 h-8 rounded-full border border-navy/10 flex items-center justify-center hover:bg-navy/5 transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { const t = new Date(); setMonth(t); setSelectedDate(t); }}
                  className="px-3 h-8 rounded-full border border-navy/10 text-[10px] font-bold uppercase tracking-widest hover:bg-navy/5 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                  className="w-8 h-8 rounded-full border border-navy/10 flex items-center justify-center hover:bg-navy/5 transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-5">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="text-center text-[9px] font-bold uppercase tracking-widest text-navy/40 py-1">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {grid.map((date, i) => {
                  if (!date) return <div key={`blank-${i}`} className="aspect-square" />;

                  const dayList = sessionsByDay.get(date.toDateString()) || [];
                  const isSelected = sameDay(date, selectedDate);
                  const isToday = sameDay(date, new Date(now));
                  const hasLive = dayList.some((s) => getSessionStatus(s, new Date(now)) === "LIVE");

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-sm font-bold transition-all border relative",
                        isSelected
                          ? "bg-navy text-white border-navy shadow-md"
                          : "border-transparent hover:bg-navy/5 hover:border-navy/10",
                        !isSelected && isToday && "border-cobalt/40 text-cobalt"
                      )}
                    >
                      <span>{date.getDate()}</span>
                      {dayList.length > 0 && (
                        <span className="flex items-center gap-0.5">
                          {dayList.slice(0, 3).map((s) => (
                            <span
                              key={s.id}
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                getSessionStatus(s, new Date(now)) === "LIVE"
                                  ? "bg-coral"
                                  : getSessionStatus(s, new Date(now)) === "SCHEDULED"
                                  ? (isSelected ? "bg-lime" : "bg-cobalt")
                                  : "bg-navy/25"
                              )}
                            />
                          ))}
                        </span>
                      )}
                      {hasLive && !isSelected && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-coral animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-navy/5 bg-warm/30 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-navy/50">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-coral" /> Live</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cobalt" /> Scheduled</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-navy/25" /> Closed</span>
            </div>
          </section>

          {/* DAY AGENDA */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Agenda</div>
                <h2 className="text-lg font-bold">
                  {selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
                </h2>
              </div>
              <button
                onClick={() => setShowSchedule(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-navy text-white text-xs font-bold hover:bg-navy/90 transition-colors active:scale-95 shadow-lg shadow-navy/20"
              >
                <Plus className="w-3.5 h-3.5" /> Schedule
              </button>
            </div>

            {daySessions.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-navy/15 p-8 text-center">
                <CalendarIcon className="w-8 h-8 text-navy/20 mx-auto mb-3" />
                <p className="text-sm font-medium text-navy/50 mb-4">No bidding rooms booked for this date.</p>
                <button
                  onClick={() => setShowSchedule(true)}
                  className="text-xs font-bold text-cobalt hover:underline"
                >
                  Schedule one →
                </button>
              </div>
            ) : (
              daySessions.map((session) => {
                const status = getSessionStatus(session, new Date(now));
                const leading = getLeadingBid(session);
                const start = new Date(session.scheduledStart);
                const savings = leading ? session.reservePrice - leading.amount : 0;

                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl border border-navy/10 shadow-sm p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">
                          {session.id} • {session.requirementId}
                        </div>
                        <h3 className="font-bold leading-tight">{session.title}</h3>
                      </div>
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border shrink-0 flex items-center gap-1",
                        STATUS_STYLES[status]
                      )}>
                        {status === "LIVE" && <Radio className="w-2.5 h-2.5" />}
                        {status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                      <div>
                        <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest mb-0.5">Window</div>
                        <div className="font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-navy/40" />
                          {start.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {session.durationMinutes}m
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest mb-0.5">Reserve</div>
                        <div className="font-bold">{formatCurrency(session.reservePrice)}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest mb-0.5">Volume</div>
                        <div className="font-bold">{session.quantity} {session.unit}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest mb-0.5">
                          {status === "CLOSED" ? "Winning Bid" : "Leading Bid"}
                        </div>
                        <div className={cn("font-bold", leading ? "text-lime-700" : "text-navy/40")}>
                          {leading ? formatCurrency(leading.amount) : "No bids yet"}
                        </div>
                      </div>
                    </div>

                    {savings > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-lime-700 bg-lime/15 border border-lime/30 rounded-lg px-2.5 py-1.5 mb-4">
                        <TrendingDown className="w-3 h-3" />
                        {formatCurrency(savings)} below reserve
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => { setActiveSessionId(session.id); setBidError(""); setBidAmount(""); }}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors",
                          status === "LIVE"
                            ? "bg-coral text-white hover:bg-coral/90 shadow-lg shadow-coral/20"
                            : "bg-navy/5 text-navy hover:bg-navy/10"
                        )}
                      >
                        {status === "LIVE" ? "Enter Bidding Room" : status === "SCHEDULED" ? "View Room" : "View Results"}
                      </button>
                      {status === "SCHEDULED" && (
                        <button
                          onClick={() => demoState.cancelBiddingSession(session.id)}
                          className="px-3 py-2.5 rounded-xl text-xs font-bold text-navy/50 hover:bg-coral/10 hover:text-coral transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </section>
        </div>
      </main>

      {/* BIDDING ROOM */}
      <AnimatePresence>
        {activeSession && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50"
              onClick={() => setActiveSessionId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.96, x: "-50%", y: "-50%" }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 w-[94vw] max-w-3xl max-h-[88vh] bg-white rounded-3xl shadow-2xl z-[51] overflow-hidden flex flex-col"
            >
              <BiddingRoom
                session={activeSession}
                status={activeStatus!}
                now={now}
                bidAmount={bidAmount}
                bidError={bidError}
                onBidAmountChange={(v) => { setBidAmount(v); setBidError(""); }}
                onPlaceBid={handlePlaceBid}
                onAward={() => {
                  const winner = getLeadingBid(activeSession);
                  if (winner) demoState.awardBid(activeSession.id, winner.id);
                }}
                onConfirm={() => demoState.confirmDealBySeller(activeSession.id)}
                onClose={() => setActiveSessionId(null)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SCHEDULE MODAL */}
      <AnimatePresence>
        {showSchedule && (
          <ScheduleModal
            defaultDate={selectedDate}
            onClose={() => setShowSchedule(false)}
            onScheduled={(date) => { setSelectedDate(date); setMonth(date); setShowSchedule(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function BiddingRoom({
  session, status, now, bidAmount, bidError, onBidAmountChange, onPlaceBid, onAward, onConfirm, onClose,
}: {
  session: BiddingSession;
  status: BiddingStatus;
  now: number;
  bidAmount: string;
  bidError: string;
  onBidAmountChange: (value: string) => void;
  onPlaceBid: () => void;
  onAward: () => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const leading = getLeadingBid(session);
  const start = new Date(session.scheduledStart).getTime();
  const end = start + session.durationMinutes * 60_000;
  const uniqueVendors = new Set(session.bids.map((b) => b.vendorName)).size;
  const progress = status === "LIVE" ? Math.min(100, ((now - start) / (end - start)) * 100) : status === "CLOSED" ? 100 : 0;

  const stage = getDealStage(session);
  const aliases = assignAliases(session.id, [...new Set(session.bids.map((b) => b.vendorName))]);
  const awardedBid = session.bids.find((b) => b.id === session.awardedBidId);

  const displayName = (bid: BidEntry) => {
    if (bid.isYou) return "Your Bid";
    if (isIdentityRevealed(session, bid)) return bid.vendorName;
    return `Vendor "${aliases[bid.vendorName] ?? "Mango"}"`;
  };

  return (
    <>
      <div className={cn("px-5 sm:px-7 py-5 flex items-start justify-between gap-4 shrink-0", status === "LIVE" ? "bg-coral text-white" : "bg-navy text-white")}>
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1 flex items-center gap-1.5">
            {status === "LIVE" && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
            {session.id} • {status}
          </div>
          <h2 className="text-lg sm:text-xl font-bold leading-tight truncate">{session.title}</h2>
          <div className="text-xs opacity-80 mt-1">{session.quantity} {session.unit} • Reserve {formatCurrency(session.reservePrice)}</div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors shrink-0" aria-label="Close bidding room">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 sm:px-7 py-4 border-b border-navy/5 bg-warm/40 shrink-0">
        <div className="flex items-center justify-between mb-2 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-navy/60">
            <Timer className="w-3.5 h-3.5" />
            {status === "LIVE" ? "Closes in" : status === "SCHEDULED" ? "Opens in" : "Auction closed"}
          </span>
          <span className={cn("font-mono", status === "LIVE" ? "text-coral" : "text-navy")}>
            {status === "LIVE" ? countdownLabel(end, now) : status === "SCHEDULED" ? countdownLabel(start, now) : "—"}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-navy/10 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-1000", status === "LIVE" ? "bg-coral" : "bg-navy/30")}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-navy/5 border-b border-navy/5 shrink-0">
        <div className="p-4 text-center">
          <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest mb-1">
            {status === "CLOSED" ? "Winning" : "Leading"}
          </div>
          <div className={cn("font-bold", leading ? "text-lime-700" : "text-navy/30")}>
            {leading ? formatCurrency(leading.amount) : "—"}
          </div>
        </div>
        <div className="p-4 text-center">
          <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest mb-1">Below Reserve</div>
          <div className="font-bold text-navy">
            {leading ? formatCurrency(session.reservePrice - leading.amount) : "—"}
          </div>
        </div>
        <div className="p-4 text-center">
          <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
            <Users className="w-2.5 h-2.5" /> Bidders
          </div>
          <div className="font-bold text-navy">{uniqueVendors}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-2">
        {session.anonymous && stage === "BIDDING" && (
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-cobalt/5 border border-cobalt/20 mb-4">
            <EyeOff className="w-4 h-4 text-cobalt shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium text-navy/70 leading-relaxed">
              <strong className="text-navy">Anonymous round.</strong> Vendors bid under a produce codename and
              neither side sees the other&apos;s identity. Real names and the buyer&apos;s contact details are
              released only after the winning seller accepts the award.
            </p>
          </div>
        )}

        {stage === "AWARDED" && awardedBid && (
          <div className="p-4 rounded-2xl bg-gold/10 border border-gold/40 mb-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-yellow-700 mb-2">
              <Handshake className="w-3.5 h-3.5" /> Awaiting seller acceptance
            </div>
            <p className="text-[11px] font-medium text-navy/70 leading-relaxed">
              {displayName(awardedBid)} has been awarded this deal at{" "}
              <strong className="text-navy">{formatCurrency(awardedBid.amount)}</strong>. Identities stay masked
              until they accept.
            </p>
          </div>
        )}

        {stage === "CONFIRMED" && awardedBid && (
          <div className="mb-4 space-y-3">
            <div className="p-4 rounded-2xl bg-lime/15 border border-lime/40">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-lime-700 mb-2">
                <Unlock className="w-3.5 h-3.5" /> Identities revealed
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-navy/40 mb-0.5">Winning vendor</div>
                  <div className="font-bold text-navy truncate">{awardedBid.vendorName}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-navy/40 mb-0.5">Awarded at</div>
                  <div className="font-bold text-navy">{formatCurrency(awardedBid.amount)}</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-navy text-white">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-lime" /> Customer details released to seller
              </div>
              <div className="space-y-2.5 text-xs">
                <DetailRow icon={Building2} label="Company" value={session.buyer.company} />
                <DetailRow icon={Users} label="Contact" value={session.buyer.contactName} />
                <DetailRow icon={Mail} label="Email" value={session.buyer.email} />
                <DetailRow icon={Phone} label="Phone" value={session.buyer.phone} />
                <DetailRow icon={MapPin} label="Delivery" value={session.buyer.deliveryAddress} />
                <DetailRow icon={FileText} label="GSTIN" value={session.buyer.gstin} />
              </div>
              <p className="text-[10px] font-medium text-white/40 mt-3 pt-3 border-t border-white/10">
                Only the winning seller receives these details. Losing bidders stay anonymous and see nothing.
              </p>
            </div>
          </div>
        )}

        <div className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-2">Bid Activity</div>
        {session.bids.length === 0 ? (
          <div className="text-center py-10">
            <Gavel className="w-8 h-8 text-navy/15 mx-auto mb-3" />
            <p className="text-sm font-medium text-navy/50">
              {status === "SCHEDULED" ? "Bidding opens when the room goes live." : "No bids were placed."}
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {session.bids.map((bid) => {
              const isLeader = leading?.id === bid.id;
              return (
                <motion.div
                  key={bid.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-center justify-between gap-3 p-3 rounded-2xl border transition-colors",
                    isLeader ? "bg-lime/10 border-lime/40" : "bg-white border-navy/5",
                    bid.isYou && "ring-1 ring-cobalt/30"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={cn("px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border shrink-0", TIER_STYLES[bid.vendorTier])}>
                      {bid.vendorTier}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate flex items-center gap-1.5">
                        {displayName(bid)}
                        {bid.isYou && <span className="text-[9px] font-bold text-cobalt uppercase tracking-wider">You</span>}
                        {!bid.isYou && session.anonymous && !isIdentityRevealed(session, bid) && (
                          <EyeOff className="w-3 h-3 text-navy/30 shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] font-medium text-navy/40">
                        {new Date(bid.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-sm">{formatCurrency(bid.amount)}</div>
                    {isLeader && (
                      <div className="text-[9px] font-bold text-lime-700 uppercase tracking-wider flex items-center gap-0.5 justify-end">
                        <CheckCircle2 className="w-2.5 h-2.5" /> {status === "CLOSED" ? "Won" : "Leading"}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      <div className="p-5 sm:p-7 border-t border-navy/5 bg-warm/30 shrink-0">
        {status === "LIVE" && stage === "BIDDING" ? (
          <>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => onBidAmountChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onPlaceBid()}
                  placeholder={leading ? `Under ${leading.amount}` : `Under ${session.reservePrice}`}
                  className="w-full h-12 pl-9 pr-4 rounded-xl bg-white border border-navy/10 focus:outline-none focus:border-cobalt text-sm font-bold"
                />
              </div>
              <button
                onClick={onPlaceBid}
                className="px-6 h-12 rounded-xl bg-navy text-white text-sm font-bold hover:bg-navy/90 transition-colors shadow-lg shadow-navy/20 active:scale-95 flex items-center gap-2"
              >
                <Gavel className="w-4 h-4" /> Place Bid
              </button>
            </div>
            {bidError && <p className="text-xs font-bold text-coral mt-2">{bidError}</p>}
            <p className="text-[10px] font-medium text-navy/40 mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> Reverse auction — the lowest compliant bid at close wins the deal.
            </p>
          </>
        ) : status === "SCHEDULED" ? (
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-navy/50 py-2">
            <Activity className="w-4 h-4" /> Room opens {new Date(session.scheduledStart).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </div>
        ) : !leading ? (
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-navy/50 py-2">
            <X className="w-4 h-4" /> Closed with no bids
          </div>
        ) : null}

        {stage === "BIDDING" && leading && (
          <button
            onClick={onAward}
            className={cn(
              "w-full py-3.5 rounded-xl font-bold text-white bg-navy hover:bg-navy/90 shadow-lg shadow-navy/20",
              "transition-all active:scale-95 flex items-center justify-center gap-2",
              status === "LIVE" && "mt-3"
            )}
          >
            <Gavel className="w-4 h-4" /> Award deal to {displayName(leading)}
          </button>
        )}

        {stage === "AWARDED" && (
          <button
            onClick={onConfirm}
            className="w-full py-3.5 rounded-xl font-bold text-navy bg-lime hover:bg-lime/90 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Handshake className="w-4 h-4" /> Accept as seller & release customer details
          </button>
        )}

        {stage === "CONFIRMED" && awardedBid && (
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-lime-700 py-2">
            <CheckCircle2 className="w-4 h-4" />
            {awardedBid.vendorName} won at {formatCurrency(awardedBid.amount)}
          </div>
        )}
      </div>
    </>
  );
}

function ScheduleModal({
  defaultDate, onClose, onScheduled,
}: {
  defaultDate: Date;
  onClose: () => void;
  onScheduled: (date: Date) => void;
}) {
  const toDateInput = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("50");
  const [unit, setUnit] = useState("units");
  const [reservePrice, setReservePrice] = useState("");
  const [date, setDate] = useState(toDateInput(defaultDate));
  const [time, setTime] = useState("11:00");
  const [duration, setDuration] = useState("45");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return setError("Give the bidding room a title.");
    if (!Number(quantity) || Number(quantity) <= 0) return setError("Enter a valid volume.");
    if (!Number(reservePrice) || Number(reservePrice) <= 0) return setError("Enter a reserve price for vendors to bid under.");

    const scheduledStart = new Date(`${date}T${time}`);
    if (Number.isNaN(scheduledStart.getTime())) return setError("Pick a valid date and time.");

    demoState.scheduleBiddingSession({
      title: title.trim(),
      quantity: Number(quantity),
      unit,
      reservePrice: Number(reservePrice),
      scheduledStart: scheduledStart.toISOString(),
      durationMinutes: Number(duration),
    });
    onScheduled(scheduledStart);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50" onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, x: "-50%", y: "-50%" }}
        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
        exit={{ opacity: 0, scale: 0.96, x: "-50%", y: "-50%" }}
        className="fixed top-1/2 left-1/2 w-[94vw] max-w-lg max-h-[88vh] bg-white rounded-3xl shadow-2xl z-[51] overflow-hidden flex flex-col"
      >
        <div className="px-6 py-5 bg-navy text-white flex items-center justify-between shrink-0">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">New Bidding Room</div>
            <h2 className="text-lg font-bold">Schedule a live auction</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <Field label="Requirement Title">
            <input
              value={title} onChange={(e) => { setTitle(e.target.value); setError(""); }}
              placeholder="e.g. 200 Standing Desks"
              className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm font-bold"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Volume">
              <input
                type="number" value={quantity} onChange={(e) => { setQuantity(e.target.value); setError(""); }}
                className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm font-bold"
              />
            </Field>
            <Field label="Unit">
              <select
                value={unit} onChange={(e) => setUnit(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm font-bold"
              >
                <option value="units">units</option>
                <option value="racks">racks</option>
                <option value="pallets">pallets</option>
                <option value="licenses">licenses</option>
              </select>
            </Field>
          </div>

          <Field label="Reserve Price (bids must come under this)">
            <input
              type="number" value={reservePrice} onChange={(e) => { setReservePrice(e.target.value); setError(""); }}
              placeholder="94000"
              className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm font-bold"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date">
              <input
                type="date" value={date} onChange={(e) => { setDate(e.target.value); setError(""); }}
                className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm font-bold"
              />
            </Field>
            <Field label="Start Time">
              <input
                type="time" value={time} onChange={(e) => { setTime(e.target.value); setError(""); }}
                className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm font-bold"
              />
            </Field>
          </div>

          <Field label="Duration">
            <select
              value={duration} onChange={(e) => setDuration(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm font-bold"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </Field>

          {error && <p className="text-xs font-bold text-coral">{error}</p>}
        </div>

        <div className="p-6 border-t border-navy/5 flex gap-3 shrink-0">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-xl font-bold text-navy/60 hover:bg-navy/5 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-[2] py-3.5 rounded-xl font-bold text-white bg-navy hover:bg-navy/90 shadow-lg shadow-navy/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CalendarIcon className="w-4 h-4" /> Schedule Room
          </button>
        </div>
      </motion.div>
    </>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-3.5 h-3.5 text-lime shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">{label}</div>
        <div className="font-medium text-white break-words">{value}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-navy/50 uppercase tracking-widest mb-2">{label}</label>
      {children}
    </div>
  );
}
