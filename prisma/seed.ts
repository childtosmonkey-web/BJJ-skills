import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "ガード", slug: "guard", color: "#3b82f6", description: "各種ガードポジションの技術" },
  { name: "スイープ", slug: "sweep", color: "#f97316", description: "ガードからのスイープ技術" },
  { name: "パス", slug: "pass", color: "#a855f7", description: "ガードパスの技術" },
  { name: "サブミッション", slug: "submission", color: "#ef4444", description: "関節技・絞め技" },
  { name: "テイクダウン", slug: "takedown", color: "#22c55e", description: "スタンドからのテイクダウン" },
  { name: "エスケープ", slug: "escape", color: "#eab308", description: "劣勢ポジションからの脱出" },
  { name: "バックテイク", slug: "back-take", color: "#d97706", description: "バックポジションへの移行" },
  { name: "その他", slug: "other", color: "#6b7280", description: "その他の技術・気づき" },
];

async function main() {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Seeded", categories.length, "categories");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
