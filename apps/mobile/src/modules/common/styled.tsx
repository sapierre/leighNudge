import { BlurView as NativeBlurView } from "expo-blur";
import { GlassView as NativeGlassView } from "expo-glass-effect";
import { Link as NativeLink } from "expo-router";
import { styled } from "react-native-css";
import { ScrollView as NativeScrollView } from "react-native-gesture-handler";
import { KeyboardAvoidingView as NativeKeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView as NativeSafeAreaView } from "react-native-safe-area-context";

import { cn } from "@turbostarter/ui";
import { Text } from "@turbostarter/ui-mobile/text";

import { WIDTH } from "~/utils/device";

export const KeyboardAvoidingView = styled(NativeKeyboardAvoidingView, {
  className: "style",
});

export const Link = styled(NativeLink, {
  className: "style",
});

export const ScrollView = styled(NativeScrollView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});

export const SafeAreaView = styled(NativeSafeAreaView, {
  className: "style",
});

export const BlurView = styled(NativeBlurView, {
  className: "style",
});

export const GlassView = styled(NativeGlassView, {
  className: "style",
});

export const TabBarLabel = ({
  children,
  focused,
}: {
  children: string;
  focused: boolean;
}) => {
  return (
    <Text
      className={cn(
        "text-muted-foreground text-xs",
        focused && "text-primary",
        WIDTH > 640 && "ml-3 text-sm",
      )}
    >
      {children}
    </Text>
  );
};
