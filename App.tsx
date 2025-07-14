import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView, Text, View, Button } from "react-native";
import { StockDbList } from "./components/StockDbList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Login } from "./components/Login";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Setting } from "./components/Setting";
import { DrawerContent } from "./components/DrawerContent";
import { open } from "./BL/database";
import { BLUE } from "./BL/Colors";
import LogoTitle from "./components/LogoTitle";
import NetInfo from "@react-native-community/netinfo";
import { updateConnectionStatus } from "./stores/connectionStore";
import { ErrorBoundary } from "react-error-boundary";
import { LogBox } from "react-native";

// Ignore specific warnings if needed
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

type RootStackParamList = {
  Scanner: undefined;
  Profile: undefined;
  Setting: undefined;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Error Fallback Component
function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <SafeAreaView style={styles.errorContainer}>
      <View style={styles.errorContent}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error.message}</Text>
        <Button title="Try again" onPress={resetErrorBoundary} color={BLUE} />
      </View>
    </SafeAreaView>
  );
}

const HomeScreen = ({ navigation }: { navigation: NavigationProp }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [qty, setQty] = useState(0);

  const showModal = (args: string) => {
    setModalVisible(true);
    setBarcode(args);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StockDbList />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default function App() {
  useEffect(() => {
    // Initialize database and connection status
    const initApp = async () => {
      try {
        await open();
        updateConnectionStatus();
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initApp();

    // Cleanup NetInfo listener
    const unsubscribe = NetInfo.addEventListener(() => {
      updateConnectionStatus();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error: Error) =>
        console.error("Error caught by ErrorBoundary:", error)
      }
      onReset={() => {
        console.log("App reset after error");
      }}
    >
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Scanner"
          drawerContent={(props) => <DrawerContent {...props} />}
          screenOptions={{
            unmountOnBlur: true,
            freezeOnBlur: true,
          }}
        >
          <Drawer.Screen
            name="Scanner"
            component={HomeScreen}
            options={{
              headerTitle: () => <LogoTitle title="Home" isLogin="false" />,
              headerStyle: { backgroundColor: BLUE },
              headerTintColor: "#fff",
            }}
          />

          <Drawer.Screen
            name="Profile"
            component={Login}
            options={{
              headerTitle: () => <LogoTitle title="Profile" isLogin="true" />,
              headerStyle: { backgroundColor: BLUE },
              headerTintColor: "#fff",
            }}
          />

          <Drawer.Screen
            name="Setting"
            component={Setting}
            options={{
              headerTitle: () => <LogoTitle title="Settings" isLogin="true" />,
              headerStyle: { backgroundColor: BLUE },
              headerTintColor: "#fff",
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#f8d7da",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContent: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "80%",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#721c24",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#721c24",
    marginBottom: 20,
  },
});
