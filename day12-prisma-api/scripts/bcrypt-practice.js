const bcrypt = require("bcrypt");

async function main() {
  const password = "Ali123456";

  // Same password ko do baar hash karna
  const hash1 = await bcrypt.hash(password, 12);
  const hash2 = await bcrypt.hash(password, 12);

  console.log("First Hash:", hash1);
  console.log("Second Hash:", hash2);

  console.log("Hashes are same:", hash1 === hash2);

  // Password verify karna
  const result = await bcrypt.compare(password, hash1);

  console.log("Password matched:", result);
}

main();