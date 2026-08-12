import { db } from "@/lib/db";
import { ArkibClientPage } from "./client-page";
import { auth } from "@/auth";

export default async function ArkibPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  const documents = await db.arkibDocument.findMany({
    orderBy: { publishDate: "desc" },
  });

  return <ArkibClientPage initialDocuments={documents} isAdmin={isAdmin} />;
}
