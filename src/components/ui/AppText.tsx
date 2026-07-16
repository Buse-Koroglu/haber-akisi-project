import { forwardRef } from "react";
import {
  Platform,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
} from "react-native";

const serifFontFamily = Platform.OS === "ios" ? "Georgia" : "serif";

export const AppText = forwardRef<Text, TextProps>((props, ref) => (
  <Text
    ref={ref}
    {...props}
    style={[{ fontFamily: serifFontFamily }, props.style]}
  />
));

export const AppTextInput = forwardRef<TextInput, TextInputProps>(
  (props, ref) => (
    <TextInput
      ref={ref}
      {...props}
      style={[{ fontFamily: serifFontFamily }, props.style]}
    />
  ),
);
