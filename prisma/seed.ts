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

  const latinAmericanCountries = [
    "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba", "Ecuador", "El Salvador", "Guatemala",
    "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "República Dominicana", "Uruguay", "Venezuela"
  ];

  const countries = new Map<string, string>();
  for (const countryName of latinAmericanCountries) {
    const country = await prisma.country.upsert({
      where: { name: countryName },
      update: {},
      create: { name: countryName }
    });
    countries.set(countryName, country.id);
  }

  const argentinaId = countries.get("Argentina");
  if (!argentinaId) throw new Error("No se pudo crear Argentina en el seed");

  const argentinaMainCities = ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "San Miguel de Tucumán", "Mar del Plata", "Salta"];
  for (const cityName of argentinaMainCities) {
    await prisma.city.upsert({
      where: { countryId_name: { countryId: argentinaId, name: cityName } },
      update: {},
      create: { name: cityName, countryId: argentinaId }
    });
  }

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

  console.log("Seed listo:", { user, countries: latinAmericanCountries.length, argentinaMainCities, sport: tenis.name, categories });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
