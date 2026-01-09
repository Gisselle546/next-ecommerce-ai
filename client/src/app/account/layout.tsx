import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/layout/sidebar";
import { Container } from "@/components/ui";

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8 md:py-12">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row">
            <Sidebar />
            <div className="flex-1">{children}</div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
