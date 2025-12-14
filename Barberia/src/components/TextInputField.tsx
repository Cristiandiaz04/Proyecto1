import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';

export default function TextInputField(props: TextInputProps) {
  return (
    <View style={styles.wrap}>
      <TextInput style={styles.input} placeholderTextColor="#666" {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 8 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
});
