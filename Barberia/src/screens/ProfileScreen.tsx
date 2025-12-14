import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { supabase } from "../lib/supabase";
import { getUserProfile } from "../lib/api";
import { useTheme } from "../context/ThemeContext";

export default function ProfileScreen() {
  const [perfil, setPerfil] = useState<any>(null);
 const { toggleTheme, resetTheme, colors } = useTheme();
  

  useEffect(() => {
    getUserProfile().then(setPerfil);
  }, []);

  const cerrarSesion = async () => {
  Alert.alert(
    "Cerrar sesión",
    "¿Estás seguro que deseas cerrar sesión?",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          resetTheme(); 
          await supabase.auth.signOut();
        },
      },
    ]
  );
};

  if (!perfil) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.avatar}>
          {perfil.name.charAt(0).toUpperCase()}
        </Text>
        <Text style={[styles.name, { color: colors.text }]}>
          {perfil.name}
        </Text>
        <Text style={{ color: colors.secondaryText }}>
          {perfil.email}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={{ color: colors.secondaryText }}>Teléfono</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {perfil.phone}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={toggleTheme}
      >
        <Text style={styles.buttonText}>Cambiar tema</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#dc2626" }]}
        onPress={cerrarSesion}
      >
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", marginBottom: 30 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#7c3aed",
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
  },
  name: { fontSize: 24, fontWeight: "bold" },
  card: { padding: 16, borderRadius: 14, marginBottom: 20 },
  value: { fontSize: 18, fontWeight: "bold" },
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
