import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import { supabase } from "../lib/supabase";
import { getUserProfile } from "../lib/api";
import { useTheme } from "../context/ThemeContext";

export default function MyReservationsScreen() {
  const [reservas, setReservas] = useState<any[]>([]);
  const { colors } = useTheme();

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    const perfil = await getUserProfile();
    if (!perfil) return;

    const { data } = await supabase
      .from("reservations")
      .select(`
        id,
        reservation_date,
        reservation_time,
        services ( name, price )
      `)
      .eq("user_id", perfil.id)
      .order("reservation_date");

    setReservas(data || []);
  };

  if (reservas.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>
          No tienes reservas registradas
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Mis Reservas
      </Text>

      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={{ color: colors.text, fontWeight: "bold" }}>
              {item.services.name}
            </Text>
            <Text style={{ color: colors.secondaryText }}>
              Fecha: {item.reservation_date}
            </Text>
            <Text style={{ color: colors.secondaryText }}>
              Hora: {item.reservation_time}
            </Text>
            <Text style={{ color: colors.text }}>
              Precio: L. {item.services.price}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 16 },
  card: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
});
