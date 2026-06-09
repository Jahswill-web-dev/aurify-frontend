import { Suspense } from "react";
import GoogleCallback from "./GoogleCallback";
import { LoadingExperience } from "@/components/ui";

export default function Page() {
  return (
    <Suspense
      fallback={
        <LoadingExperience
          title="Completing sign in"
          message="Securing your session and returning you to Aurify."
        />
      }
    >
      <GoogleCallback />
    </Suspense>
  );
}
