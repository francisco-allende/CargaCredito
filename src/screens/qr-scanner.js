import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {usePermissions} from '../functions/use-permissions';
import {VALID_CODES} from '../constants/qrCodes';

const {width, height} = Dimensions.get('window');
const PERMISSION_TYPES = {
  CAMERA: 'camera',
};

const QrScanner = ({setIsCameraShown, onReadCode}) => {
  const device = useCameraDevice('back');
  const camera = useRef(null);
  const {askPermissions} = usePermissions(PERMISSION_TYPES.CAMERA);
  const [cameraShown, setCameraShown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      let r = await askPermissions();
      console.log('permisos: ', r);
      setCameraShown(true);
    } catch (error) {
      Alert.alert(
        'Error de permisos',
        'No se pudo acceder a la cámara. Por favor, habilita los permisos en la configuración.',
        [{text: 'OK', onPress: () => setIsCameraShown(false)}],
      );
    }
  };

  // Validar si hay dispositivo de cámara disponible
  if (device == null) {
    Alert.alert('Error!', 'La cámara no pudo iniciarse');
    return null;
  }

  const onError = error => {
    Alert.alert('Error!', error.message);
  };
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (isProcessing) return; // Si ya está procesando un código, ignoramos nuevas lecturas

      if (codes.length > 0 && codes[0].value) {
        const qrValue = codes[0].value;

        // El de 50 hardcodeado que ya funciona
        const code50 = 'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172';

        // Los otros códigos que ya funcionaban
        const code100 = '2786f4877b9091dcad7f35751bfcf5d5ea712b2f';
        const code10 = '8c95def646b6127282ed50454b73240300dccabc';

        console.log('QR Value:', qrValue);

        if (qrValue.toLowerCase().includes(code50.toLowerCase())) {
          console.log('MATCH 50!');
          setIsProcessing(true); // Activamos el flag antes de procesar
          setTimeout(() => {
            onReadCode(qrValue); // El de 50
            setIsCameraShown(false);
          }, 500);
        } else if (qrValue === code100 || qrValue === code10) {
          console.log('MATCH 100 o 10!');
          setIsProcessing(true); // Activamos el flag antes de procesar
          setTimeout(() => {
            onReadCode(qrValue); // Los originales
            setIsCameraShown(false);
          }, 500);
        }
      }
    },
  });

  if (!cameraShown) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal
        presentationStyle="fullScreen"
        animationType="slide"
        visible={true}
        onRequestClose={() => setIsCameraShown(false)}>
        <View style={StyleSheet.absoluteFill}>
          <Camera
            ref={camera}
            onError={onError}
            style={StyleSheet.absoluteFill} // Cambiado
            device={device}
            isActive={true}
            codeScanner={codeScanner}
          />

          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            <Text style={styles.instructions}>
              Posiciona el código QR dentro del marco
            </Text>
          </View>

          {/* Botón de cerrar */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsCameraShown(false)}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Cambiado
  },
  fullScreenCamera: {
    flex: 1, // Simplificado
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  scanArea: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#4F46E5',
    borderWidth: 4,
  },
  cornerTL: {
    top: -20,
    left: -20,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 20,
  },
  cornerTR: {
    top: -20,
    right: -20,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 20,
  },
  cornerBL: {
    bottom: -20,
    left: -20,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 20,
  },
  cornerBR: {
    bottom: -20,
    right: -20,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 20,
  },
  instructions: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 40,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
});

export default QrScanner;
