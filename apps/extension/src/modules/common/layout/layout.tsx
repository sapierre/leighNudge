import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";

import { I18nProvider } from "@turbostarter/i18n";
import { ThemeMode, cn } from "@turbostarter/ui";

import "~/assets/styles/globals.css";
import { appConfig } from "~/config/app";
import { useLocale } from "~/lib/i18n";
import { QueryClientProvider } from "~/lib/query";
import { StorageKey, useStorage } from "~/lib/storage";
import { ErrorBoundary } from "~/modules/common/error-boundary";
import { Footer } from "~/modules/common/layout/footer";
import { Header } from "~/modules/common/layout/header";
import { Suspense } from "~/modules/common/suspense";
import { Toaster } from "~/modules/common/toast";

const I18n = ({ children }: { children: React.ReactNode }) => {
  const { data: locale, isLoading } = useLocale();

  useEffect(() => {
    if (locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  if (isLoading) return null;

  return (
    <I18nProvider locale={locale} defaultLocale={appConfig.locale}>
      {children}
    </I18nProvider>
  );
};

interface ProvidersProps {
  readonly children: React.ReactNode;
  readonly loadingFallback?: React.ReactNode;
  readonly errorFallback?: React.ReactNode;
}

const Providers = ({
  children,
  loadingFallback,
  errorFallback,
}: ProvidersProps) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={loadingFallback}>
        <QueryClientProvider>
          <I18n>{children}</I18n>
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

type LayoutProps = ProvidersProps & {
  readonly className?: string;
};

export const Layout = ({ children, className, ...props }: LayoutProps) => {
  const { data: theme } = useStorage(StorageKey.THEME);

  return (
    <Providers {...props}>
      <div
        className={cn({
          dark:
            theme.mode === ThemeMode.DARK ||
            (theme.mode === ThemeMode.SYSTEM &&
              window.matchMedia("(prefers-color-scheme: dark)").matches),
        })}
      >
        <div
          id="main"
          className={cn(
            "bg-background text-foreground flex min-h-screen w-full min-w-[23rem] flex-col font-sans text-base",
            `theme-${theme.color}`,
          )}
        >
          <Toaster />
          <div
            className={cn(
              "flex w-full max-w-[80rem] grow flex-col items-center justify-between gap-16 p-4",
              className,
            )}
          >
            <Header />
            {children}
            <Footer />
          </div>
        </div>
      </div>
    </Providers>
  );
};

export const render = (id: string, element: React.ReactElement) => {
  const container = document.getElementById(id);
  if (container) {
    ReactDOM.createRoot(container).render(<StrictMode>{element}</StrictMode>);
  }
};
