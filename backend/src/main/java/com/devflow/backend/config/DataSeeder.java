package com.devflow.backend.config;

import com.devflow.backend.inventory.Inventory;
import com.devflow.backend.inventory.InventoryRepository;
import com.devflow.backend.product.Product;
import com.devflow.backend.product.ProductRepository;
import com.devflow.backend.vendor.Vendor;
import com.devflow.backend.vendor.VendorRepository;
import com.devflow.backend.warehouse.Warehouse;
import com.devflow.backend.warehouse.WarehouseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final VendorRepository vendorRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    public DataSeeder(VendorRepository vendorRepository,
                      WarehouseRepository warehouseRepository,
                      ProductRepository productRepository,
                      InventoryRepository inventoryRepository) {
        this.vendorRepository = vendorRepository;
        this.warehouseRepository = warehouseRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (inventoryRepository.count() >= 500) {
            log.info("Database already seeded with {} inventory items.", inventoryRepository.count());
            return;
        }

        log.info("Seeding realistic procurement and inventory data into MySQL...");

        // 1. Seed Vendors (50 realistic B2B companies)
        List<Vendor> vendors = createVendors();
        vendors = vendorRepository.saveAll(vendors);
        log.info("Saved {} vendors.", vendors.size());

        // 2. Seed Warehouses (85 industrial warehouses linked to vendors)
        List<Warehouse> warehouses = createWarehouses(vendors);
        warehouses = warehouseRepository.saveAll(warehouses);
        log.info("Saved {} warehouses.", warehouses.size());

        // 3. Seed Products (130 industrial and commercial items)
        List<Product> products = createProducts();
        products = productRepository.saveAll(products);
        log.info("Saved {} products.", products.size());

        // 4. Seed Inventory (500 unique warehouse-product pairings)
        List<Inventory> inventoryList = createInventory(warehouses, products, 500);
        inventoryRepository.saveAll(inventoryList);
        log.info("Successfully seeded {} inventory stock records.", inventoryList.size());
    }

    private List<Vendor> createVendors() {
        List<Vendor> list = new ArrayList<>();
        Object[][] vendorData = {
            {"Tata Steel Industrial Supplies Ltd", "Jamshedpur", "Jharkhand", 4.9, 96, "Gold", true},
            {"Larsen & Toubro Heavy Equipment", "Mumbai", "Maharashtra", 4.8, 95, "Gold", true},
            {"Bharat Heavy Electricals (BHEL)", "Bhopal", "Madhya Pradesh", 4.7, 92, "Gold", true},
            {"Siemens Industrial Automation India", "Bengaluru", "Karnataka", 4.9, 98, "Gold", true},
            {"Schneider Electric Infrastructure", "Gurugram", "Haryana", 4.8, 94, "Gold", true},
            {"Havells Industrial Power Systems", "Noida", "Uttar Pradesh", 4.6, 89, "Gold", true},
            {"Bosch Rexroth Hydraulics & Drive", "Ahmedabad", "Gujarat", 4.8, 95, "Gold", true},
            {"ABB Power & Robotics India", "Bengaluru", "Karnataka", 4.9, 97, "Gold", true},
            {"SKF Bearings & Lubrication Solutions", "Pune", "Maharashtra", 4.7, 93, "Gold", true},
            {"Festo Pneumatics & Automation Corp", "Chennai", "Tamil Nadu", 4.8, 92, "Gold", true},
            {"Kirloskar Brothers Pumps & Engines", "Pune", "Maharashtra", 4.5, 87, "Gold", true},
            {"Godrej Material Handling Solutions", "Mumbai", "Maharashtra", 4.6, 90, "Gold", true},
            {"Jindal Stainless Steel Stockists", "Hisar", "Haryana", 4.5, 86, "Gold", true},
            {"Hindustan Zinc Smelting & Alloys", "Udaipur", "Rajasthan", 4.4, 85, "Gold", true},
            {"3M Industrial Safety & Adhesives", "Bengaluru", "Karnataka", 4.8, 94, "Gold", true},
            {"Honeywell Process & Safety Systems", "Hyderabad", "Telangana", 4.7, 93, "Gold", true},
            {"Omron Automation & Sensor India", "Gurugram", "Haryana", 4.6, 88, "Gold", true},
            {"Mitutoyo Precision Instruments", "New Delhi", "Delhi", 4.8, 95, "Gold", true},
            {"Polycab Industrial Wires & Cables", "Vadodara", "Gujarat", 4.5, 87, "Gold", true},
            {"Finolex Industrial Cables Ltd", "Pune", "Maharashtra", 4.4, 84, "Silver", true},
            {"Apex Industrial Tools & Hardware", "Rajkot", "Gujarat", 4.2, 79, "Silver", true},
            {"Zenith Precision Fasteners Corp", "Ludhiana", "Punjab", 4.1, 76, "Silver", true},
            {"Delta Electronics & Drives India", "Gurugram", "Haryana", 4.5, 88, "Gold", true},
            {"Karam Safety Equipment & PPE", "Lucknow", "Uttar Pradesh", 4.3, 81, "Silver", true},
            {"Ansell Protective Solutions India", "Bengaluru", "Karnataka", 4.4, 83, "Silver", true},
            {"Danfoss Power Solutions India", "Chennai", "Tamil Nadu", 4.6, 90, "Gold", true},
            {"Eaton Power Distribution Ltd", "Pimpri", "Maharashtra", 4.5, 88, "Gold", true},
            {"Timken Industrial Bearings India", "Jamshedpur", "Jharkhand", 4.6, 89, "Gold", true},
            {"Wipro Hydraulics & Cylinders", "Bengaluru", "Karnataka", 4.4, 84, "Silver", true},
            {"Crompton Greaves Industrial Motors", "Mumbai", "Maharashtra", 4.3, 82, "Silver", true},
            {"Supreme Petrochem Industrial Plastic", "Mumbai", "Maharashtra", 4.2, 78, "Silver", true},
            {"Sintex Industrial Water & Chemical Tanks", "Kalol", "Gujarat", 4.0, 74, "Silver", true},
            {"Pidilite Industrial Adhesives & Sealants", "Mumbai", "Maharashtra", 4.6, 91, "Gold", true},
            {"Castrol Industrial Lubricants India", "Navi Mumbai", "Maharashtra", 4.5, 87, "Gold", true},
            {"V-Guard Commercial Electricals", "Kochi", "Kerala", 4.1, 77, "Silver", true},
            {"Legrand Electrical Busways & Panels", "Chennai", "Tamil Nadu", 4.6, 90, "Gold", true},
            {"Anchor by Panasonic Switchgear", "Thane", "Maharashtra", 4.2, 79, "Silver", true},
            {"Universal Fasteners & Anchor Bolts", "Faridabad", "Haryana", 3.9, 68, "Bronze", true},
            {"Surat Heavy Alloy & Casting Works", "Surat", "Gujarat", 4.0, 71, "Silver", true},
            {"Coimbatore Precision Spindles Ltd", "Coimbatore", "Tamil Nadu", 4.3, 82, "Silver", true},
            {"Jaipur Steel Fabrication Hub", "Jaipur", "Rajasthan", 3.8, 65, "Bronze", true},
            {"Indore Hydraulic Power Packs", "Indore", "Madhya Pradesh", 4.1, 75, "Silver", true},
            {"Nashik Precision Tooling & Dies", "Nashik", "Maharashtra", 4.2, 78, "Silver", true},
            {"Kanpur Leather Safety Boots Co", "Kanpur", "Uttar Pradesh", 3.9, 69, "Bronze", true},
            {"Nagpur Metal Extrusions Corp", "Nagpur", "Maharashtra", 4.0, 72, "Silver", true},
            {"Visakhapatnam Marine Hardware", "Visakhapatnam", "Andhra Pradesh", 4.2, 77, "Silver", true},
            {"Kolkata Heavy Machine Parts Trade", "Kolkata", "West Bengal", 3.7, 63, "Bronze", true},
            {"Aurangabad Automotive Component Spares", "Chhatrapati Sambhaji Nagar", "Maharashtra", 4.1, 74, "Silver", true},
            {"Belagavi Hydraulics & Machining", "Belagavi", "Karnataka", 4.0, 70, "Silver", true},
            {"Ghaziabad Pipe Fittings & Flanges", "Ghaziabad", "Uttar Pradesh", 3.8, 66, "Bronze", true}
        };

        for (Object[] d : vendorData) {
            list.add(Vendor.builder()
                .name((String) d[0])
                .city((String) d[1])
                .state((String) d[2])
                .rating((Double) d[3])
                .trustScore((Integer) d[4])
                .trustTier((String) d[5])
                .active((Boolean) d[6])
                .build());
        }
        return list;
    }

    private List<Warehouse> createWarehouses(List<Vendor> vendors) {
        List<Warehouse> list = new ArrayList<>();
        String[] hubs = {
            "Bhiwandi Central Logistics Hub", "Chakan Industrial Logistic Park", "Whitefield Supply Depot",
            "Sriperumbudur Mega Distribution Center", "Sanand Logistics Facility", "Manesar Auto & Electrical Depot",
            "Shamshabad Air Cargo Warehousing", "Dankuni Eastern Freight Terminal", "Pithampur Regional Storage",
            "Oragadam Heavy Parts Warehouse", "Peenya Industrial Stores Hub", "Talegaon MIDC Fulfillment Center",
            "Faridabad Industrial Logistics", "Changodar Express Hub", "Coimbatore Textile & Engineering Depot"
        };
        String[] hubCities = {
            "Thane", "Pune", "Bengaluru", "Chennai", "Ahmedabad", "Gurugram", "Hyderabad", "Kolkata", "Indore",
            "Kanchipuram", "Bengaluru", "Pune", "Faridabad", "Ahmedabad", "Coimbatore"
        };
        String[] hubStates = {
            "Maharashtra", "Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "Haryana", "Telangana", "West Bengal",
            "Madhya Pradesh", "Tamil Nadu", "Karnataka", "Maharashtra", "Haryana", "Gujarat", "Tamil Nadu"
        };

        int hubIdx = 0;
        for (int i = 0; i < vendors.size(); i++) {
            Vendor v = vendors.get(i);
            // 1st warehouse for each vendor
            int idx1 = hubIdx % hubs.length;
            list.add(Warehouse.builder()
                .name(v.getName().split(" ")[0] + " - " + hubs[idx1])
                .city(hubCities[idx1])
                .state(hubStates[idx1])
                .vendor(v)
                .build());
            hubIdx++;

            // Give some vendors a second warehouse (to get 85 total warehouses)
            if (i < 35) {
                int idx2 = (hubIdx + 3) % hubs.length;
                list.add(Warehouse.builder()
                    .name(v.getName().split(" ")[0] + " - " + hubs[idx2] + " Unit 2")
                    .city(hubCities[idx2])
                    .state(hubStates[idx2])
                    .vendor(v)
                    .build());
                hubIdx++;
            }
        }
        return list;
    }

    private List<Product> createProducts() {
        List<Product> list = new ArrayList<>();
        Object[][] data = {
            // Electrical & Power (20)
            {"Siemens 3-Phase Induction Motor 5.5kW 415V", "Electrical & Power", "Siemens", 34500.0, true},
            {"Schneider Electric EasyPact Molded Case Circuit Breaker 250A", "Electrical & Power", "Schneider Electric", 14200.0, true},
            {"ABB ACS380 Machinery Variable Frequency Drive 7.5kW", "Electrical & Power", "ABB", 42000.0, true},
            {"Havells Industrial MCB 63A 4-Pole C-Curve", "Electrical & Power", "Havells", 2150.0, true},
            {"Polycab 4-Core 16 sq mm Armored Copper Cable 100m Drum", "Electrical & Power", "Polycab", 38900.0, true},
            {"L&T Electrical Modular Contactor 40A 230V Coil", "Electrical & Power", "L&T Electrical", 2850.0, true},
            {"Finolex Submersible 3-Core Flat Cable 100m", "Electrical & Power", "Finolex", 12400.0, true},
            {"Legrand Cast Resin Dry Type Transformer 25kVA", "Electrical & Power", "Legrand", 185000.0, true},
            {"Eaton Surge Protection Device Type 1+2 40kA", "Electrical & Power", "Eaton", 6700.0, true},
            {"Delta 3-Phase Heavy Duty Online UPS 10kVA", "Electrical & Power", "Delta", 95000.0, true},
            {"Anchor Industrial Switchboard Panel IP65 12-Way", "Electrical & Power", "Anchor", 4800.0, true},
            {"Siemens Thermal Overload Relay 18-25A", "Electrical & Power", "Siemens", 3200.0, true},
            {"Schneider Acti9 RCBO 32A 30mA Type A", "Electrical & Power", "Schneider Electric", 3900.0, true},
            {"ABB Distribution Busbar Copper 400A 3m", "Electrical & Power", "ABB", 18500.0, true},
            {"Havells Phase Selector Switch 63A Cam Operated", "Electrical & Power", "Havells", 3100.0, true},
            {"Polycab Solar DC Cable 4 sq mm 500m Reel", "Electrical & Power", "Polycab", 29800.0, true},
            {"L&T Digital Multifunction Power Meter MFM384", "Electrical & Power", "L&T Electrical", 7800.0, true},
            {"Danfoss VLT Micro Drive FC 51 3.7kW", "Electrical & Power", "Danfoss", 26500.0, true},
            {"Kirloskar Single Phase Monoblock Pump 2HP", "Electrical & Power", "Kirloskar", 13200.0, true},
            {"Crompton Industrial Exhaust Fan 450mm 1400RPM", "Electrical & Power", "Crompton", 4650.0, true},

            // Mechanical & Power Transmission (20)
            {"SKF Deep Groove Ball Bearing 6205-2RSH/C3", "Mechanical & Transmission", "SKF", 385.0, true},
            {"SKF Spherical Roller Bearing 22215 EK", "Mechanical & Transmission", "SKF", 4200.0, true},
            {"Timken Tapered Roller Bearing Set 32008X", "Mechanical & Transmission", "Timken", 1850.0, true},
            {"Festo Heavy Duty Flange Bearing Unit UCF208", "Mechanical & Transmission", "Festo", 1150.0, true},
            {"Zenith Stainless Steel Roller Chain ANSI 50 10ft Box", "Mechanical & Transmission", "Zenith", 3400.0, true},
            {"Cast Iron 3-Groove SPA V-Belt Pulley 200mm", "Mechanical & Transmission", "Apex", 2900.0, true},
            {"Precision Hardened Ground Spur Gear Mod 2 30 Teeth", "Mechanical & Transmission", "Apex", 1450.0, true},
            {"Flexible Curved Jaw Coupling Rotex GR28 25mm Bore", "Mechanical & Transmission", "Apex", 2200.0, true},
            {"High Torque Worm Reduction Gearbox 1:30 Ratio Size 63", "Mechanical & Transmission", "L&T Heavy", 18700.0, true},
            {"Heavy Duty Cast Iron Pillow Block Bearing UCP205", "Mechanical & Transmission", "SKF", 850.0, true},
            {"Stainless Steel 316 Trapezoidal Lead Screw 20x4 1000mm", "Mechanical & Transmission", "Apex", 4100.0, true},
            {"Bronze Bushing Sleeve Bearing 25x32x35mm", "Mechanical & Transmission", "Apex", 340.0, true},
            {"Helical Bevel Inline Speed Reducer 1.5kW 50RPM", "Mechanical & Transmission", "Siemens", 32000.0, true},
            {"Timing Belt Pulley HTD 5M 36 Teeth 15mm Width", "Mechanical & Transmission", "Apex", 980.0, true},
            {"Linear Motion Ball Bushing Bearing LMK20UU", "Mechanical & Transmission", "SKF", 620.0, true},
            {"Stainless Steel Cam Follower Track Roller KR22", "Mechanical & Transmission", "Timken", 1280.0, true},
            {"Heavy Duty Universal Joint Propeller Shaft 500mm", "Mechanical & Transmission", "Apex", 6900.0, true},
            {"Precision Ground Steel Shafting CK45 25mm 1m", "Mechanical & Transmission", "Tata Steel", 1950.0, true},
            {"Industrial V-Belt High Power Wedge SPC 3000", "Mechanical & Transmission", "Zenith", 1100.0, true},
            {"Split Taper Bushing 2012 with 28mm Keyway", "Mechanical & Transmission", "Apex", 720.0, true},

            // Hydraulics & Pneumatics (20)
            {"Bosch Rexroth 4/3 Solenoid Directional Valve 24VDC CETOP 3", "Hydraulics & Pneumatics", "Bosch Rexroth", 16800.0, true},
            {"Bosch Rexroth Variable Displacement Axial Piston Pump A10VSO", "Hydraulics & Pneumatics", "Bosch Rexroth", 68000.0, true},
            {"Festo Compact Pneumatic Cylinder ADN 40x50mm Stroke", "Hydraulics & Pneumatics", "Festo", 4600.0, true},
            {"Festo 5/2 Single Solenoid Pneumatic Valve Tiger Classic 24V", "Hydraulics & Pneumatics", "Festo", 3400.0, true},
            {"Festo Air Filter Regulator Lubricator (FRL) Unit 1/2 Inch", "Hydraulics & Pneumatics", "Festo", 5800.0, true},
            {"High Pressure Hydraulic Hose 2-Wire 1/2 Inch 5000 PSI 10m", "Hydraulics & Pneumatics", "Danfoss", 6200.0, true},
            {"Wipro Double Acting Hydraulic Tie-Rod Cylinder 80x500mm", "Hydraulics & Pneumatics", "Wipro Hydraulics", 24500.0, true},
            {"Danfoss Hydraulic Gear Pump Group 2 14cc/rev Clockwise", "Hydraulics & Pneumatics", "Danfoss", 14900.0, true},
            {"Pneumatic Polyurethane Tubing Blue 8mm Outer Dia 100m", "Hydraulics & Pneumatics", "Festo", 2400.0, true},
            {"Hydraulic Direct-Acting Pressure Relief Valve Cartridge", "Hydraulics & Pneumatics", "Bosch Rexroth", 5400.0, true},
            {"Pneumatic Quick Exhaust Valve 1/4 Inch BSP", "Hydraulics & Pneumatics", "Festo", 890.0, true},
            {"Hydraulic Oil Filter Element Return Line 10 Micron", "Hydraulics & Pneumatics", "Bosch Rexroth", 2600.0, true},
            {"Castrol Hyspin AWH-M 46 Hydraulic Oil 208L Barrel", "Hydraulics & Pneumatics", "Castrol", 44000.0, true},
            {"Brass Quick Coupler Set Male & Female 3/8 Inch BSP", "Hydraulics & Pneumatics", "Apex", 650.0, true},
            {"Pneumatic Rotary Actuator 90 Degree Rack & Pinion", "Hydraulics & Pneumatics", "Festo", 9800.0, true},
            {"Hydraulic Stainless Steel Pressure Gauge 0-400 Bar Glycerin Filled", "Hydraulics & Pneumatics", "Bosch Rexroth", 1750.0, true},
            {"Pneumatic Foot Pedal Valve 5/2 Way Spring Return", "Hydraulics & Pneumatics", "Festo", 2100.0, true},
            {"Hydraulic Ball Valve 2-Way High Pressure 3/4 Inch", "Hydraulics & Pneumatics", "Apex", 2900.0, true},
            {"Pneumatic Magnetic Reed Sensor Switch for Cylinders", "Hydraulics & Pneumatics", "Festo", 850.0, true},
            {"Hydraulic Bladder Accumulator 10 Liter 330 Bar", "Hydraulics & Pneumatics", "Bosch Rexroth", 38000.0, true},

            // Automation, Sensors & Robotics (20)
            {"Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC Compact PLC", "Industrial Automation", "Siemens", 29500.0, true},
            {"Omron Inductive Proximity Sensor M12 Shielded PNP NO", "Industrial Automation", "Omron", 1450.0, true},
            {"Omron Photoelectric Sensor Retro-Reflective E3Z-R61 4m", "Industrial Automation", "Omron", 3100.0, true},
            {"Schneider Electric Altivar 320 Machine VFD 3kW", "Industrial Automation", "Schneider Electric", 22000.0, true},
            {"Delta 7-Inch Color HMI Touchscreen Display Panel DOP-107", "Industrial Automation", "Delta", 16800.0, true},
            {"Sick Optical Incremental Rotary Encoder 1024 PPR Shaft 8mm", "Industrial Automation", "Omron", 7900.0, true},
            {"Honeywell Digital Temperature PID Controller 1/16 DIN", "Industrial Automation", "Honeywell", 4500.0, true},
            {"Omron Solid State Relay 40A 24-480VAC with Heat Sink", "Industrial Automation", "Omron", 2200.0, true},
            {"Siemens Industrial Ethernet Switch SCALANCE XB005 5-Port", "Industrial Automation", "Siemens", 11200.0, true},
            {"ABB Robot Teach Pendant TPU-3 Replacement Cable 10m", "Industrial Automation", "ABB", 34000.0, true},
            {"Schneider Harmony Push Button Station 3-Way Yellow/Green/Red", "Industrial Automation", "Schneider Electric", 1850.0, true},
            {"Omron Fiber Optic Amplifier Unit Digital Dual Display", "Industrial Automation", "Omron", 6400.0, true},
            {"Honeywell Micro Switch Heavy Duty Limit Switch SPDT", "Industrial Automation", "Honeywell", 1250.0, true},
            {"Delta AC Servo Motor 750W 3000RPM with Drive Kit", "Industrial Automation", "Delta", 36000.0, true},
            {"Siemens SITOP Power Supply 24V DC 10A Stabilized", "Industrial Automation", "Siemens", 8900.0, true},
            {"Omron Safety Light Curtain Type 4 Hand Protection 600mm", "Industrial Automation", "Omron", 48000.0, true},
            {"ABB Smart Positioner for Control Valves 4-20mA HART", "Industrial Automation", "ABB", 42000.0, true},
            {"Schneider Electric Programmable Relay Zelio Logic 12 I/O", "Industrial Automation", "Schneider Electric", 9800.0, true},
            {"Honeywell Ultrasonic Distance Sensor 0.2-2m Analog Out", "Industrial Automation", "Honeywell", 13400.0, true},
            {"Sick Safety Interlock Emergency Stop Relay 24VDC", "Industrial Automation", "Omron", 5900.0, true},

            // Safety, PPE & Hardware (15)
            {"3M SecureFit Protective Safety Glasses Anti-Fog Clear", "Safety & PPE", "3M", 320.0, true},
            {"3M Half Facepiece Reusable Respirator 6200 with Particulate Filters", "Safety & PPE", "3M", 1850.0, true},
            {"Karam Full Body Fall Arrest Safety Harness with Shock Absorbing Lanyard", "Safety & PPE", "Karam", 2800.0, true},
            {"Honeywell High-Ankle Steel Toe Safety Work Boots Size 9", "Safety & PPE", "Honeywell", 3200.0, true},
            {"Ansell HyFlex Cut-Resistant Nitrile Coated Gloves Box of 12 Pairs", "Safety & PPE", "Ansell", 2650.0, true},
            {"Karam Safety Helmet HDPE with Ratchet Suspension Yellow", "Safety & PPE", "Karam", 480.0, true},
            {"3M Peltor Optime III Helmet-Attached Ear Muffs 35dB", "Safety & PPE", "3M", 2400.0, true},
            {"Heavy Duty Retractable Fall Arrester Block Steel Wire 10m", "Safety & PPE", "Karam", 11500.0, true},
            {"Fire Retardant Boiler Suit Coverall 100% Cotton 240 GSM Size L", "Safety & PPE", "Karam", 1950.0, true},
            {"Nitrile Chemical Resistant Long Gauntlet Gloves Pack of 10", "Safety & PPE", "Ansell", 1600.0, true},
            {"Industrial Safety Lockout Tagout (LOTO) Starter Kit Box", "Safety & PPE", "3M", 6800.0, true},
            {"First Aid Wall-Mounted Industrial Station 50 Persons Kit", "Safety & PPE", "3M", 3400.0, true},
            {"Automatic Darkening Welding Helmet Shade 9-13 Solar Powered", "Safety & PPE", "Honeywell", 4500.0, true},
            {"High Visibility Reflective Safety Vest Class 2 Pack of 20", "Safety & PPE", "Karam", 2200.0, true},
            {"Self-Contained Breathing Apparatus (SCBA) Carbon Composite 6.8L", "Safety & PPE", "Honeywell", 72000.0, true},

            // Raw Materials, Metals & Fasteners (20)
            {"Tata Steel Hot Rolled IS 2062 Grade Plate 12mm 2500x1250mm", "Raw Materials & Metals", "Tata Steel", 28500.0, true},
            {"Jindal Stainless Steel 304 Seamless Pipe 2-Inch Sch 40 6m", "Raw Materials & Metals", "Jindal Stainless", 8400.0, true},
            {"Jindal SS 316L Cold Rolled Plate 3mm 2000x1000mm", "Raw Materials & Metals", "Jindal Stainless", 16800.0, true},
            {"Hindustan Zinc High Grade SHG Zinc Ingot 25kg", "Raw Materials & Metals", "Hindustan Zinc", 7600.0, true},
            {"Aluminum Extrusion 6063-T6 40x40mm T-Slot Modular Profile 3m", "Raw Materials & Metals", "Apex", 2100.0, true},
            {"Brass Hexagonal Extruded Bar Grade CW614N 25mm 1m", "Raw Materials & Metals", "Apex", 1950.0, true},
            {"Copper Grounding Plate 600x600x3mm High Purity", "Raw Materials & Metals", "Polycab", 9400.0, true},
            {"Zenith Stainless Steel 304 Hex Bolt M12x50 Box of 100", "Raw Materials & Metals", "Zenith", 1850.0, true},
            {"High Tensile Grade 8.8 Metric Hex Nut M16 Box of 200", "Raw Materials & Metals", "Zenith", 1650.0, true},
            {"Drop-in Heavy Duty Wedge Anchor M16x150mm Zinc Plated Box of 50", "Raw Materials & Metals", "Zenith", 2700.0, true},
            {"Stainless Steel 316 Spring Washer M10 Pack of 500", "Raw Materials & Metals", "Zenith", 850.0, true},
            {"Tata Structural Steel Square Hollow Section 50x50x3mm 6m", "Raw Materials & Metals", "Tata Steel", 4200.0, true},
            {"Mild Steel Bright Round Bar EN1A Leaded 30mm 1m", "Raw Materials & Metals", "Tata Steel", 1450.0, true},
            {"Phosphor Bronze C54400 Solid Round Bar 40mm 500mm", "Raw Materials & Metals", "Apex", 4800.0, true},
            {"Nylon 6 Natural Engineering Cast Rod 50mm Dia 1m", "Raw Materials & Metals", "Supreme", 2600.0, true},
            {"Teflon PTFE Virgin White Sheet 5mm Thick 500x500mm", "Raw Materials & Metals", "Supreme", 3200.0, true},
            {"High Tensile Socket Head Cap Screws M8x30 Grade 12.9 Box of 200", "Raw Materials & Metals", "Zenith", 1400.0, true},
            {"Stainless Steel Blind Rivet 4.8x12mm Pack of 1000", "Raw Materials & Metals", "Zenith", 1150.0, true},
            {"Galvanized Wire Rope 7x19 Construction 10mm Dia 50m Coil", "Raw Materials & Metals", "Tata Steel", 6800.0, true},
            {"Perforated Stainless Steel 304 Sheet 2mm Hole 4mm Pitch 1x1m", "Raw Materials & Metals", "Jindal Stainless", 5900.0, true},

            // Tooling, Cutting & Metrology (15)
            {"Mitutoyo Digimatic Vernier Caliper 150mm / 0.01mm 500-196-30", "Tooling & Metrology", "Mitutoyo", 9400.0, true},
            {"Mitutoyo Outside Micrometer 0-25mm 0.001mm Carbide Tips", "Tooling & Metrology", "Mitutoyo", 5600.0, true},
            {"Solid Carbide 4-Flute End Mill 12mm TiAlN Coated HRC55", "Tooling & Metrology", "Apex", 2150.0, true},
            {"CNC Turning Toolholder Indexable External Shank 25x25mm", "Tooling & Metrology", "Apex", 2600.0, true},
            {"Carbide CNC Milling Inserts APMT1604PDER Box of 10", "Tooling & Metrology", "Apex", 1950.0, true},
            {"HSS-Cobalt 8% Morse Taper Shank Drill Bit 24mm MT3", "Tooling & Metrology", "Apex", 2800.0, true},
            {"Diamond Cutting Blade for Concrete & Granite 350mm 14-Inch", "Tooling & Metrology", "3M", 4200.0, true},
            {"3M Cubitron II Flap Disc 125mm Grit 60 Pack of 10", "Tooling & Metrology", "3M", 1850.0, true},
            {"Precision Granite Surface Plate Grade 0 400x400x100mm", "Tooling & Metrology", "Mitutoyo", 18500.0, true},
            {"Dial Test Indicator 0.8mm Range 0.01mm Graduation Mitutoyo", "Tooling & Metrology", "Mitutoyo", 6400.0, true},
            {"Hand Tap Set HSS M16x2.0 Taper / Second / Bottoming 3-Pcs", "Tooling & Metrology", "Apex", 1450.0, true},
            {"BIMETAL Hole Saw Kit 11-Piece Electrician Set 19-76mm", "Tooling & Metrology", "Apex", 3800.0, true},
            {"Digital Magnetic Bevel Box Angle Gauge Inclinometer", "Tooling & Metrology", "Mitutoyo", 3200.0, true},
            {"Pneumatic Air Die Grinder 1/4-Inch Collet 22000 RPM", "Tooling & Metrology", "Bosch Rexroth", 4900.0, true},
            {"Industrial Torque Wrench 1/2 Inch Drive 40-200 Nm Micrometer Click", "Tooling & Metrology", "Apex", 6200.0, true}
        };

        for (Object[] d : data) {
            list.add(Product.builder()
                .name((String) d[0])
                .category((String) d[1])
                .brand((String) d[2])
                .basePrice((Double) d[3])
                .active((Boolean) d[4])
                .build());
        }
        return list;
    }

    private List<Inventory> createInventory(List<Warehouse> warehouses, List<Product> products, int targetCount) {
        List<Inventory> list = new ArrayList<>();
        Random rng = new Random(42); // Deterministic seed for reproducible real data

        // Generate combinations ensuring uniqueness of (warehouse_id, product_id)
        Set<String> seen = new HashSet<>();
        int wIndex = 0;
        int pIndex = 0;

        while (list.size() < targetCount) {
            Warehouse wh = warehouses.get(wIndex % warehouses.size());
            Product prod = products.get(pIndex % products.size());

            String key = wh.getId() + "-" + prod.getId();
            if (!seen.contains(key)) {
                seen.add(key);

                // Realistic stock parameters
                int physical = 30 + rng.nextInt(650); // between 30 and 680 units
                int reserved = (int) Math.round(physical * (0.05 + rng.nextDouble() * 0.20)); // 5% to 25%
                int available = physical - reserved;

                // Realistic retail markup: 8% to 22% over base price
                double markup = 1.08 + (rng.nextDouble() * 0.14);
                double selling = Math.round(prod.getBasePrice() * markup * 100.0) / 100.0;

                list.add(Inventory.builder()
                    .warehouse(wh)
                    .product(prod)
                    .physicalStock(physical)
                    .reservedStock(reserved)
                    .availableStock(available)
                    .sellingPrice(selling)
                    .build());
            }

            // Stagger indices to distribute across all warehouses and products evenly
            pIndex = (pIndex + 1);
            if (pIndex % products.size() == 0) {
                wIndex++;
            }
        }
        return list;
    }
}
