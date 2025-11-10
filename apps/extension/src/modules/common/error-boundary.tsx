import { Component } from "react";

import { useTranslation } from "@turbostarter/i18n";

import type { ReactNode } from "react";

const Error = () => {
  const { t } = useTranslation("common");

  return (
    <div className="flex w-full min-w-64 items-center justify-center px-10 py-16">
      <span className="text-destructive text-center">{t("error.general")}</span>
    </div>
  );
};

class ReactErrorBoundary extends Component<
  {
    children: ReactNode;
    fallback: ReactNode;
  },
  {
    hasError: boolean;
  }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export const ErrorBoundary = ({
  children,
  fallback = <Error />,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) => {
  return (
    <ReactErrorBoundary fallback={fallback}>{children}</ReactErrorBoundary>
  );
};
