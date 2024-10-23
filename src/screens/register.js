import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import useAuthenticationApi from '../api/authentication';
import showToast from '../functions/showToast';
import {AppColors, WalletStyles} from '../assets/styles/default-styles';

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {registerUser} = useAuthenticationApi(
    email,
    password,
    setIsLoading,
    navigation,
  );

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      showToast('error', 'Por favor, completa todos los campos.', 3000);
      return;
    }
    if (password !== confirmPassword) {
      showToast('error', 'Las contraseñas no coinciden.', 3000);
      return;
    }
    await registerUser();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear cuenta</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Únete a Carga de Crédito</Text>

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

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            placeholderTextColor={AppColors.placeholder}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.registerButton,
            (!email || !password || !confirmPassword) &&
              styles.registerButtonDisabled,
          ]}
          onPress={handleRegister}
          disabled={!email || !password || !confirmPassword || isLoading}>
          <Text style={styles.registerButtonText}>Crear cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLinkText}>
            ¿Ya tienes una cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...WalletStyles.container,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: AppColors.navy,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    height: 100,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: AppColors.textPrimary,
    fontSize: 24,
  },
  headerTitle: {
    color: AppColors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  formContainer: {
    flex: 1,
    padding: 24,
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
  registerButton: {
    ...WalletStyles.button,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonDisabled: {
    ...WalletStyles.buttonDisabled,
  },
  registerButtonText: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    padding: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    color: AppColors.link,
    fontSize: 16,
  },
});

export default RegisterScreen;
