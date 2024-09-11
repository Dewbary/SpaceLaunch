"use client";
// import Providers from "@/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Earth from "../components/earth";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ModeToggle } from "@/components/ModeToggle";

const queryClient = new QueryClient();

export default function Home() {
  return (
    // <Providers>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Earth />
      <div className="absolute top-10 right-10">
        <ModeToggle />
      </div>
    </QueryClientProvider>
    // </Providers>
  );
}
