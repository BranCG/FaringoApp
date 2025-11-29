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

// Function to generate automatic analysis
const generateAnalysis = (stats) => {
    if (!stats) return '';

    const constriction = stats.constriction_percentage || 0;

    let level = '';
    let recommendation = '';

    if (constriction < 20) {
        level = 'Constricción leve';
        recommendation = 'La contracción observada está dentro de rangos normales. Continuar con el seguimiento regular.';
    } else if (constriction < 40) {
        level = 'Constricción moderada';
        recommendation = 'Se observa una contracción moderada. Puede requerir atención según el contexto clínico.';
    } else if (constriction < 60) {
        level = 'Constricción significativa';
        recommendation = 'La contracción es considerable. Se recomienda evaluación clínica detallada.';
    } else {
        level = 'Constricción severa';
        recommendation = 'Se observa contracción severa. Se recomienda consulta especializada inmediata.';
    }

    const variance = stats.area_variance || 0;
    const variability = variance > 200 ? 'alta variabilidad' : variance > 100 ? 'variabilidad moderada' : 'variabilidad baja';

    return `${level} detectada (${constriction.toFixed(1)}%). ${recommendation}\n\nSe observa ${variability} en el área durante el video, lo que indica ${variance > 150 ? 'movimiento dinámico significativo' : 'movimiento relativamente estable'}.`;
};

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

                {/* Statistics Section */}
                {rawResponse && rawResponse.statistics && (
                    <>
                        <View style={styles.statsCard}>
                            <Text style={styles.statsTitle}>📊 Estadísticas de Contracción</Text>

                            <View style={styles.statsGrid}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>🔴</Text>
                                    <Text style={styles.statLabel}>Constricción Máx</Text>
                                    <Text style={styles.statValue}>
                                        {rawResponse.statistics.constriction_percentage?.toFixed(1)}%
                                    </Text>
                                </View>

                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>📉</Text>
                                    <Text style={styles.statLabel}>Apertura Mínima</Text>
                                    <Text style={styles.statValue}>
                                        {((rawResponse.statistics.min_area / (rawResponse.statistics.max_area || 1)) * 100).toFixed(1)}%
                                    </Text>
                                </View>

                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>📈</Text>
                                    <Text style={styles.statLabel}>Apertura Máxima</Text>
                                    <Text style={styles.statValue}>
                                        100%
                                    </Text>
                                </View>

                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>📊</Text>
                                    <Text style={styles.statLabel}>Apertura Promedio</Text>
                                    <Text style={styles.statValue}>
                                        {((rawResponse.statistics.avg_area / (rawResponse.statistics.max_area || 1)) * 100).toFixed(1)}%
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Analysis Section */}
                        <View style={styles.analysisCard}>
                            <Text style={styles.analysisTitle}>🔍 Análisis Automático</Text>
                            <Text style={styles.analysisText}>
                                {generateAnalysis(rawResponse.statistics)}
                            </Text>
                        </View>
                    </>
                )}

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
    // Statistics Card
    statsCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    statItem: {
        width: '48%',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center'
    },
    statIcon: {
        fontSize: 28,
        marginBottom: 8
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
        textAlign: 'center'
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center'
    },
    // Analysis Card
    analysisCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6'
    },
    analysisTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E40AF',
        marginBottom: 8
    },
    analysisText: {
        fontSize: 14,
        color: '#1F2937',
        lineHeight: 22
    },
    // Info Card
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
