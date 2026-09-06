with open("src/main/java/com/devflow/backend/config/DataSeeder.java", "r") as f:
    code = f.read()

code = code.replace(".sellerId(vendors.get(i % vendors.size()).getId())", ".sellerId(String.valueOf(vendors.get(i % vendors.size()).getId()))")
code = code.replace(".productId(p.getId())", ".productId(String.valueOf(p.getId()))")

with open("src/main/java/com/devflow/backend/config/DataSeeder.java", "w") as f:
    f.write(code)

