import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ConfigScreen({ navigation }) {
    const [ip, setIp] = useState('');
    const [testing, setTesting] = useState(false);

    const testConnection = async () => {
        if (!ip.trim()) {
            Alert.alert('Error', 'Por favor ingresa una dirección IP');
            return;
        }

        setTesting(true);
        try {
            const response = await axios.get(`http://${ip}:5000/health`, {
                timeout: 5000
            });

            if (response.status === 200) {
                await AsyncStorage.setItem('serverIP', ip);
                Alert.alert(
                    'Éxito',
                    'Conexión exitosa al servidor',
                    [{ text: 'OK', onPress: () => navigation.replace('ModeSelector') }]
                );
            }
        } catch (error) {
            Alert.alert(
                'Error de Conexión',
                `No se pudo conectar al servidor en ${ip}:5000\n\nVerifica que:\n- El backend esté corriendo\n- Estés en la misma red Wi-Fi\n- La IP sea correcta`
            );
        } finally {
            setTesting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>🏥 FaringoApp</Text>
                <Text style={styles.subtitle}>Configuración del Servidor (Opcional)</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Dirección IP del Servidor</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: 192.168.1.100"
                        value={ip}
                        onChangeText={setIp}
                        keyboardType="url"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <Text style={styles.hint}>
                        💡 Solo necesario para procesar videos. Puedes saltarlo por ahora.
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.button, testing && styles.buttonDisabled]}
                    onPress={testConnection}
                    disabled={testing}
                >
                    {testing ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Conectar al Servidor</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => navigation.replace('ModeSelector')}
                >
                    <Text style={styles.skipButtonText}>Saltar (configurar después)</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#F3F4F6'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#1F2937'
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#6B7280',
        marginBottom: 32
    },
    inputContainer: {
        marginBottom: 24
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#F9FAFB'
    },
    hint: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 8,
        lineHeight: 18
    },
    button: {
        backgroundColor: '#4F46E5',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center'
    },
    buttonDisabled: {
        backgroundColor: '#9CA3AF'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    skipButton: {
        marginTop: 16,
        padding: 12,
        alignItems: 'center'
    },
    skipButtonText: {
        color: '#6B7280',
        fontSize: 14,
        textDecoration: 'underline'
    }
});
