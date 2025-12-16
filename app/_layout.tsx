import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity, useColorScheme } from "react-native";
import { getTheme } from "../utils/theme";


export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: theme.background },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Ink",
            headerRight: () => (
              <TouchableOpacity onPress={() => router.push("/note/new")}>
                <Ionicons name="create-outline" size={24} color={theme.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="note/[id]" options={{ title: "" }} />
      </Stack>
    </>
  );
}

