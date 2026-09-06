const fs = require('fs');

let content = fs.readFileSync('../backend/src/main/java/com/devflow/backend/config/DataSeeder.java', 'utf8');

const replacement = `
        for (Object[] d : data) {
            String cat = (String) d[1];
            String img = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80";
            if (cat.contains("Electrical")) {
                img = "https://images.unsplash.com/photo-1611074312686-eeb32a58d3d9?w=800&q=80";
            } else if (cat.contains("Tooling")) {
                img = "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80";
            }
            list.add(Product.builder()
                .name((String) d[0])
                .category((String) d[1])
                .brand((String) d[2])
                .basePrice((Double) d[3])
                .active((Boolean) d[4])
                .imageUrl(img)
                .sellerName("Vertex Industrial")
                .sellerId("VND-VTX-001")
                .city("Mumbai")
                .trustScore(94)
                .verificationStatus("VERIFIED")
                .stock(42)
                .build());
        }
`;

content = content.replace(
/        for \(Object\[\] d : data\) \{\s*list\.add\(Product\.builder\(\)\s*\.name\(\(String\) d\[0\]\)\s*\.category\(\(String\) d\[1\]\)\s*\.brand\(\(String\) d\[2\]\)\s*\.basePrice\(\(Double\) d\[3\]\)\s*\.active\(\(Boolean\) d\[4\]\)\s*\.build\(\)\);\s*\}/, 
replacement
);

fs.writeFileSync('../backend/src/main/java/com/devflow/backend/config/DataSeeder.java', content);
