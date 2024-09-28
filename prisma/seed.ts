const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();

async function main() {
  // Check if admin user already exists to ensure script runs only once
  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (adminExists) {
    console.log("Admin already exists, exiting...");
    return;
  }

  // Create admin user
  const hashedPassword =
    "$argon2id$v=19$m=65536,t=3,p=4$BZl0kZ2JMJJedkAZAjZYYg$9fwjBTreDTNLqBkfR0N3+sMPYf52ejQFCAGpPeZi3M0";
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      emailVerified: true,
    },
  });

  console.log("Admin user created");

  // Create 10 products
  const products = [];
  for (let i = 1; i <= 10; i++) {
    const product = await prisma.product.create({
      data: {
        name: `Product ${i}`,
        priceInCents: Math.floor(Math.random() * 10000) + 1000, // Random price between 1000 and 10000 cents
        filePath: `products/1d41b912-6878-41ac-8e6c-2b0a41f9b067-4114797-sd_426_240_25fps.mp4`,
        imagePath: `/seeded/product-${i}.jpg`,
        description: `This is the description for Product ${i}`,
      },
    });
    products.push(product);
  }

  console.log("10 products created");

  // Create 5 random discount codes
  const discountTypes = ["PERCENTAGE", "FIXED"];
  const discountCodes = [];
  for (let i = 1; i <= 5; i++) {
    const discountCode = await prisma.discountCode.create({
      data: {
        code: `DISCOUNT${i}`,
        discountAmount: Math.floor(Math.random() * 50) + 10, // Random discount between 10 and 50
        discountType: discountTypes[Math.floor(Math.random() * discountTypes.length)] as any,
        isActive: true,
        allProducts: Math.random() > 0.5,
        limit: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : null, // Random limit or no limit
      },
    });
    discountCodes.push(discountCode);
  }

  console.log("5 discount codes created");

  // Create 50 random users
  for (let i = 1; i <= 50; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password: hashedPassword,
        emailVerified: true,
      },
    });

    // Each user makes between 0 to 5 orders
    const orderCount = Math.floor(Math.random() * 6); // 0 to 5 orders
    for (let j = 1; j <= orderCount; j++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const useCoupon = Math.random() > 0.5; // 50% chance of using a coupon
      const randomDiscountCode = useCoupon ? discountCodes[Math.floor(Math.random() * discountCodes.length)] : null;
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const createdAt = new Date(oneYearAgo.getTime() + Math.random() * (new Date().getTime() - oneYearAgo.getTime()));
      await prisma.order.create({
        data: {
          pricePaidInCents: randomProduct.priceInCents - (randomDiscountCode ? randomDiscountCode.discountAmount : 0),
          userId: user.id,
          productId: randomProduct.id,
          discountCodeId: randomDiscountCode ? randomDiscountCode.id : null,
          createdAt,
        },
      });
    }
  }

  console.log("50 users created with random orders");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
