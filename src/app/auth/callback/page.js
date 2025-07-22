import { Suspense } from "react";
import GoogleCallback from "./GoogleCallback";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <GoogleCallback />
    </Suspense>
  );
}