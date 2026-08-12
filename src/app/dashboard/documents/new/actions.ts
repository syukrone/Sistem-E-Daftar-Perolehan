"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function submitDocument(
  prevState: any,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const tajuk = formData.get("tajuk") as string;
  const bahagianMemohon = formData.get("bahagianMemohon") as string;
  const noRujukanFail = formData.get("noRujukanFail") as string;
  const tarikhTerimaStr = formData.get("tarikhTerima") as string;
  const tarikhRujukanFailStr = formData.get("tarikhRujukanFail") as string;
  const rujukanPekeliling = (formData.get("rujukanPekeliling") as string) || null;
  const categoryIdStr = formData.get("categoryId") as string;

  if (!tajuk || !bahagianMemohon || !noRujukanFail || !tarikhTerimaStr || !categoryIdStr) {
    return { error: "Please fill in all required fields." };
  }

  try {
    await db.document.create({
      data: {
        tajuk,
        bahagianMemohon,
        noRujukanFail,
        rujukanPekeliling,
        tarikhTerima: new Date(tarikhTerimaStr),
        tarikhRujukanFail: tarikhRujukanFailStr ? new Date(tarikhRujukanFailStr) : null,
        categoryId: parseInt(categoryIdStr, 10),
        createdByUserId: BigInt(session.user.id),
        status: "pending_review",
      }
    });
  } catch (error) {
    console.error("Failed to create document", error);
    return { error: "An error occurred while saving the document." };
  }

  redirect("/dashboard/documents");
}
