// App.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// 分割したコンポーネント、フック、ユーティリティ、スタイルをインポートするのだ
import CustomMessageBox from './components/CustomMessageBox';
import useMapLogic from './hooks/useMapLogic';
import { AUTO_UPDATE_INTERVAL_MS } from './constants/appConstants';
import appStyles from './styles/appStyles'; // スタイルをインポートするのだ

export default function App() {
  // メッセージボックスの状態はApp.jsで管理するのだ
  const [messageBoxVisible, setMessageBoxVisible] = useState(false);
  const [messageBoxMessage, setMessageBoxMessage] = useState('');
  const [messageBoxType, setMessageBoxType] = useState('info');

  // カスタムメッセージボックスを表示する関数なのだ
  const showMessageBox = (message, type = 'info') => {
    setMessageBoxMessage(message);
    setMessageBoxType(type);
    setMessageBoxVisible(true);
  };

  // カスタムメッセージボックスを閉じる関数なのだ
  const closeMessageBox = () => {
    setMessageBoxVisible(false);
  };

  // カスタムフックから地図ロジックと状態を取得するのだ
  const {
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
    toggleAutoUpdateLogic, // フック内のロジック関数を呼び出すのだ
    calculateDistance, // フックから距離計算関数も取得するのだ
    reverseGeocode // フックから逆ジオコーディング関数も取得するのだ
  } = useMapLogic(showMessageBox); // showMessageBox関数をフックに渡すのだ

  // location1またはlocation2が変更されたときに距離を再計算するのだ
  useEffect(() => {
    calculateDistance();
  }, [location1, location2, calculateDistance]); // calculateDistanceも依存配列に入れるのだ

  return (
    <View style={appStyles.container}>
      <Text style={appStyles.title}>地図距離計算アプリ (React Native版) なのだ</Text>

      {/* 地図表示エリアなのだ */}
      <MapView
        ref={mapRef}
        style={appStyles.map}
        initialRegion={{
          latitude: 35.681236, // 東京駅を初期中心にするのだ
          longitude: 139.767125,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={onMapPress} // 地図のタップイベントを処理するのだ
      >
        {location1 && (
          <Marker
            coordinate={location1}
            title="地点1"
            description={address1}
            pinColor="red" // デフォルトの赤色マーカーなのだ
          />
        )}
        {location2 && (
          <Marker
            coordinate={location2}
            title="地点2"
            description={address2}
            pinColor="purple" // 紫色のマーカーなのだ
          />
        )}
      </MapView>

      {/* コントロールパネルなのだ */}
      <View style={appStyles.controlPanelContainer}>
        {/* 地点1のコントロールなのだ */}
        <View style={appStyles.pointContainer}>
          <Text style={appStyles.pointTitle}>地点1なのだ</Text>
          <TouchableOpacity
            style={appStyles.button}
            onPress={handleUseCurrentLocation}
            disabled={loading} // ローディング中は無効にするのだ
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={appStyles.buttonText}>現在地を地点1に設定するのだ</Text>
            )}
          </TouchableOpacity>
          <View style={appStyles.switchContainer}>
            <Text style={appStyles.switchLabel}>現在地を自動更新するのだ</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={autoUpdateEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleAutoUpdateLogic} // フック内のロジック関数を呼び出すのだ
              value={autoUpdateEnabled}
            />
          </View>
          <Text style={appStyles.locationText}>緯度: {location1 ? location1.latitude.toFixed(6) : '--'}</Text>
          <Text style={appStyles.locationText}>経度: {location1 ? location1.longitude.toFixed(6) : '--'}</Text>
          <Text style={appStyles.addressText}>住所: {address1}</Text>
        </View>

        {/* 地点2のコントロールなのだ */}
        <View style={appStyles.pointContainer}>
          <Text style={appStyles.pointTitle}>地点2なのだ</Text>
          <View style={appStyles.buttonPlaceholder} /> {/* ボタンの高さ合わせなのだ */}
          <Text style={appStyles.locationText}>緯度: {location2 ? location2.latitude.toFixed(6) : '--'}</Text>
          <Text style={appStyles.locationText}>経度: {location2 ? location2.longitude.toFixed(6) : '--'}</Text>
          <Text style={appStyles.addressText}>住所: {address2}</Text>
        </View>
      </View>

      {/* 距離表示エリアなのだ */}
      <View style={appStyles.distanceContainer}>
        <Text style={appStyles.distanceTitle}>2点間の距離なのだ</Text>
        <Text style={appStyles.distanceResult}>{distance} km</Text>
      </View>

      {/* カスタムメッセージボックスなのだ */}
      <CustomMessageBox
        visible={messageBoxVisible}
        message={messageBoxMessage}
        type={messageBoxType}
        onClose={closeMessageBox}
      />
    </View>
  );
}
