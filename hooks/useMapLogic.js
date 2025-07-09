// hooks/useMapLogic.js
import { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import { calculateDistance, toRadians } from '../utils/geoUtils.js'; // ユーティリティ関数をインポートするのだ
import { AUTO_UPDATE_INTERVAL_MS } from '../constants/appConstants'; // 定数をインポートするのだ

const useMapLogic = (showMessageBox) => {
  const [location1, setLocation1] = useState(null);
  const [location2, setLocation2] = useState(null);
  const [address1, setAddress1] = useState('地図をタップして選択するのだ');
  const [address2, setAddress2] = useState('地図をタップして選択するのだ');
  const [distance, setDistance] = useState('--');
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);
  const autoUpdateIntervalId = useRef(null);

  // 位置情報パーミッションを要求するのだ
  const requestLocationPermissions = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      showMessageBox(
        '位置情報へのアクセスが拒否されたのだ。設定から許可してくださいなのだ。',
        'error'
      );
      return false;
    }
    return true;
  }, [showMessageBox]);

  // 現在地を取得するのだ
  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) {
      setLoading(false);
      return null;
    }

    try {
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
      });
      setLoading(false);
      return {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
    } catch (error) {
      setLoading(false);
      showMessageBox(
        `現在地の取得に失敗したのだ: ${error.message || '不明なエラーなのだ'}`,
        'error'
      );
      console.error('現在地取得エラー:', error);
      return null;
    }
  }, [requestLocationPermissions, showMessageBox]);

  // 逆ジオコーディングを行うのだ (Nominatimを使用するのだ)
  const reverseGeocode = useCallback(async (lat, lng, setAddressCallback) => {
    setAddressCallback('住所を取得中...なのだ');
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'MapDistanceApp/1.0 (your-email@example.com)', // 実際のアプリ名とメールアドレスに置き換えるのだ
        },
      });
      const data = await response.json();
      if (data.display_name) {
        setAddressCallback(data.display_name);
      } else {
        setAddressCallback('住所が見つからなかったのだ');
        console.error('逆ジオコーディングエラー: 住所が見つからなかったのだ。', data);
      }
    } catch (error) {
      setAddressCallback('住所取得エラーなのだ');
      showMessageBox('逆ジオコーディング中にエラーが発生したのだ。ネットワーク接続を確認するのだ。', 'error');
      console.error('逆ジオコーディングのフェッチエラー:', error);
    }
  }, [showMessageBox]);

  // 地図のタップイベントハンドラなのだ
  const onMapPress = useCallback(async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    if (!location1) {
      setLocation1({ latitude, longitude });
      reverseGeocode(latitude, longitude, setAddress1);
    } else if (!location2) {
      setLocation2({ latitude, longitude });
      reverseGeocode(latitude, longitude, setAddress2);
    } else {
      // 両方設定済みの場合は、地点1を更新するのだ
      setLocation1({ latitude, longitude });
      reverseGeocode(latitude, longitude, setAddress1);
      setLocation2(null); // 地点2をリセットするのだ
      setAddress2('地図をタップして選択するのだ');
    }
  }, [location1, location2, reverseGeocode]);

  // 「現在地を地点1に設定」ボタンのハンドラなのだ
  const handleUseCurrentLocation = useCallback(async () => {
    showMessageBox('現在地を取得中...なのだ', 'info');
    const currentLoc = await getCurrentLocation();
    if (currentLoc) {
      setLocation1(currentLoc);
      reverseGeocode(currentLoc.latitude, currentLoc.longitude, setAddress1);
      // 地図の中心を現在地にするのだ
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: currentLoc.latitude,
            longitude: currentLoc.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          1000
        );
      }
      showMessageBox('現在地が地点1に設定されたのだ！', 'success');
    }
  }, [getCurrentLocation, reverseGeocode, showMessageBox]);

  // 自動更新スイッチの切り替えハンドラなのだ
  const toggleAutoUpdateLogic = useCallback(async (value) => {
    setAutoUpdateEnabled(value);
    if (value) {
      showMessageBox('現在地の自動更新を開始するのだ。', 'info');
      // 初回更新なのだ
      const currentLoc = await getCurrentLocation();
      if (currentLoc) {
        setLocation1(currentLoc);
        reverseGeocode(currentLoc.latitude, currentLoc.longitude, setAddress1);
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: currentLoc.latitude,
              longitude: currentLoc.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            },
            1000
          );
        }
      }
      // 定期更新なのだ
      autoUpdateIntervalId.current = setInterval(async () => {
        const updatedLoc = await getCurrentLocation();
        if (updatedLoc) {
          setLocation1(updatedLoc);
          reverseGeocode(updatedLoc.latitude, updatedLoc.longitude, setAddress1);
        }
      }, AUTO_UPDATE_INTERVAL_MS);
    } else {
      if (autoUpdateIntervalId.current) {
        clearInterval(autoUpdateIntervalId.current);
        autoUpdateIntervalId.current = null;
        showMessageBox('現在地の自動更新を停止したのだ。', 'info');
      }
    }
  }, [getCurrentLocation, reverseGeocode, showMessageBox]);

  // コンポーネントがアンマウントされるときにインターバルをクリアするのだ
  useEffect(() => {
    return () => {
      if (autoUpdateIntervalId.current) {
        clearInterval(autoUpdateIntervalId.current);
      }
    };
  }, []);

  // 距離計算関数をフックの外に公開するのだ
  const calculateDistanceCallback = useCallback(() => {
    if (location1 && location2) {
      const dist = calculateDistance(location1, location2); // ユーティリティ関数を呼び出すのだ
      setDistance(`${dist.toFixed(2)} km`);
    } else {
      setDistance('--');
    }
  }, [location1, location2]);


  return {
    location1,
    setLocation1,
    location2,
    setLocation2,
    address1,
    setAddress1,
    address2,
    setAddress2,
    distance,
    setDistance,
    autoUpdateEnabled,
    setAutoUpdateEnabled,
    loading,
    setLoading,
    mapRef,
    onMapPress,
    handleUseCurrentLocation,
    toggleAutoUpdateLogic,
    calculateDistance: calculateDistanceCallback, // 名前を変えてエクスポートするのだ
    reverseGeocode // 逆ジオコーディング関数もエクスポートするのだ
  };
};

export default useMapLogic;
