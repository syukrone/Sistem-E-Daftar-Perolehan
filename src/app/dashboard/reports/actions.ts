"use server";

import { db } from "@/lib/db";
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

export async function fetchReportData(filters: {
  timeframe: "bulanan" | "tahunan";
  month?: number;
  year: number;
  categoryId?: number;
  bahagian?: string;
}) {
  const { timeframe, month, year, categoryId, bahagian } = filters;

  let dateFilter = {};
  if (timeframe === "bulanan" && month !== undefined) {
    const targetDate = new Date(year, month, 1);
    dateFilter = {
      tarikhTerima: {
        gte: startOfMonth(targetDate),
        lte: endOfMonth(targetDate),
      },
    };
  } else if (timeframe === "tahunan") {
    const targetDate = new Date(year, 0, 1);
    dateFilter = {
      tarikhTerima: {
        gte: startOfYear(targetDate),
        lte: endOfYear(targetDate),
      },
    };
  }

  const categoryFilter = categoryId ? { categoryId } : {};
  const bahagianFilter = bahagian ? { bahagianMemohon: bahagian } : {};

  // Fetch only closed documents for reports, or maybe we want all?
  // Blueprint usually implies finalized data, so we'll use closed.
  const documents = await db.document.findMany({
    where: {
      status: "closed",
      ...dateFilter,
      ...categoryFilter,
      ...bahagianFilter,
    },
    include: {
      procurementUpdates: {
        orderBy: { createdAt: "desc" },
        take: 1, // Only get the latest update for the report
      },
    },
    orderBy: { tarikhTerima: "asc" },
  });

  return documents.map((doc, index) => {
    const update = doc.procurementUpdates[0] || null;
    return {
      bil: index + 1,
      namaSyarikat: update?.namaPembekal || "-",
      perkaraTajuk: doc.tajuk,
      amaun: update?.amaun ? Number(update.amaun) : 0,
      noPesananKerajaan: update?.noPesananKerajaan || "-",
      noInvois: update?.noInvois || "-",
      tarikhHantarAkaun: update?.tarikhHantarAkaun ? update.tarikhHantarAkaun.toISOString() : null,
      catatan: update?.catatan || "-",
      metadata: update?.metadata || null,
    };
  });
}
