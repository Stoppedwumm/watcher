import { Text, View } from "react-native";

export default function Index() {
  const test = "unchecked"
  return (
    <View
  style={{
    flex: 1, // TS Error: Type 'string' is not assignable to type 'number'
    justifyContent: "center",
    alignItems: "center",
  }}
>
      <Text>Edit app/index.jsx</Text>
    </View>
  );
}
