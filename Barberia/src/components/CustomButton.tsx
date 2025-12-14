import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  text: string;
  onPress: () => void;
};

export default function CustomButton({ text, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: '#222', padding: 15, borderRadius: 5, alignItems: 'center' },
  text: { color: '#fff', fontWeight: 'bold' },
});

