import re

with open("src/main/java/com/devflow/backend/config/DataSeeder.java", "r") as f:
    content = f.read()

# I will replace the content of run() method and add some new generation methods.
# But it might be easier to just overwrite the file entirely with a complete Java file.

