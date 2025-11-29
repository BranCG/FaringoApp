import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import ConfigScreen from './screens/ConfigScreen';
import ModeSelector from './screens/ModeSelector';
import VideoUploadScreen from './screens/VideoUploadScreen';
import ProcessingScreen from './screens/ProcessingScreen';
import ResultsScreen from './screens/ResultsScreen';

const Stack = createStackNavigator();

export default function App() {
  const [serverIP, setServerIP] = useState(null);

  useEffect(() => {
    // Load saved server IP
    AsyncStorage.getItem('serverIP').then(ip => {
      if (ip) setServerIP(ip);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={serverIP ? "ModeSelector" : "Config"}
        screenOptions={{
          headerStyle: { backgroundColor: '#4F46E5' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        <Stack.Screen
          name="Config"
          component={ConfigScreen}
          options={{ title: 'Configuración del Servidor' }}
        />
        <Stack.Screen
          name="ModeSelector"
          component={ModeSelector}
          options={{ title: 'Seleccionar Modo' }}
        />
        <Stack.Screen
          name="VideoUpload"
          component={VideoUploadScreen}
          options={{ title: 'Seleccionar Video' }}
        />
        <Stack.Screen
          name="Processing"
          component={ProcessingScreen}
          options={{ title: 'Procesando...', headerBackVisible: false }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ title: 'Resultados' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
