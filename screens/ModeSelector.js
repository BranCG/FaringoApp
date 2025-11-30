import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Linking
} from 'react-native';

export default function ModeSelector({ navigation }) {
    const selectMode = (mode) => {
        navigation.navigate('VideoUpload', { mode });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecciona el Modo de Tracking</Text>

            <TouchableOpacity
                style={[styles.modeCard, styles.diamondCard]}
                onPress={() => selectMode('diamond')}
            >
                <Text style={styles.modeIcon}>💎</Text>
                <Text style={styles.modeTitle}>Rombo</Text>
                <Text style={styles.modeSubtitle}>Medición de Área</Text>
                <Text style={styles.modeDescription}>
                    Dibuja 4 puntos para formar un rombo y medir la constricción faríngea
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.modeCard, styles.polylineCard]}
                onPress={() => selectMode('polyline')}
            >
                <Text style={styles.modeIcon}>📏</Text>
                <Text style={styles.modeTitle}>Contornos Deformables</Text>
                <Text style={styles.modeSubtitle}>Tracking Polilineal</Text>
                <Text style={styles.modeDescription}>
                    Dibuja múltiples contornos para trackear estructures laríngeas
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.privacyButton}
                onPress={() => Linking.openURL('https://faringoapp.onrender.com/privacy')}
            >
                <Text style={styles.privacyButtonText}>🔒 Política de Privacidad</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F3F4F6'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 24,
        textAlign: 'center'
    },
    modeCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5
    },
    diamondCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#10B981'
    },
    polylineCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6'
    },
    modeIcon: {
        fontSize: 48,
        textAlign: 'center',
        marginBottom: 12
    },
    modeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 4
    },
    modeSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 12
    },
    modeDescription: {
        fontSize: 14,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 20
    },
    privacyButton: {
        marginTop: 'auto',
        padding: 15,
        alignItems: 'center',
    },
    privacyButtonText: {
        color: '#6B7280',
        fontSize: 14,
        textDecorationLine: 'underline'
    }
});
