import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

import { supabase } from "../lib/supabase";
import { getUserProfile } from "../lib/api";
import { useTheme } from "../context/ThemeContext";


LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  today: "Hoy",
};

LocaleConfig.defaultLocale = "es";


export default function ReserveScreen({ route, navigation }) {
  const { serviceId, serviceName } = route.params || {};
  const { colors } = useTheme();

  const [perfil, setPerfil] = useState<any>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);

 
  useEffect(() => {
    getUserProfile().then(setPerfil);
  }, []);


  const generarHorarios = () => {
    const horarios: string[] = [];
    let hora = 8;
    let minuto = 0;

    while (hora < 19 || (hora === 19 && minuto === 0)) {
      const h = hora.toString().padStart(2, "0");
      const m = minuto.toString().padStart(2, "0");
      horarios.push(`${h}:${m}`);

      minuto += 30;
      if (minuto === 60) {
        minuto = 0;
        hora++;
      }
    }
    return horarios;
  };


  const seleccionarFecha = async (day: any) => {
    const fecha = day.dateString;


    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaSeleccion = new Date(fecha);
    fechaSeleccion.setHours(0, 0, 0, 0);

    if (fechaSeleccion < hoy) {
      Alert.alert(
        "Fecha inválida",
        "No puedes reservar citas en fechas pasadas"
      );
      return;
    }

    const diaSemana = fechaSeleccion.getDay();

  
    if (diaSemana === 1 || diaSemana === 6) {
      Alert.alert(
        "Cerrado",
        "La barbería está cerrada los domingos y martes"
      );
      return;
    }

    setFechaSeleccionada(fecha);
    setHoraSeleccionada(null);

    const { data, error } = await supabase
      .from("reservations")
      .select("reservation_time")
      .eq("reservation_date", fecha)
      .eq("service_id", serviceId);

    if (error) {
      Alert.alert("Error", "No se pudieron cargar los horarios");
      return;
    }

    const horasReservadas = data.map((r) => r.reservation_time);
    const todas = generarHorarios();
    const disponibles = todas.filter(
      (h) => !horasReservadas.includes(h)
    );

    setHorasDisponibles(disponibles);
  };


  const guardarReserva = async () => {
    if (!fechaSeleccionada || !horaSeleccionada) {
      Alert.alert("Error", "Selecciona fecha y hora");
      return;
    }

    const { data } = await supabase
      .from("reservations")
      .select("id")
      .eq("reservation_date", fechaSeleccionada)
      .eq("reservation_time", horaSeleccionada);

    if (data && data.length > 0) {
      Alert.alert(
        "Horario ocupado",
        "Ese horario ya no está disponible"
      );
      return;
    }

    const { error } = await supabase.from("reservations").insert([
      {
        user_id: perfil.id,
        service_id: serviceId,
        reservation_date: fechaSeleccionada,
        reservation_time: horaSeleccionada,
      },
    ]);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }
    
    Alert.alert("Éxito", "Tu cita fue reservada correctamente");
    navigation.navigate("MisReservas");
  };

  if (!perfil) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Reservar Servicio
      </Text>

      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
        {serviceName}
      </Text>

      {/*  CALENDARIO */}
      <Calendar
        minDate={new Date().toISOString().split("T")[0]}
        onDayPress={seleccionarFecha}
        markedDates={
          fechaSeleccionada
            ? {
                [fechaSeleccionada]: {
                  selected: true,
                  selectedColor: colors.primary,
                },
              }
            : {}
        }
        theme={{
          calendarBackground: colors.card,
          dayTextColor: colors.text,
          monthTextColor: colors.text,
          todayTextColor: colors.primary,
          arrowColor: colors.primary,
          selectedDayBackgroundColor: colors.primary,
        }}
      />

      {/*  HORARIOS */}
      {fechaSeleccionada && (
        <>
          <Text style={[styles.horariosTitle, { color: colors.text }]}>
            Horarios disponibles
          </Text>

          {horasDisponibles.length === 0 ? (
            <Text style={[styles.noHorarios, { color: "#dc2626" }]}>
              No hay horarios disponibles este día
            </Text>
          ) : (
            <FlatList
              data={horasDisponibles}
              keyExtractor={(item) => item}
              numColumns={3}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.horaBtn,
                    {
                      backgroundColor:
                        horaSeleccionada === item
                          ? colors.primary
                          : colors.card,
                    },
                  ]}
                  onPress={() => setHoraSeleccionada(item)}
                >
                  <Text
                    style={{
                      color:
                        horaSeleccionada === item
                          ? "#ffffff"
                          : colors.text,
                      fontWeight: "bold",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      )}

      {/*  BOTÓN */}
      {horaSeleccionada && (
        <TouchableOpacity
          style={[styles.boton, { backgroundColor: colors.primary }]}
          onPress={guardarReserva}
        >
          <Text style={styles.botonText}>Confirmar cita</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  horariosTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  noHorarios: {
    textAlign: "center",
    marginVertical: 10,
  },
  horaBtn: {
    padding: 10,
    margin: 5,
    borderRadius: 8,
    width: "30%",
    alignItems: "center",
  },
  boton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },
  botonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
