// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import ReserveScreen from './src/screens/ReserveScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MyReservationsScreen from './src/screens/MyReservationsScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

import { supabase } from './src/lib/supabase';
import { ThemeProvider } from './src/context/ThemeContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#222' },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#aaaaaa',
        tabBarIcon: ({ color, size }) => {
          let icon: any = 'home';
          if (route.name === 'Servicios') icon = 'cut';
          if (route.name === 'Reservar') icon = 'calendar';
          if (route.name === 'Perfil') icon = 'person';
          if (route.name === 'MisReservas') icon = 'time';
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Bienvenida" component={WelcomeScreen} />
      <Tab.Screen name="Servicios" component={ServicesScreen} />
      <Tab.Screen name="Reservar" component={ReserveScreen} />
      <Tab.Screen name="MisReservas" component={MyReservationsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUsuario(data.session);
    });

    const listener = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session);
    });

    return () => {
      listener.data.subscription.unsubscribe();
    };
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {usuario ? (
            <Stack.Screen name="Tabs" component={Tabs} />
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
