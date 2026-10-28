import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>EGP</Text>
      </View>
      <Text style={styles.title}>Event Garage Parking</Text>
      <Text style={styles.subtitle}>
        The mobile app is ready. Screens will be built after the website and
        API.
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#007DB5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#475569",
    textAlign: "center",
  },
});
