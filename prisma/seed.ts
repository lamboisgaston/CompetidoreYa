import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@competidoreya.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "Admin12345!";
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: Role.SUPER_ADMIN },
    create: { email, passwordHash, role: Role.SUPER_ADMIN },
    select: { id: true, email: true, role: true, createdAt: true }
  });

  const salta = await prisma.city.upsert({
    where: { name: "Salta" },
    update: {},
    create: { name: "Salta" }
  });

  const tenis = await prisma.sport.upsert({
    where: { name: "Tenis" },
    update: {},
    create: { name: "Tenis" }
  });

  const categories = ["Primera", "Segunda", "Tercera", "Cuarta", "Quinta", "Dobles"];

  for (const name of categories) {
    await prisma.sportCategory.upsert({
      where: { sportId_name: { sportId: tenis.id, name } },
      update: {},
      create: { sportId: tenis.id, name }
    });
  }

  console.log("Seed listo:", { user, city: salta.name, sport: tenis.name, categories });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
