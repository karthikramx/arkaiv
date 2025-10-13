"use client";

import { PixelImage } from "@/components/ui/shadcn-io/pixel-image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const route = useRouter();
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-1 items-center justify-center">
        <section className="container flex flex-col gap-8 text-center lg:items-center lg:gap-8 mt-[-350px]">
          <div className="flex flex-1 flex-col items-center gap-4 text-center lg:gap-8">
            <div>
              <h1 className="text-4xl font-bold lg:text-6xl">Meet Arkaiv</h1>
              <h2 className="text-lg font-light text-muted-foreground lg:text-3xl">
                Your intelligent vault for every document.
              </h2>
            </div>
            <Button
              onClick={() => {
                route.push("/signup");
              }}
            >
              Get started
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <PixelImage
              src="https://imageio.forbes.com/specials-images/imageserve/923561924/digital-library-covid-19/960x0.jpg?format=jpg&width=960"
              grid="6x4"
            />
          </div>
          {/* <div className="flex items-center justify-center">
            <p>
              Arkaiv is a secure digital workspace that lets individuals and
              businesses store, organize, and intelligently manage all their
              important documents in one place. From identity proofs to bank
              statements, Arkaiv uses AI-powered categorization to ensure your
              files are always where you need them, when you need them.
            </p>
          </div> */}
        </section>
      </main>

      {/* Footer (fixed at bottom) */}
      <footer className="fixed bottom-0 left-0 w-full bg-transparent py-3">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400 px-6">
          <p>© {new Date().getFullYear()} Arkaiv. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span className="text-red-600">🇮🇳</span> Made in India
          </p>
        </div>
      </footer>
    </div>
  );
}
