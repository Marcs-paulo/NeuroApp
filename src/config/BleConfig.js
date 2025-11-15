import { useState, useCallback } from "react";
import { BleManager } from "react-native-ble-plx";
import { Platform, PermissionsAndroid } from "react-native";

export const SERVICE_UUID = '8f3b6fcf-6d12-437f-8b68-9a3494fbe656';
export const CHARACTERISTIC_UUID = 'd5593e6b-3328-493a-b3c9-9814683d8e40';

export const bleManager = new BleManager();

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    console.log('[BLE] Permissões Android:', granted);
    return granted;
  }
};

export const useBLEConnection = () => {
  const [device, setDevice] = useState(null);
  const [connected, setConnected] = useState(false);
  const [scanning, setScanning] = useState(false);

  // Conecta manualmente
  const connectESP = useCallback(async () => {
    await requestPermissions();

    setScanning(true);
    const foundDevices = [];

    console.log('[BLE] Iniciando scan...');
    bleManager.startDeviceScan(null, null, (error, dev) => {
      if (error) {
        console.log('[BLE] Erro no scan:', error);
        setScanning(false);
        return;
      }

      if (dev && dev.name && !foundDevices.find(d => d.id === dev.id)) {
        foundDevices.push(dev);
        console.log('[BLE] Dispositivo encontrado:', dev.name);
      }
    });

    // Para scan após 5s
    setTimeout(async () => {
      bleManager.stopDeviceScan();
      setScanning(false);

      const espDevice = foundDevices.find(d => d.name.includes('Neuro_Robot')) || foundDevices[0];
      if (!espDevice) {
        console.log('[BLE] Nenhum dispositivo ESP encontrado');
        return;
      }

      try {
        const connectedDevice = await bleManager.connectToDevice(espDevice.id);
        await connectedDevice.discoverAllServicesAndCharacteristics();
        setDevice(connectedDevice);
        setConnected(true);
        console.log('[BLE] ✅ ESP conectada com sucesso:', connectedDevice.name);

        // Monitorar desconexão
        connectedDevice.onDisconnected(() => {
          console.log('[BLE] ⚠️ Dispositivo desconectado');
          setDevice(null);
          setConnected(false);
        });
      } catch (e) {
        console.log('[BLE] ❌ Falha ao conectar:', e);
      }
    }, 5000);

  }, []);

  // Desconecta manualmente
  const disconnectESP = useCallback(async () => {
    if (!device) return;

    try {
      await bleManager.cancelDeviceConnection(device.id);
      console.log('[BLE] ESP desconectada manualmente');
    } catch (e) {
      console.log('[BLE] Erro ao desconectar:', e);
    } finally {
      setDevice(null);
      setConnected(false);
    }
  }, [device]);

  return { device, connected, scanning, connectESP, disconnectESP };
};
