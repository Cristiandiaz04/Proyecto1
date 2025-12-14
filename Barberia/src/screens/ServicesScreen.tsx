import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import { supabase } from "../lib/supabase";
import { useTheme } from "../context/ThemeContext";

export default function ServicesScreen({ navigation }) {
  const [servicios, setServicios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const { colors } = useTheme();

  const cargarServicios = async () => {
    const { data, error } = await supabase.from("services").select("*");

    if (error) {
      Alert.alert("Error", "No se pudieron cargar los servicios");
      return;
    }

    setServicios(data || []);
    setCargando(false);
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  if (cargando) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.text, fontSize: 18 }}>
          Cargando servicios...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Servicios Disponibles
      </Text>

      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: colors.card },
            ]}
            onPress={() =>
              navigation.navigate("Reservar", {
                serviceId: item.id,
                serviceName: item.name,
              })
            }
          >
            <Text
              style={[
                styles.service,
                { color: colors.text },
              ]}
            >
              {item.name}
            </Text>

            <Text
              style={[
                styles.price,
                { color: colors.primary },
              ]}
            >
              L. {item.price}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  service: {
    fontSize: 18,
    fontWeight: "600",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
