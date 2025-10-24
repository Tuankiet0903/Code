// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import faker from "faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  const userCount = await prisma.user.count();
  const categoryCount = await prisma.category.count();
  const productCount = await prisma.product.count();

  if (userCount === 0) {
    // Users: 100 (10 admins)
    const users = [];
    for (let i = 0; i < 100; i++) {
      const name = faker.name.findName();
      const email = `user${i}@example.com`;
      const pw = await bcrypt.hash("password123", 10);
      const role = i < 10 ? "ADMIN" : "CUSTOMER";
      users.push({ name, email, password: pw, role });
    }
    await prisma.user.createMany({ data: users });
    console.log("100 users created.");
  }

  if (categoryCount === 0) {
    // Categories: 100
    const categories = [];
    for (let i = 0; i < 100; i++) {
      categories.push({ name: `Category ${i + 1}` });
    }
    await prisma.category.createMany({ data: categories });
    console.log("100 categories created.");
  }

  if (productCount === 0) {
    // Fetch category ids
    const dbCats = await prisma.category.findMany({ select: { id: true } });

    // Products: 10,000 (batch inserts)
    const BATCH = 500;
    let created = 0;
    for (let batch = 0; batch < 10000 / BATCH; batch++) {
      const chunk = [];
      for (let i = 0; i < BATCH; i++) {
        const idx = batch * BATCH + i;
        const name = faker.commerce.productName() + ` ${idx}`;
        const description = faker.commerce.productDescription();
        const price = parseFloat(faker.commerce.price(1, 500, 2));
        const stock = faker.datatype.number({ min: 0, max: 200 });
        const cat =
          dbCats[faker.datatype.number({ min: 0, max: dbCats.length - 1 })];
        chunk.push({
          sku: `SKU-${idx}-${faker.datatype.number(9999)}`,
          name,
          description,
          price,
          stock,
          categoryId: cat.id,
        });
      }
      await prisma.product.createMany({ data: chunk });
      created += chunk.length;
      console.log(`Created ${created} products...`);
    }
  }
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
