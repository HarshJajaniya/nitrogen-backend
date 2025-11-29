import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prisma 7 adapter
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) =>
    path.basename(fileName, path.extname(fileName))
  );

  for (const modelName of modelNames) {
    const model = (prisma as any)[modelName];
    if (!model) {
      console.warn(`⚠️ Model ${modelName} does not exist in Prisma Client.`);
      continue;
    }
    await model.deleteMany({});
    console.log(`🧹 Cleared ${modelName}`);
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "Team.json",
    "Project.json",
    "ProjectTeam.json",
    "User.json",
    "Task.json",
    "Attachment.json",
    "Comment.json",
    "TaskAssignment.json",
  ];

  await deleteAllData(orderedFileNames);

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model = (prisma as any)[modelName];

    if (!model) {
      console.warn(`⚠️ Model ${modelName} does not exist in Prisma Client.`);
      continue;
    }

    for (const data of jsonData) {
      await model.create({ data });
    }

    console.log(`🌱 Seeded ${modelName}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
