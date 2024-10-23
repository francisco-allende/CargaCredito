import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
} from 'react-native';
import {AuthContext} from '../utils/auth.context';
import {useNavigation} from '@react-navigation/native';
import {AppColors, WalletStyles} from '../assets/styles/default-styles';
import QRScanner from './qr-scanner';
import showToast from '../functions/showToast';
import {VALID_CODES} from '../constants/qrCodes';

const {width, height} = Dimensions.get('window');

const HomeScreen = () => {
  const {signOut} = useContext(AuthContext);
  const navigation = useNavigation();
  const [credits, setCredits] = useState(0); // Por ahora hardcodeado, ya que debera cargar los creditos del usuario
  const [showScanner, setShowScanner] = useState(false);

  const handleLogOut = async () => {
    await signOut();
    navigation.navigate('Login');
  };

  const handleScanQR = () => {
    setShowScanner(true);
  };

  const handleCodeScanned = code => {
    console.log('Código escaneado:', code);
    let value;

    // El de 50 hardcodeado
    if (code.includes('ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172')) {
      value = 50;
    }
    // Los otros que ya funcionaban
    else if (code === '2786f4877b9091dcad7f35751bfcf5d5ea712b2f') {
      value = 100;
    } else if (code === '8c95def646b6127282ed50454b73240300dccabc') {
      value = 10;
    }

    console.log('Valor a sumar:', value);

    if (value) {
      setCredits(prev => prev + value);
      setShowScanner(false);
      showToast(
        'success',
        `Código cargado correctamente! +${value} créditos`,
        3000,
      );
    }
  };

  const handleClearCredits = () => {
    setCredits(0);
    showToast('success', 'Créditos limpiados correctamente', 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con botón de cerrar sesión */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Billetera</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Contador de Créditos */}
      <View style={styles.creditSection}>
        <Text style={styles.creditLabel}>Créditos Disponibles</Text>
        <View style={styles.creditContainer}>
          <Text style={styles.creditAmount}>{credits}</Text>
          <Text style={styles.creditSymbol}>CR</Text>
        </View>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearCredits}>
          <Text style={styles.clearButtonText}>Limpiar Créditos</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de Escanear */}
      <View style={styles.scanSection}>
        <TouchableOpacity style={styles.scanButton} onPress={handleScanQR}>
          <View style={styles.scanFrame}>
            <View style={styles.scanCorner} />
            <View style={styles.scanCorner} />
            <View style={styles.scanCorner} />
            <View style={styles.scanCorner} />
          </View>
          <Text style={styles.scanText}>ESCANEAR QR</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}>
        <QRScanner
          setIsCameraShown={setShowScanner}
          onReadCode={handleCodeScanned} // Simplificado
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...WalletStyles.container,
    position: 'relative',
  },
  header: {
    backgroundColor: AppColors.navy,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: AppColors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: AppColors.darkBlue,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: AppColors.textPrimary,
    fontSize: 14,
  },
  creditSection: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  creditLabel: {
    color: AppColors.textSecondary,
    fontSize: 16,
    marginBottom: 10,
  },
  creditContainer: {
    backgroundColor: AppColors.navy,
    borderRadius: 20,
    padding: 30,
    minWidth: width * 0.8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  creditAmount: {
    color: AppColors.textPrimary,
    fontSize: 72,
    fontWeight: 'bold',
  },
  creditSymbol: {
    color: AppColors.textSecondary,
    fontSize: 24,
    marginLeft: 10,
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: AppColors.danger,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  clearButtonText: {
    color: AppColors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  scanSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  scanButton: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: AppColors.navy,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  scanFrame: {
    width: '80%',
    height: '80%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: AppColors.indigo,
    borderWidth: 3,
  },
  // Posicionamiento de las esquinas del frame
  scanCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: AppColors.textPrimary,
    borderWidth: 3,
    opacity: 0.5,
  },
  // Esquina superior izquierda
  scanCorner: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  // Esquina superior derecha
  scanCorner: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  // Esquina inferior izquierda
  scanCorner: {
    ...StyleSheet.absoluteFillObject,
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  // Esquina inferior derecha
  scanCorner: {
    ...StyleSheet.absoluteFillObject,
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanText: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
});

export default HomeScreen;
