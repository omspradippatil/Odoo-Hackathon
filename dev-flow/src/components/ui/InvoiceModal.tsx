"use client";

import React, { useRef } from "react";
import { X, Download, Printer } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";

import { exportToExcel } from "@/lib/exportUtils";
import { AakalanBrand } from "@/components/brand/AakalanBrand";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ isOpen, onClose }: InvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadExcel = () => {
    const headers = [
      "Invoice Number", "Date", "Due Date", "Billed To", "Customer GSTIN",
      "Seller", "Seller GSTIN", "Deal Reference", "Quotation", "Place of Supply",
      "Item Description", "Qty", "Unit Price (INR)", "Taxable Value (INR)",
      "CGST (9%)", "SGST (9%)", "Total Amount (INR)"
    ];
    const rows: (string | number)[][] = [
      [
        "INV-2048-01",
        "14 Aug 2026",
        "28 Aug 2026",
        "Nova Retail Ltd.",
        "27AADCB2230M1Z2",
        "Vertex Systems",
        "27AABCV1234N1Z5",
        "DF-2048",
        "QT-2048",
        "27 (Maharashtra)",
        "Dell Latitude 5450 Enterprise Laptop (16GB RAM, 512GB SSD)",
        50,
        16800,
        840000,
        75600,
        75600,
        991200
      ]
    ];
    exportToExcel("Aakalan360-INV-2048-01.xlsx", "Tax Invoice", headers, rows);
  };

  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    
    // Dynamically import to avoid SSR issues
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL("image/png");
    
    // A4 size: 210 x 297 mm
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Aakalan360-INV-2048-01.pdf");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[800px] bg-warm rounded-2xl shadow-2xl z-[101] flex flex-col overflow-hidden"
          >
            {/* Header Toolbar */}
            <div className="bg-navy p-4 flex justify-between items-center text-white shrink-0">
              <div className="font-bold text-sm tracking-widest uppercase">Invoice Preview</div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleDownloadExcel}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Download XLSX Spreadsheet"
                >
                  <Download className="w-3.5 h-3.5" /> XLSX
                </button>
                <button 
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-cobalt hover:bg-cobalt/90 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-neutral-200 flex justify-center no-scrollbar">
              
              {/* Actual A4 Page Style */}
              <div 
                ref={invoiceRef}
                className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-sm p-8 md:p-12 text-navy text-sm font-medium"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                
                {/* Header Section */}
                <div className="flex justify-between items-start border-b-2 border-navy/10 pb-6 mb-8">
                  <div>
                    <AakalanBrand size="md" className="mb-2" />
                    <div className="text-xs text-navy/60 font-bold uppercase tracking-widest">Tax Invoice</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-navy">INV-2048-01</div>
                    <div className="text-xs text-navy/60 mt-1">Date: 14 Aug 2026</div>
                    <div className="text-xs text-navy/60">Due Date: 28 Aug 2026</div>
                    <div className="text-[10px] font-bold text-lime-700 bg-lime/10 inline-block px-2 py-0.5 rounded uppercase mt-2">Partially Paid</div>
                  </div>
                </div>

                {/* Billing Details */}
                <div className="flex justify-between mb-10 gap-8">
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Billed To</div>
                    <div className="font-bold text-base mb-1">Nova Retail Ltd.</div>
                    <div className="text-navy/70 leading-relaxed text-sm">
                      124 Business Park, Sector 4<br/>
                      Navi Mumbai, Maharashtra 400705<br/>
                      GSTIN: 27AADCB2230M1Z2
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Seller / Entity</div>
                    <div className="font-bold text-base mb-1">Vertex Systems</div>
                    <div className="text-navy/70 leading-relaxed text-sm">
                      Andheri East Tech Hub<br/>
                      Mumbai, Maharashtra 400069<br/>
                      GSTIN: 27AABCV1234N1Z5
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Deal Reference</div>
                    <div className="font-bold text-sm">DF-2048</div>
                    <div className="text-xs text-navy/60 mt-1">Quotation: QT-2048</div>
                    <div className="text-xs text-navy/60">Place of Supply: 27 (Maharashtra)</div>
                  </div>
                </div>

                {/* Line Items */}
                <table className="w-full text-left mb-8">
                  <thead>
                    <tr className="border-b-2 border-navy">
                      <th className="py-3 text-[10px] font-bold uppercase tracking-widest text-navy/60">Description</th>
                      <th className="py-3 text-[10px] font-bold uppercase tracking-widest text-navy/60 text-right">Qty</th>
                      <th className="py-3 text-[10px] font-bold uppercase tracking-widest text-navy/60 text-right">Unit Price</th>
                      <th className="py-3 text-[10px] font-bold uppercase tracking-widest text-navy/60 text-right">Taxable Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-navy/10">
                      <td className="py-4">
                        <div className="font-bold text-navy">Dell Latitude 5450 Enterprise Laptop</div>
                        <div className="text-xs text-navy/60 mt-0.5">16GB RAM, 512GB SSD - One-Time Hardware</div>
                      </td>
                      <td className="py-4 text-right">50</td>
                      <td className="py-4 text-right">₹16,800</td>
                      <td className="py-4 text-right font-bold">₹8,40,000</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="py-4">
                        <div className="text-xs font-bold text-navy/60 flex items-center gap-2">
                          <span className="w-2 h-2 bg-cobalt rounded-full"></span> 
                          Note: Recurring Software Subscription (₹55,000/mo) is billed separately.
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                  <div className="w-full max-w-[320px] space-y-3">
                    <div className="flex justify-between items-center text-navy/70">
                      <span>Total Taxable Value</span>
                      <span className="font-bold">₹8,40,000</span>
                    </div>
                    <div className="flex justify-between items-center text-navy/70">
                      <span>CGST @ 9%</span>
                      <span>₹75,600</span>
                    </div>
                    <div className="flex justify-between items-center text-navy/70 pb-3 border-b border-navy/10">
                      <span>SGST @ 9%</span>
                      <span>₹75,600</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-lg font-black text-navy py-2">
                      <span>Invoice Total</span>
                      <span>₹9,91,200</span>
                    </div>

                    <div className="flex justify-between items-center text-lime-700 font-bold bg-lime/10 px-3 py-2 rounded-lg">
                      <span>Less: Advance Payment</span>
                      <span>- ₹2,52,000</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-orange-600 font-bold bg-orange-50 px-3 py-2 border border-orange-100 rounded-lg mt-2">
                      <span>Outstanding Balance</span>
                      <span>₹7,39,200</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-navy/10 pt-6 mt-auto">
                  <h4 className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Terms & Conditions</h4>
                  <p className="text-[10px] text-navy/60 leading-relaxed max-w-xl">
                    1. Payment is due within 14 days of invoice date unless otherwise specified in QT-2048.<br/>
                    2. Please make all checks payable to Aakalan360 Settlement Account.<br/>
                    3. For billing inquiries, contact billing@aakalan360.com.
                  </p>
                  
                  <div className="mt-8 text-center text-[10px] font-bold text-navy/30 uppercase tracking-widest">
                    Generated securely by Aakalan360
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
