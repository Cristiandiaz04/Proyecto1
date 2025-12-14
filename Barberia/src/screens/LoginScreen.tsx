
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");

  const iniciarSesion = async () => {
    if (!email || !clave) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: clave,
    });

    if (error) {
      Alert.alert("Error", "Correo o contraseña incorrectos.");
      return;
    }

    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={clave}
        onChangeText={setClave}
        secureTextEntry
      />

      <Button title="Entrar" onPress={iniciarSesion} />

      <Button
        title="Crear una cuenta"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 26, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 12, borderRadius: 5, marginBottom: 10 },
});
