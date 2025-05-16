import { Alert } from "react-native";

export const confirmAsync = (
  title: string,
  message: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: "Nee",
          onPress: () => resolve(false),
          style: "cancel",
        },
        {
          text: "Ja",
          onPress: () => resolve(true),
        },
      ],
      { cancelable: false }
    );
  });
};
