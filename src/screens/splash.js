import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import {AppColors} from '../assets/styles/default-styles';

const {width, height} = Dimensions.get('window');

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />

      <View style={styles.topSection}>
        <Text style={styles.title}>Carga de{'\n'}Crédito</Text>
      </View>

      <View style={styles.centerSection}>
        <Image
          source={require('../assets/img/splash.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.divider} />
        <Text style={styles.name}>Francisco Allende</Text>
        <Text style={styles.name}>División A141-2</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.darkBlue, // Color más oscuro del sistema
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.9)', // Overlay sutil para dar profundidad
  },
  topSection: {
    width: width,
    paddingTop: height * 0.1,
    paddingHorizontal: 30,
  },
  appType: {
    fontSize: 16,
    color: AppColors.textSecondary,
    letterSpacing: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    lineHeight: 56,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: width * 0.8,
    height: width * 0.8,
    opacity: 0.9,
  },
  bottomSection: {
    width: width,
    paddingBottom: height * 0.08,
    alignItems: 'center',
  },
  divider: {
    width: 40,
    height: 4,
    backgroundColor: AppColors.indigo,
    borderRadius: 2,
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    color: AppColors.textPrimary,
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  division: {
    fontSize: 20,
    color: AppColors.textSecondary,
    letterSpacing: 1,
  },
});

export default SplashScreen;
