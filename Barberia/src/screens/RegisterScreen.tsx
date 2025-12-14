
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [clave, setClave] = useState("");


  const registrar = async () => {
    if (!nombre || !correo || !telefono || !clave) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: correo,
      password: clave,
    });

    if (error) {
      Alert.alert("Error", "No se pudo crear la cuenta.");
      return;
    }

    const userId = data.user?.id;

    await supabase.from("users").insert({
      id: userId,
      auth_id: userId,
      name: nombre,
      email: correo,
      phone: telefono,
    });

    Alert.alert("Éxito", "Cuenta creada correctamente.");
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
      />

      <TextInput
        style={styles.input}
        placeholder="Número de teléfono"
        value={telefono}
        onChangeText={setTelefono}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={clave}
        onChangeText={setClave}
        secureTextEntry
      />

      <Button title="Registrarme" onPress={registrar} />

      <Button
        title="Volver al inicio de sesión"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 26, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 12, borderRadius: 5, marginBottom: 10 },
});
