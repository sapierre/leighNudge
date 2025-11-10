import { TextInput } from "react-native";

import { cn } from "@turbostarter/ui";

import type { TextInputProps } from "react-native";

function Textarea({
  className,
  multiline = true,
  numberOfLines = 8,
  placeholderClassName,
  style,
  ...props
}: TextInputProps & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        "text-foreground border-input dark:bg-input/10 flex min-h-16 w-full flex-row rounded-md border bg-transparent px-3 py-2 font-sans text-base shadow-sm shadow-black/5",
        props.editable === false && "opacity-50",
        className,
      )}
      placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      style={[{ paddingHorizontal: 12 }, style]}
      {...props}
    />
  );
}

export { Textarea };
