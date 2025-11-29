import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadVideo } from '../services/api';

export default function ProcessingScreen({ route, navigation }) {
    const { videoUri, linesData, mode } = route.params;
    const [status, setStatus] = useState('Iniciando...');

    useEffect(() => {
        processVideo();
    }, []);

    const processVideo = async () => {
        try {
            const serverIP = await AsyncStorage.getItem('serverIP');

            if (!serverIP) {
                Alert.alert(
                    'Servidor no configurado',
                    'Para procesar videos necesitas configurar la IP del servidor del backend.',
                    [
                        { text: 'Volver', style: 'cancel', onPress: () => navigation.goBack() },
                        { text: 'Configurar Ahora', onPress: () => navigation.navigate('Config') }
                    ]
                );
                return;
            }

            setStatus('Subiendo video...');
            const response = await uploadVideo(serverIP, videoUri, linesData, mode);

            // Debug: Log the entire response
            console.log('=== BACKEND RESPONSE DEBUG ===');
            console.log('Status:', response.status);
            console.log('Data:', JSON.stringify(response.data, null, 2));
            console.log('=============================');

            if (response.status === 200) {
                setStatus('Procesamiento completado!');

                // The backend returns 'processed_url', not 'result_url'
                const resultUrl = response.data.processed_url
                    || response.data.result_url
                    || response.data.resultUrl
                    || response.data.result
                    || response.data.video_url
                    || response.data.url;

                console.log('Extracted resultUrl:', resultUrl);

                setTimeout(() => {
                    navigation.replace('Results', {
                        resultVideoUrl: resultUrl,
                        serverIP,
                        rawResponse: response.data  // Include raw response for debugging
                    });
                }, 1000);
            } else {
                throw new Error('Error en el procesamiento');
            }
        } catch (error) {
            console.error('Processing error:', error);
            console.error('Error details:', error.response?.data);
            Alert.alert(
                'Error',
                'No se pudo procesar el video. Verifica que el servidor esté corriendo.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={styles.status}>{status}</Text>
                <Text style={styles.subtitle}>
                    Esto puede tomar algunos minutos dependiendo del tamaño del video
                </Text>
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
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5
    },
    status: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 24,
        marginBottom: 8
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20
    }
});
