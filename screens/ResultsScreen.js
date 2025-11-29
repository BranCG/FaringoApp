import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Linking
} from 'react-native';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ResultsScreen({ route, navigation }) {
    const { resultVideoUrl, serverIP, rawResponse } = route.params;
    const [videoError, setVideoError] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // Build video URL - handle if resultVideoUrl is undefined
    let videoUrl = null;
    if (resultVideoUrl) {
        videoUrl = resultVideoUrl.startsWith('http')
            ? resultVideoUrl
            : `http://${serverIP}:5000${resultVideoUrl}`;
    }

    const processAnother = () => {
        navigation.navigate('ModeSelector');
    };

    const downloadVideo = async () => {
        if (!videoUrl) {
            Alert.alert('Error', 'No hay URL de video disponible para descargar');
            return;
        }

        try {
            setIsDownloading(true);

            const filename = videoUrl.split('/').pop() || 'video_procesado.mp4';
            const fileUri = FileSystem.documentDirectory + filename;

            const download = await FileSystem.downloadAsync(videoUrl, fileUri);

            if (download.status === 200) {
                const canShare = await Sharing.isAvailableAsync();
                if (canShare) {
                    await Sharing.shareAsync(download.uri);
                } else {
                    Alert.alert('Éxito', `Video guardado en: ${download.uri}`);
                }
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo descargar el video: ' + error.message);
        } finally {
            setIsDownloading(false);
        }
    };

    const openInBrowser = () => {
        if (!videoUrl) {
            Alert.alert('Error', 'No hay URL de video disponible');
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
                            ⚠️ Error al cargar el video. Usa los botones de abajo para descargarlo o abrirlo.
                        </Text>
                    </View>
                )}

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.downloadButton]}
                        onPress={downloadVideo}
                        disabled={isDownloading || !videoUrl}
                    >
                        <Text style={styles.actionButtonText}>
                            {isDownloading ? '⏳ Descargando...' : '📥 Descargar'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.browserButton]}
                        onPress={openInBrowser}
                        disabled={!videoUrl}
                    >
                        <Text style={styles.actionButtonText}>🌐 Abrir en Navegador</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.debugCard}>
                    <Text style={styles.debugTitle}>🔍 Info de Debug</Text>
                    {videoUrl ? (
                        <Text style={styles.debugText}>URL: {videoUrl}</Text>
                    ) : (
                        <>
                            <Text style={styles.debugText}>❌ URL NO DISPONIBLE</Text>
                            <Text style={styles.debugText}>resultVideoUrl: {resultVideoUrl || 'undefined'}</Text>
                            <Text style={styles.debugText}>serverIP: {serverIP}</Text>
                            {rawResponse && (
                                <Text style={styles.debugText}>
                                    Respuesta backend: {JSON.stringify(rawResponse, null, 2)}
                                </Text>
                            )}
                        </>
                    )}
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>ℹ️ Información</Text>
                    <Text style={styles.infoText}>
                        • El video muestra el tracking en tiempo real{'\n'}
                        • Panel de resumen con estadísticas de contracción{'\n'}
                        • Gráfico de área vs tiempo{'\n'}
                        • Color del rombo indica nivel de constricción
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
    buttonRow: {
        flexDirection: 'row',
        marginBottom: 16
    },
    actionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4
    },
    downloadButton: {
        backgroundColor: '#10B981'
    },
    browserButton: {
        backgroundColor: '#3B82F6'
    },
    actionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600'
    },
    debugCard: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16
    },
    debugTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4
    },
    debugText: {
        fontSize: 11,
        color: '#6B7280',
        fontFamily: 'monospace'
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
