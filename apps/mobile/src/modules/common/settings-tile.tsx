import { Pressable } from "react-native";

import { cn } from "@turbostarter/ui";
import { Icons } from "@turbostarter/ui-mobile/icons";
import { Spin } from "@turbostarter/ui-mobile/spin";
import { TextClassContext } from "@turbostarter/ui-mobile/text";

interface SettingsTileProps {
  readonly icon: React.ElementType;
  readonly children: React.ReactNode;
  readonly onPress?: () => void;
  readonly destructive?: boolean;
  readonly loading?: boolean;
  readonly disabled?: boolean;
}

export const SettingsTile = ({
  icon: Icon,
  onPress,
  children,
  destructive,
  loading = false,
  disabled = false,
}: SettingsTileProps) => {
  return (
    <Pressable
      hitSlop={4}
      className={cn(
        "bg-background active:bg-muted flex-row items-center justify-between gap-5 px-7 py-4 transition-colors",
        {
          "opacity-50": disabled,
        },
      )}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon
        width={22}
        height={22}
        className={cn("text-muted-foreground", {
          "text-destructive": destructive,
        })}
      />
      <TextClassContext.Provider
        value={cn("mr-auto", {
          "text-destructive": destructive,
        })}
      >
        {children}
      </TextClassContext.Provider>

      {loading ? (
        <Spin>
          <Icons.Loader2 className="text-muted-foreground" />
        </Spin>
      ) : (
        <Icons.ChevronRight className="text-muted-foreground" />
      )}
    </Pressable>
  );
};
