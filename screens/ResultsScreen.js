import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Linking
} from 'react-native';
import { Video } from 'expo-av';

export default function ResultsScreen({ route, navigation }) {
    const { resultVideoUrl, serverIP, rawResponse } = route.params;
    const [videoError, setVideoError] = useState(null);

    // Build video URL
    let videoUrl = null;
    if (resultVideoUrl) {
        videoUrl = resultVideoUrl.startsWith('http')
            ? resultVideoUrl
            : `http://${serverIP}:5000${resultVideoUrl}`;
    }

    const processAnother = () => {
        navigation.navigate('ModeSelector');
    };

    const openInBrowser = () => {
        if (!videoUrl) {
            return;
        }
        Linking.openURL(videoUrl);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>✅ Video Procesado</Text>

                {videoUrl && (
                    <View style={styles.videoContainer}>
                        <Video
                            source={{ uri: videoUrl }}
                            style={styles.video}
                            useNativeControls
                            resizeMode="contain"
                            shouldPlay={false}
                            onError={(error) => {
                                console.error('Video error:', error);
                                setVideoError(error);
                            }}
                            onLoad={() => {
                                console.log('Video loaded successfully');
                                setVideoError(null);
                            }}
                        />
                    </View>
                )}

                {videoError && (
                    <View style={styles.errorCard}>
                        <Text style={styles.errorText}>
                            ⚠️ Error al cargar el video. Usa el botón de abajo para abrirlo en el navegador.
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.browserButton}
                    onPress={openInBrowser}
                    disabled={!videoUrl}
                >
                    <Text style={styles.browserButtonText}>🌐 Abrir en Navegador</Text>
                </TouchableOpacity>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>ℹ️ Información</Text>
                    <Text style={styles.infoText}>
                        • El video muestra el tracking en tiempo real{'\n'}
                        • Panel de resumen con estadísticas de contracción{'\n'}
                        • Gráfico de área vs tiempo{'\n'}
                        • Color del rombo indica nivel de constricción{'\n'}
                        • Desde el navegador puedes descargar o compartir el video
                    </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={processAnother}>
                    <Text style={styles.buttonText}>Procesar Otro Video</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6'
    },
    content: {
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 20,
        textAlign: 'center'
    },
    videoContainer: {
        backgroundColor: '#000',
        borderRadius: 12,
        overflow: 'hidden',
        aspectRatio: 16 / 9,
        marginBottom: 20
    },
    video: {
        width: '100%',
        height: '100%'
    },
    errorCard: {
        backgroundColor: '#FEF2F2',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#EF4444'
    },
    errorText: {
        color: '#991B1B',
        fontSize: 14
    },
    browserButton: {
        backgroundColor: '#3B82F6',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16
    },
    browserButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8
    },
    infoText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22
    },
    button: {
        backgroundColor: '#4F46E5',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    }
});
