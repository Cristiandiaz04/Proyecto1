import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function WelcomeScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* TÍTULO */}
      <Text style={[styles.title, { color: colors.text }]}>
        Barbería El Perrín 💈
      </Text>

      {/* MENSAJE */}
      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText },
        ]}
      >
        Bienvenido
        Aquí no solo cortamos cabello,  
        creamos estilo, confianza y buena vibra.
      </Text>

      {/* BOTÓN PRINCIPAL */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: colors.primary },
        ]}
        onPress={() => navigation.navigate("Servicios")}
      >
        <Text style={styles.buttonText}>Hacer cita</Text>
      </TouchableOpacity>

      {/* REDES SOCIALES */}
      <View style={styles.socialContainer}>
        <Text style={[styles.socialTitle, { color: colors.text }]}>
          Contáctanos
        </Text>

        <View style={styles.socialRow}>
          <Ionicons
            name="logo-instagram"
            size={22}
            color={colors.primary}
          />
          <Text
            style={[
              styles.socialText,
              { color: colors.secondaryText },
            ]}
          >
            @cristiandiazz_69
          </Text>
        </View>

        <View style={styles.socialRow}>
          <Ionicons
            name="logo-whatsapp"
            size={22}
            color="#22c55e"
          />
          <Text
            style={[
              styles.socialText,
              { color: colors.secondaryText },
            ]}
          >
            +504 96745377
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 26,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 40,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  socialContainer: {
    alignItems: "center",
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  socialText: {
    fontSize: 16,
    marginLeft: 8,
  },
});
