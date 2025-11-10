import { OTPInput } from "input-otp-native";
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
} from "react-native-reanimated";

import { cn } from "@turbostarter/ui";

import type { SlotProps } from "input-otp-native";

function InputOTPGroup({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="input-otp-group"
      className={cn("justify-center3 flex-row items-center", className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  char,
  isActive,
  hasFakeCaret,
  className,
  index,
  max,
  ...props
}: React.ComponentProps<typeof View> &
  SlotProps & { index?: number; max?: number }) {
  const isFirst = index === 0;
  const isLast = index === (max ?? 6) - 1;

  return (
    <View
      className={cn(
        "border-input relative flex size-14 items-center justify-center border transition-all outline-none",
        "dark:bg-input/10",
        {
          "border-ring": isActive,
          "rounded-l-md": isFirst,
          "rounded-r-md": isLast,
        },
        className,
      )}
      {...props}
    >
      {char !== null && (
        <Text className="text-foreground font-sans-medium text-2xl">
          {char}
        </Text>
      )}
      {hasFakeCaret && <FakeCaret />}
    </View>
  );
}

function FakeCaret() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const baseStyle = {
    width: 2,
    height: 20,
    backgroundColor: "#000",
    borderRadius: 1,
  };

  return (
    <View className="absolute h-full w-full items-center justify-center">
      <Animated.View style={[baseStyle, animatedStyle]} />
    </View>
  );
}

function InputOTPSeparator({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      {...props}
      className={cn("w-2 items-center justify-center", className)}
    >
      <View className="bg-muted-foreground h-0.5 w-2 rounded-sm" />
    </View>
  );
}

export { OTPInput as InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
