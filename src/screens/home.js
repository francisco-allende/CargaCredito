import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
  ImageBackground,
} from 'react-native';
import {AuthContext} from '../utils/auth.context';
import {useNavigation} from '@react-navigation/native';
import {AppColors, WalletStyles} from '../assets/styles/default-styles';
import QRScanner from './qr-scanner';
import showToast from '../functions/showToast';
import {VALID_CODES} from '../constants/qrCodes';

const {width, height} = Dimensions.get('window');

const HomeScreen = () => {
  const {user} = useContext(AuthContext);
  const {signOut} = useContext(AuthContext);
  const navigation = useNavigation();
  const [credits, setCredits] = useState(0); // Por ahora hardcodeado, ya que debera cargar los creditos del usuario
  const [showScanner, setShowScanner] = useState(false);
  const [scannedCodes, setScannedCodes] = useState({});

  const isAdmin = user?.email === 'adminuno@yopmail.com';

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
      // Verificar si el código ya fue escaneado
      const attempts = scannedCodes[code] || 0;

      if (isAdmin) {
        // Lógica especial para admin
        if (attempts >= 2) {
          showToast('error', 'Límite de escaneos excedido', 3000);
          setShowScanner(false);
          return;
        }
        // Incrementar contador de intentos para este código
        setScannedCodes(prev => ({
          ...prev,
          [code]: (prev[code] || 0) + 1,
        }));
      } else {
        // Para usuarios no admin, solo se permite una vez
        if (attempts > 0) {
          showToast('error', 'Este código ya fue utilizado', 3000);
          setShowScanner(false);
          return;
        }
        // Registrar el primer uso del código
        setScannedCodes(prev => ({
          ...prev,
          [code]: 1,
        }));
      }

      // Actualizar créditos
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
    setScannedCodes({});
    showToast('success', 'Créditos limpiados correctamente', 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearCredits}>
          <Text style={styles.clearButtonText}>Limpiar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Créditos</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.creditSection}>
        <Text style={styles.creditLabel}>Créditos Disponibles</Text>
        <View style={styles.creditContainer}>
          <Text style={styles.creditAmount}>{credits}</Text>
          <Text style={styles.creditSymbol}>CR</Text>
        </View>
      </View>

      <View style={styles.scanSection}>
        <TouchableOpacity style={styles.scanButton} onPress={handleScanQR}>
          <ImageBackground
            source={require('../assets/img/icono-creditoV.png')}
            style={styles.backgroundImage}
            imageStyle={styles.backgroundImageStyle}
            resizeMode="contain">
            <View style={styles.scanFrame}>
              <View style={styles.scanCorner} />
              <View style={styles.scanCorner} />
              <View style={styles.scanCorner} />
              <View style={styles.scanCorner} />
            </View>
            <Text style={styles.scanText}>ESCANEAR QR</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}>
        <QRScanner
          setIsCameraShown={setShowScanner}
          onReadCode={handleCodeScanned}
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
    height: 90,
  },
  headerTitle: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: AppColors.darkBlue,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    color: AppColors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: AppColors.danger,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clearButtonText: {
    color: AppColors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },

  creditSection: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  creditLabel: {
    color: AppColors.textSecondary,
    fontSize: 32, // Aumentado
    marginBottom: 20, // Aumentado
    fontWeight: '600', // Más bold
  },
  creditContainer: {
    backgroundColor: AppColors.navy,
    borderRadius: 30,
    padding: 50, // Aumentado
    width: width * 0.95, // Aumentado
    minHeight: height * 0.4, // Aumentado
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 15,
  },
  creditAmount: {
    color: AppColors.textPrimary,
    fontSize: 120, // Aumentado
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: 0, height: 3},
    textShadowRadius: 5,
  },
  creditSymbol: {
    color: AppColors.textSecondary,
    fontSize: 38, // Aumentado
    marginLeft: 15,
    alignSelf: 'flex-start',
    marginTop: 25,
  },
  scanSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 40,
  },
  scanButton: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: AppColors.navy,
    borderRadius: 20,
    overflow: 'hidden',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    borderRadius: 20,
    opacity: 0.9,
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
    width: 30,
    height: 30,
    borderColor: AppColors.textPrimary,
    borderWidth: 3,
    opacity: 0.5,
  },
  // Las cuatro esquinas
  scanCorner: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  scanCorner: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  scanCorner: {
    ...StyleSheet.absoluteFillObject,
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
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
