"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function uploadArkibDocument(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const reference = formData.get("reference") as string;
  const publishDateStr = formData.get("publishDate") as string;
  const file = formData.get("file") as File;

  if (!title || !reference || !publishDateStr || !file || file.size === 0) {
    throw new Error("Missing required fields or empty file");
  }

  // Read file data
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate safe filename
  const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
  
  // Ensure directory exists
  const uploadDir = join(process.cwd(), "public", "uploads", "pekeliling");
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (e) {
    // Ignore if exists
  }

  const filePath = join(uploadDir, safeFilename);
  await writeFile(filePath, buffer);

  const fileUrl = `/uploads/pekeliling/${safeFilename}`;

  // Insert into DB
  await db.arkibDocument.create({
    data: {
      title,
      reference,
      publishDate: new Date(publishDateStr),
      fileUrl,
      uploadedByUserId: BigInt(session.user.id),
    }
  });

  revalidatePath("/dashboard/arkib");
  revalidatePath("/dashboard/arkib/manage");

  redirect("/dashboard/arkib/manage");
}
