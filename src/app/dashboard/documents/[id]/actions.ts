"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function checkStatusTransition(documentId: bigint) {
  const doc = await db.document.findUnique({ where: { id: documentId } });
  if (!doc) return;

  if (doc.status === "pending_review" && doc.reviewPpkp && doc.reviewPptk) {
    await db.document.update({
      where: { id: documentId },
      data: { status: "ready_for_assignment" },
    });
  }
}

export async function signOffReview(documentIdStr: string, roleType: "ppkp" | "pptk", catatan?: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };
  
  const documentId = BigInt(documentIdStr);

  try {
    const dataToUpdate = roleType === "ppkp" 
      ? { reviewPpkp: true, reviewPpkpAt: new Date(), catatanPpkp: catatan || null }
      : { reviewPptk: true, reviewPptkAt: new Date(), catatanPptk: catatan || null };

    await db.document.update({
      where: { id: documentId },
      data: dataToUpdate,
    });

    await checkStatusTransition(documentId);
    
    revalidatePath(`/dashboard/documents/${documentIdStr}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update review status" };
  }
}

export async function assignDocument(documentIdStr: string, staffIdStr: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "ppkp" && session.user.role !== "pptk")) {
    return { error: "Unauthorized to assign documents" };
  }

  try {
    await db.document.update({
      where: { id: BigInt(documentIdStr) },
      data: {
        assignedToUserId: BigInt(staffIdStr),
        status: "in_progress",
      },
    });

    revalidatePath(`/dashboard/documents/${documentIdStr}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to assign document" };
  }
}

export async function submitProcurementUpdate(
  prevState: any,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "staff") {
    return { error: "Only staff can submit updates." };
  }

  const documentIdStr = formData.get("documentId") as string;
  const noPesananKerajaan = formData.get("noPesananKerajaan") as string;
  const namaPembekal = formData.get("namaPembekal") as string;
  const amaunStr = formData.get("amaun") as string;
  const noInvois = formData.get("noInvois") as string;
  const tarikhHantarAkaunStr = formData.get("tarikhHantarAkaun") as string;
  const catatan = formData.get("catatan") as string;

  if (!documentIdStr) return { error: "Missing document ID." };

  // Extract metadata fields
  const metadata: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("meta_") && typeof value === "string" && value.trim() !== "") {
      const cleanKey = key.replace("meta_", "");
      metadata[cleanKey] = value;
    }
  }

  try {
    await db.procurementUpdate.create({
      data: {
        documentId: BigInt(documentIdStr),
        noPesananKerajaan: noPesananKerajaan || null,
        namaPembekal: namaPembekal || null,
        amaun: amaunStr ? parseFloat(amaunStr) : null,
        noInvois: noInvois || null,
        tarikhHantarAkaun: tarikhHantarAkaunStr ? new Date(tarikhHantarAkaunStr) : null,
        catatan: catatan || null,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        updatedByUserId: BigInt(session.user.id),
      },
    });

    // Close the document
    await db.document.update({
      where: { id: BigInt(documentIdStr) },
      data: { status: "closed" },
    });

  } catch (error) {
    console.error(error);
    return { error: "Database error occurred while submitting update." };
  }

  revalidatePath(`/dashboard/documents/${documentIdStr}`);
  return { success: true, message: "File successfully closed!" };
}
