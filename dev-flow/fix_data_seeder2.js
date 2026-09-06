const fs = require('fs');

let content = fs.readFileSync('../backend/src/main/java/com/devflow/backend/config/DataSeeder.java', 'utf8');

const oldBuilder = /\.basePrice\(\(Double\) d\[3\]\)\n\s*\.active\(\(Boolean\) d\[4\]\)\n\s*\.imageUrl\(img\)/;
const newBuilder = `.basePrice((Double) d[3])
                .originalPrice(((Double) d[3]) * 1.25) // 25% higher
                .sellingPrice((Double) d[3])
                .active((Boolean) d[4])
                .imageUrl(img)`;

content = content.replace(oldBuilder, newBuilder);

fs.writeFileSync('../backend/src/main/java/com/devflow/backend/config/DataSeeder.java', content);
