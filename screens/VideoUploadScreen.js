import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import Svg, { Circle, Polyline, Polygon } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_WIDTH = SCREEN_WIDTH - 40;

export default function VideoUploadScreen({ route, navigation }) {
    const { mode } = route.params;
    const [videoUri, setVideoUri] = useState(null);
    const [currentLine, setCurrentLine] = useState([]);
    const [lines, setLines] = useState([]);
    const [videoDimensions, setVideoDimensions] = useState({
        width: VIDEO_WIDTH,
        height: VIDEO_WIDTH * 9 / 16
    });
    const videoRef = useRef(null);

    const pickVideo = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permiso Requerido', 'Necesitamos acceso a tu galería para seleccionar videos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 1
        });

        if (!result.canceled) {
            setVideoUri(result.assets[0].uri);
            setCurrentLine([]);
            setLines([]);
        }
    };

    const handleCanvasPress = (event) => {
        if (!videoUri) return;

        const { locationX, locationY } = event.nativeEvent;
        const x = locationX / videoDimensions.width;
        const y = locationY / videoDimensions.height;

        if (mode === 'diamond') {
            if (lines.length > 0) return;

            const newLine = [...currentLine, { x, y }];

            if (newLine.length === 4) {
                setLines([newLine]);
                setCurrentLine([]);
            } else {
                setCurrentLine(newLine);
            }
        } else {
            setCurrentLine([...currentLine, { x, y }]);
        }
    };

    const finishLine = () => {
        if (currentLine.length >= 2) {
            setLines([...lines, currentLine]);
            setCurrentLine([]);
        }
    };

    const cancelLine = () => {
        setCurrentLine([]);
    };

    const clearAll = () => {
        setLines([]);
        setCurrentLine([]);
    };

    const processVideo = () => {
        if (!videoUri) {
            Alert.alert('Error', 'Por favor selecciona un video primero');
            return;
        }

        const allLines = lines.length > 0 ? lines : (currentLine.length > 0 ? [currentLine] : []);

        if (allLines.length === 0) {
            Alert.alert('Error', mode === 'diamond' ? 'Dibuja 4 puntos para el rombo' : 'Dibuja al menos una línea');
            return;
        }

        if (mode === 'diamond' && allLines[0].length !== 4) {
            Alert.alert('Error', 'El rombo debe tener exactamente 4 puntos');
            return;
        }

        navigation.navigate('Processing', {
            videoUri,
            linesData: allLines,
            mode
        });
    };

    const allPoints = [...lines.flat(), ...currentLine];
    const canProcess = mode === 'diamond'
        ? (lines.length > 0 && lines[0].length === 4)
        : lines.length > 0;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.modeLabel}>
                    Modo: {mode === 'diamond' ? '💎 Rombo' : '📏 Contornos'}
                </Text>

                {!videoUri ? (
                    <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
                        <Text style={styles.uploadIcon}>📹</Text>
                        <Text style={styles.uploadText}>Seleccionar Video</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        <View
                            style={[styles.videoContainer, {
                                width: VIDEO_WIDTH,
                                height: videoDimensions.height
                            }]}
                            onTouchEnd={handleCanvasPress}
                        >
                            <Video
                                ref={videoRef}
                                source={{ uri: videoUri }}
                                style={styles.video}
                                resizeMode="contain"
                                shouldPlay={false}
                                onReadyForDisplay={(event) => {
                                    if (event.naturalSize) {
                                        const { width, height } = event.naturalSize;
                                        const aspectRatio = height / width;
                                        setVideoDimensions({
                                            width: VIDEO_WIDTH,
                                            height: VIDEO_WIDTH * aspectRatio
                                        });
                                    }
                                }}
                            />

                            <Svg
                                style={styles.overlay}
                                width={videoDimensions.width}
                                height={videoDimensions.height}
                            >
                                {lines.map((line, i) => (
                                    mode === 'diamond' ? (
                                        <Polygon
                                            key={i}
                                            points={line.map(p =>
                                                `${p.x * videoDimensions.width},${p.y * videoDimensions.height}`
                                            ).join(' ')}
                                            fill="rgba(34, 197, 94, 0.3)"
                                            stroke="#22c55e"
                                            strokeWidth="3"
                                        />
                                    ) : (
                                        <Polyline
                                            key={i}
                                            points={line.map(p =>
                                                `${p.x * videoDimensions.width},${p.y * videoDimensions.height}`
                                            ).join(' ')}
                                            fill="none"
                                            stroke="#22c55e"
                                            strokeWidth="3"
                                        />
                                    )
                                ))}

                                {currentLine.length > 0 && (
                                    <Polyline
                                        points={currentLine.map(p =>
                                            `${p.x * videoDimensions.width},${p.y * videoDimensions.height}`
                                        ).join(' ')}
                                        fill="none"
                                        stroke="#EAB308"
                                        strokeWidth="3"
                                    />
                                )}

                                {allPoints.map((p, i) => (
                                    <Circle
                                        key={i}
                                        cx={p.x * videoDimensions.width}
                                        cy={p.y * videoDimensions.height}
                                        r="6"
                                        fill="#fff"
                                        stroke="#22c55e"
                                        strokeWidth="2"
                                    />
                                ))}
                            </Svg>
                        </View>

                        <Text style={styles.instructions}>
                            {mode === 'diamond'
                                ? `Toca 4 puntos para formar el rombo (${currentLine.length}/4)`
                                : 'Toca para agregar puntos. Presiona "Terminar Línea" cuando termines.'}
                        </Text>

                        <View style={styles.buttonRow}>
                            {mode === 'polyline' && currentLine.length >= 2 && (
                                <TouchableOpacity
                                    style={[styles.secondaryButton, styles.buttonSpacing]}
                                    onPress={finishLine}
                                >
                                    <Text style={styles.secondaryButtonText}>Terminar Línea</Text>
                                </TouchableOpacity>
                            )}

                            {currentLine.length > 0 && (
                                <TouchableOpacity
                                    style={[styles.cancelButton, styles.buttonSpacing]}
                                    onPress={cancelLine}
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar Línea</Text>
                                </TouchableOpacity>
                            )}

                            {(lines.length > 0 || currentLine.length > 0) && (
                                <TouchableOpacity
                                    style={[styles.cancelButton, styles.buttonSpacing]}
                                    onPress={clearAll}
                                >
                                    <Text style={styles.cancelButtonText}>Limpiar Todo</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity
                            style={[styles.processButton, !canProcess && styles.processButtonDisabled]}
                            onPress={processVideo}
                            disabled={!canProcess}
                        >
                            <Text style={styles.processButtonText}>
                                {mode === 'diamond' ? 'Procesar Rombo' : 'Procesar Contornos'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.changeVideoButton} onPress={pickVideo}>
                            <Text style={styles.changeVideoText}>Cambiar Video</Text>
                        </TouchableOpacity>
                    </>
                )}
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
    modeLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center'
    },
    uploadButton: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 48,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed'
    },
    uploadIcon: {
        fontSize: 64,
        marginBottom: 16
    },
    uploadText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4F46E5'
    },
    videoContainer: {
        backgroundColor: '#000',
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative'
    },
    video: {
        width: '100%',
        height: '100%'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    instructions: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 16
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12
    },
    buttonSpacing: {
        marginRight: 8,
        marginBottom: 8
    },
    secondaryButton: {
        flex: 1,
        minWidth: 120,
        backgroundColor: '#10B981',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
    secondaryButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600'
    },
    cancelButton: {
        flex: 1,
        minWidth: 100,
        backgroundColor: '#EF4444',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600'
    },
    processButton: {
        backgroundColor: '#4F46E5',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12
    },
    processButtonDisabled: {
        backgroundColor: '#9CA3AF'
    },
    processButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    changeVideoButton: {
        padding: 12,
        alignItems: 'center'
    },
    changeVideoText: {
        color: '#4F46E5',
        fontSize: 14,
        fontWeight: '600'
    }
});
