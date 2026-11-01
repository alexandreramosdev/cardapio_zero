import bcrypt from "bcryptjs";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();
const BCRYPT_COST = 10;
const MIN_PASSWORD_LENGTH = 8;

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD no .env antes de rodar o seed.",
    );
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `SEED_ADMIN_PASSWORD precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    );
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, name: "Administrador Demo", passwordHash },
  });

  const restaurant = await prisma.restaurant.upsert({
    where: { ownerId: admin.id },
    update: {},
    create: {
      name: "Hamburgueria Demo",
      slug: "demo",
      description:
        "Restaurante fictício criado apenas para demonstração do Cardápio Zero.",
      ownerId: admin.id,
    },
  });

  const category = await prisma.category.upsert({
    where: {
      restaurantId_name: {
        name: "Hambúrgueres",
        restaurantId: restaurant.id,
      },
    },
    update: {},
    create: {
      name: "Hambúrgueres",
      restaurantId: restaurant.id,
    },
  });

  const product = await prisma.product.upsert({
    where: {
      categoryId_name: {
        categoryId: category.id,
        name: "X-Burger Demo",
      },
    },
    update: {},
    create: {
      name: "X-Burger Demo",
      priceCents: 2500,
      categoryId: category.id,
      restaurantId: restaurant.id,
    },
  });

  console.log(
    `Seed concluído:\n- admin ${admin.email} + restaurante "${restaurant.name}" em /r/${restaurant.slug}\n- categoria "${category.name}" + produto "${product.name}"`,
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
