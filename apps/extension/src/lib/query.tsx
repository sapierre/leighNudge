import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { toast } from "sonner";

export function QueryClientProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: (error: Error | { error: Error }) => {
              if ("error" in error) {
                error = error.error;
              }

              console.error(error);
              toast.error(error.message);
            },
          },
        },
      }),
  );

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {props.children}
      <ReactQueryDevtools />
    </TanstackQueryClientProvider>
  );
}
