import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/images/logo.svg"
        alt={`${APP_NAME} logo`}
        width={48}
        height={48}
        priority
      />
      <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-3">Not Found ❗❗❗</h1>
        <p className="text-destructive">
          Sorry, the requested page is not found.
        </p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
