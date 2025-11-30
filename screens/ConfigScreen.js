import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ConfigScreen({ navigation }) {
    const [ip, setIp] = useState('');
    const [testing, setTesting] = useState(false);

    const testConnection = async () => {
        if (!ip.trim()) {
            Alert.alert('Error', 'Por favor ingresa una dirección IP o URL');
            return;
        }

        setTesting(true);
        try {
            // Helper logic duplicated here for immediate feedback (or could import from api.js if exported)
            let baseUrl = ip.trim();
            if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = `http://${baseUrl}:5000`;
            } else {
                baseUrl = baseUrl.replace(/\/$/, '');
            }

            const response = await axios.get(`${baseUrl}/health`, {
                timeout: 5000
            });

            if (response.status === 200) {
                await AsyncStorage.setItem('serverIP', ip.trim());
                Alert.alert(
                    'Éxito',
                    'Conexión exitosa al servidor',
                    [{ text: 'OK', onPress: () => navigation.replace('ModeSelector') }]
                );
            }
        } catch (error) {
            Alert.alert(
                'Error de Conexión',
                `No se pudo conectar al servidor.\n\nVerifica que la URL/IP sea correcta.`
            );
        } finally {
            setTesting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>🏥 FaringoApp</Text>
                <Text style={styles.subtitle}>Configuración del Servidor</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Dirección IP o URL del Servidor</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: https://mi-app.onrender.com"
                        value={ip}
                        onChangeText={setIp}
                        keyboardType="url"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <Text style={styles.hint}>
                        💡 Ingresa la URL de Render o la IP local de tu PC.
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

                <TouchableOpacity
                    style={styles.privacyButton}
                    onPress={() => Linking.openURL('https://faringoapp.onrender.com/privacy')}
                >
                    <Text style={styles.privacyButtonText}>🔒 Política de Privacidad</Text>
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
        textDecorationLine: 'underline'
    },
    privacyButton: {
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB'
    },
    privacyButtonText: {
        color: '#4F46E5',
        fontSize: 12,
        fontWeight: '500'
    }
});
