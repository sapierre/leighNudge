import { Portal } from "@rn-primitives/portal";
import { Fragment } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useNativeVariable } from "react-native-css/native";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

import { cn } from "@turbostarter/ui";

import { isIOS } from "~/utils/device";

const FullWindowOverlay = isIOS ? RNFullWindowOverlay : Fragment;

interface SpinnerProps {
  readonly modal?: boolean;
}

export const Spinner = ({ modal = true }: SpinnerProps) => {
  const primaryColor = useNativeVariable("--primary") as string;

  if (!modal) {
    return (
      <View
        style={StyleSheet.absoluteFill}
        className="bg-background flex-1 items-center justify-center"
      >
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <Portal name="spinner">
      <FullWindowOverlay>
        <View
          style={StyleSheet.absoluteFill}
          className="flex-1 items-center justify-center"
        >
          <View
            style={StyleSheet.absoluteFill}
            className={cn("bg-background", {
              "opacity-70": modal,
            })}
          />
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      </FullWindowOverlay>
    </Portal>
  );
};
