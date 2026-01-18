import { Main } from "@/components/main";
import { Suspense } from "react";

function MainFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse text-muted-foreground">Cargando...</div>
    </div>
  );
}

export default async function Page() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Suspense fallback={<MainFallback />}>
        <Main />
      </Suspense>
    </div>
  );
}
