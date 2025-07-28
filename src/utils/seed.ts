// npx prisma db seed
import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { PasswordService } from "./password";
import { parse } from "date-fns";

async function parseCsv(
  filePath: string
): Promise<Prisma.FruitsInventoryCreateManyInput[]> {
  const result: Prisma.FruitsInventoryCreateManyInput[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => result.push(data))
      .on("end", () => resolve(result))
      .on("error", reject);
  });
}

async function seedDB() {
  const filePath = path.resolve(__dirname, "../fruit.csv");
  const csvData: Record<string, any>[] = await parseCsv(filePath);

  const normalizedData = csvData.map((row) => {
    const normalizedRow: Record<string, any> = {};
    for (const key in row) {
      const cleanKey = key.replace(/^\uFEFF/, "");
      normalizedRow[cleanKey] = row[key];
    }
    return normalizedRow as Prisma.FruitsInventoryCreateManyInput;
  });

  const fruitInventory: Prisma.FruitsInventoryCreateManyInput[] =
    await Promise.all(
      normalizedData.map(async (fruit) => {
        const parseDate = parse(
          String(fruit.inventoryDate),
          "yyyy-MM-dd",
          new Date()
        );

        return {
          inventoryDate: parseDate,
          productName: fruit.productName,
          color: fruit.color,
          amount: +fruit.amount,
          unit: parseInt(String(fruit.unit), 10),
        };
      })
    );

  const hashedPassword: string = await PasswordService.hashPassword(
    process.env.PASSWORD!
  );

  const userData: Prisma.UserCreateManyInput[] = [
    { username: "test", email: "test@test.com", password: hashedPassword },
    { username: "test2", email: "test2@test.com", password: hashedPassword },
  ];

  await prisma.user.deleteMany(); // Remove all users first

  await prisma.user.createMany({
    data: userData,
  });

  await prisma.fruitsInventory.createMany({
    data: fruitInventory,
  });

  console.log("✅ Database seeded.");
}

seedDB()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
