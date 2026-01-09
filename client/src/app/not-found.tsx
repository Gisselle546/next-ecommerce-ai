import Link from "next/link";
import { Button, Container } from "@/components/ui";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Container className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Page not found
        </h2>
        <p className="mt-2 text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild>
            <Link href={ROUTES.HOME}>Go home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.PRODUCTS}>Browse products</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
