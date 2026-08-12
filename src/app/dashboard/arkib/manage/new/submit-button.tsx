"use client";

import { useFormStatus } from "react-dom";
import { Loader2, UploadCloud } from "lucide-react";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Memuat naik...
        </>
      ) : (
        <>
          <UploadCloud className="w-5 h-5" />
          Muat Naik Pekeliling
        </>
      )}
    </button>
  );
}
