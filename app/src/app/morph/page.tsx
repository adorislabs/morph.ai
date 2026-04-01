import { Suspense } from "react";
import MorphClient from "./MorphClient";

export default function MorphRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF5C28] flex items-center justify-center text-white font-bold">
            m
          </div>
          <p className="text-gray-500">Loading morph.ai...</p>
        </div>
      }
    >
      <MorphClient />
    </Suspense>
  );
}
