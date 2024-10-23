import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import {AuthContext} from '../utils/auth.context';
import useAuthenticationApi from '../api/authentication';
import showToast from '../functions/showToast';
import auth from '@react-native-firebase/auth';
import {AppColors, WalletStyles} from '../assets/styles/default-styles';

const LoginScreen = ({navigation}) => {
  const {signIn} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {doLogin} = useAuthenticationApi(
    email,
    password,
    setIsLoading,
    navigation,
  );

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('error', 'Por favor, completa todos los campos.', 3000);
      return;
    }
    await doLogin();
  };

  const quickLogin = async userType => {
    const emails = {
      admin: 'adminuno@yopmail.com',
      anonymous: 'anonimo@yopmail.com',
      tester: 'tester@yopmail.com',
    };
    await auth().signInWithEmailAndPassword(emails[userType], '12345678');
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ImageBackground
          source={require('../assets/img/icono-difuminado.png')}
          style={styles.headerBackground}
          imageStyle={styles.headerBackgroundImage}></ImageBackground>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>
          Bienvenido de vuelta a Carga de Crédito
        </Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={AppColors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={AppColors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eyeIconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.loginButton,
            (!email || !password) && styles.loginButtonDisabled,
          ]}
          onPress={handleLogin}
          disabled={!email || !password || isLoading}>
          <Text style={styles.loginButtonText}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerButtonText}>Crear nueva cuenta</Text>
        </TouchableOpacity>

        <View style={styles.quickAccessContainer}>
          <Text style={styles.quickAccessTitle}>Acceso rápido</Text>
          <View style={styles.quickButtons}>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => quickLogin('admin')}>
              <Text style={styles.quickButtonText}>Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => quickLogin('anonymous')}>
              <Text style={styles.quickButtonText}>Anónimo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => quickLogin('tester')}>
              <Text style={styles.quickButtonText}>Tester</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...WalletStyles.container,
  },
  header: {
    height: 200,
    backgroundColor: AppColors.navy,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden', // Para asegurar que la imagen respete los bordes redondeados
  },
  headerBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackgroundImage: {
    opacity: 0.7, // Hace la imagen más sutil
    transform: [{scale: 1.15}], // Agranda ligeramente la imagen
  },
  headerContent: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(30, 41, 59, 0.7)', // Overlay sutil para mejorar legibilidad
  },
  appName: {
    fontSize: 32,
    color: AppColors.textPrimary,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: AppColors.textSecondary,
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    color: AppColors.textPrimary,
    fontWeight: '600',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    ...WalletStyles.input,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  eyeIconText: {
    fontSize: 20,
  },
  loginButton: {
    ...WalletStyles.button,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    ...WalletStyles.buttonDisabled,
  },
  loginButtonText: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    padding: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: AppColors.link,
    fontSize: 16,
  },
  quickAccessContainer: {
    marginTop: 32,
  },
  quickAccessTitle: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    backgroundColor: AppColors.navy,
    borderRadius: 12,
    padding: 12,
    width: '30%',
  },
  quickButtonText: {
    color: AppColors.textPrimary,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default LoginScreen;
