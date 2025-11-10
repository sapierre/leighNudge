import { TextInput } from "react-native";

import { cn } from "@turbostarter/ui";

import type { TextInputProps } from "react-native";

function Input({
  className,
  placeholderClassName,
  style,
  ...props
}: TextInputProps & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        "border-input native:leading-[1.25] text-foreground bg-background dark:bg-input/10 flex h-12 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 font-sans text-base shadow-sm shadow-black/5",
        props.editable === false && "opacity-50",
        className,
      )}
      placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
      style={[{ paddingHorizontal: 12 }, style]}
      {...props}
    />
  );
}

export { Input };
