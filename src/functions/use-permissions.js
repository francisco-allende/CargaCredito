import {useCallback} from 'react';
import {Platform} from 'react-native';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';

// Constantes
const PERMISSION_TYPES = {
  CAMERA: 'camera',
};

const PERMISSION_RESULTS = {
  UNAVAILABLE: 'unavailable',
  DENIED: 'denied',
  GRANTED: 'granted',
  BLOCKED: 'blocked',
  LIMITED: 'limited',
};

const isIos = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

const usePermissions = typeOfPermission => {
  const getPermission = useCallback(() => {
    // Validar que el tipo de permiso exista
    if (
      !typeOfPermission ||
      !Object.values(PERMISSION_TYPES).includes(typeOfPermission)
    ) {
      throw new Error('Tipo de permiso no soportado.');
    }

    if (isIos) {
      switch (typeOfPermission) {
        case PERMISSION_TYPES.CAMERA:
          return PERMISSIONS.IOS.CAMERA;
        default:
          return PERMISSIONS.IOS.CAMERA;
      }
    }

    if (isAndroid) {
      switch (typeOfPermission) {
        case PERMISSION_TYPES.CAMERA:
          return PERMISSIONS.ANDROID.CAMERA;
        default:
          return PERMISSIONS.ANDROID.CAMERA;
      }
    }

    throw new Error('Sistema operativo no soportado.');
  }, [typeOfPermission]);

  const askPermissions = useCallback(async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await request(getPermission());

        switch (result) {
          case RESULTS.UNAVAILABLE:
            reject({
              type: RESULTS.UNAVAILABLE,
            });
            break;
          case RESULTS.DENIED:
            reject({
              type: RESULTS.DENIED,
            });
            break;
          case RESULTS.GRANTED:
            resolve({
              type: RESULTS.GRANTED,
            });
            break;
          case RESULTS.BLOCKED:
            reject({
              type: RESULTS.BLOCKED,
            });
            break;
          case RESULTS.LIMITED:
            resolve({
              type: RESULTS.LIMITED,
            });
            break;
        }
      } catch (error) {
        reject({
          isError: true,
          errorMessage:
            error?.data?.message ||
            error.message ||
            'Error al solicitar permisos.',
        });
      }
    });
  }, [getPermission]);

  return {
    askPermissions,
  };
};

export {usePermissions, PERMISSION_TYPES, PERMISSION_RESULTS};
