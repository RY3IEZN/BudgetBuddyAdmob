/** @format */

import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { Suspense, useEffect, useState } from "react";
import { SQLiteProvider } from "expo-sqlite";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./screens/Home";

const Stack = createNativeStackNavigator();

// load the db
const loadDb = async () => {
  const dbName = "mySQLiteDB.db";
  const dbAsset = require("./assets/mySQLiteDB.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default function App() {
  const [dbLoaded, setDbLoaded] = useState(false);

  // useEffect(() => {
  //   loadDb();
  // }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadDb();
        setDbLoaded(true);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  if (!dbLoaded)
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} />
        <Text>Loading...</Text>
        <StatusBar style="auto" />
      </View>
    );

  return (
    <NavigationContainer>
      <Suspense
        fallback={
          <View style={styles.container}>
            <ActivityIndicator size={"large"} />
            <Text>Loading...</Text>
            <StatusBar style="auto" />
          </View>
        }
      >
        <SQLiteProvider databaseName="mySQLiteDB.db" useSuspense>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerTitle: "Budget Buddy",
                headerLargeTitle: true,
              }}
            />
          </Stack.Navigator>
        </SQLiteProvider>
      </Suspense>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
