import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { calculateDistance, reverseGeocode } from '../utils/locationHelpers';
import { distanceCalculatorStyles } from '../styles/styles';
import MapView, { Marker, Polyline } from 'react-native-maps';

function formatJapaneseAddress(address) {
  if (!address) return '';
  // 必要に応じて要素を追加・順序調整
  return [
    address.state,         // 都道府県
    address.city,          // 市区町村
    address.town || address.suburb, // 町・丁目
    address.road,          // 通り
    address.house_number   // 番地
  ].filter(Boolean).join('');
}

function DistanceCalculatorScreen({ navigation, route }) {
  const [point1, setPoint1] = useState(null);
  const [point2, setPoint2] = useState(null);
  const [isAutoUpdateEnabled, setIsAutoUpdateEnabled] = useState(false);
  const [distance, setDistance] = useState(0);
  const [locationWatcher, setLocationWatcher] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    if (point1 && point2) {
      const dist = calculateDistance(
        point1.latitude,
        point1.longitude,
        point2.latitude,
        point2.longitude
      );
      setDistance(dist);
    } else {
      setDistance(0);
    }
  }, [point1, point2]);

  useEffect(() => {
    const setupLocationWatcher = async () => {
      if (isAutoUpdateEnabled && point1?.isCurrentLocation) {
        setIsLoadingLocation(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('位置情報権限がないのだ', '現在地を自動更新するには位置情報権限が必要なのだ。');
          setIsAutoUpdateEnabled(false);
          setIsLoadingLocation(false);
          return;
        }

        const watcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          async (newLocation) => {
            const { latitude, longitude } = newLocation.coords;
            const name = await reverseGeocode(latitude, longitude);
            setPoint1({ latitude, longitude, name, isCurrentLocation: true });
            setIsLoadingLocation(false);
          }
        );
        setLocationWatcher(watcher);
      } else {
        if (locationWatcher) {
          locationWatcher.remove();
          setLocationWatcher(null);
        }
        setIsLoadingLocation(false);
      }
    };

    setupLocationWatcher();

    return () => {
      if (locationWatcher) {
        locationWatcher.remove();
      }
    };
  }, [isAutoUpdateEnabled, point1?.isCurrentLocation,locationWatcher]);

  const setCurrentLocationForPoint1 = async () => {
    setIsLoadingLocation(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('位置情報権限がないのだ', '現在地を取得するには位置情報権限が必要なのだ。');
      setIsLoadingLocation(false);
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const name = await reverseGeocode(latitude, longitude);
      setPoint1({ latitude, longitude, name, isCurrentLocation: true });
    } catch (error) {
      console.error('現在地取得エラーなのだ:', error);
      Alert.alert('現在地取得エラーなのだ', '現在地を取得できなかったのだ。');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (route.params?.selectedPoint) {
        const { selectedPoint, pointType } = route.params;
        if (pointType === 'point1') {
          setPoint1(selectedPoint);
          setPoint2(route.params.point2 || point2);
          if (!selectedPoint.isCurrentLocation) {
            setIsAutoUpdateEnabled(false);
          }
        } else if (pointType === 'point2') {
          setPoint1(route.params.point1 || point1);
          setPoint2(selectedPoint);
        }
        navigation.setParams({ selectedPoint: undefined, pointType: undefined });
      }
    }, [route.params, navigation, point1, point2])
  );

  return (
    <View style={distanceCalculatorStyles.container}>
      <Text style={distanceCalculatorStyles.title}>あと何メートル？</Text>
      <View style={distanceCalculatorStyles.pointContainer}>
        <View style={distanceCalculatorStyles.buttonRow}>
          <View>
            <Button
              title="現在地を始点にする"
              onPress={setCurrentLocationForPoint1}
              disabled={isLoadingLocation}
            />
            {isLoadingLocation && <ActivityIndicator size="small" color="#0000ff" style={{ marginLeft: 5 }} />}
            <View style={distanceCalculatorStyles.switchContainer}>
              <Text>自動更新する</Text>
              <Switch
                onValueChange={setIsAutoUpdateEnabled}
                value={isAutoUpdateEnabled}
                disabled={!point1?.isCurrentLocation}
              />
            </View>
          </View>
          <View style={distanceCalculatorStyles.button}>
            <Button
              title="地図から選択"
              onPress={() => navigation.navigate('MapPicker', {
                pointType: 'point1',
                point1,
                point2,
                onSelect: (selectedPoint) => {
                  setPoint1(selectedPoint);
                  setIsAutoUpdateEnabled(false);
                }
              })}
            />
          </View>
          <View style={distanceCalculatorStyles.button}>
            <Button
              title="名称から選択"
              onPress={() => navigation.navigate('NameSearch', { pointType: 'point1', point1, point2 })}
            />
          </View>
        </View>
        <Text style={distanceCalculatorStyles.pointText}>
          {point1 ? `${formatJapaneseAddress(point1.address) || point1.name} (${point1.latitude.toFixed(4)}, ${point1.longitude.toFixed(4)})` : '未選択'}
        </Text>
      </View>

      <Text style={distanceCalculatorStyles.midashi_center}>⇓</Text>

      <View style={distanceCalculatorStyles.pointContainer}>
        <View style={distanceCalculatorStyles.buttonRow}>
          <Button
            title="現在地を終点にする"
            onPress={null}
            disabled={true}
          />
          <Button
            title="地図から選択"
            onPress={() => navigation.navigate('MapPicker', {
              pointType: 'point2',
              point1,
              point2,
              onSelect: (selectedPoint) => {
                setPoint2(selectedPoint);
              }
            })}
          />
          <Button
            title="名称から選択"
            onPress={() => navigation.navigate('NameSearch', { pointType: 'point2', point1, point2 })}
          />
        </View>
        <Text style={distanceCalculatorStyles.pointText}>
          {point2 ? `${formatJapaneseAddress(point2.address) || point2.name} (${point2.latitude.toFixed(4)}, ${point2.longitude.toFixed(4)})` : '未選択'}
        </Text>
      </View>

      <View style={distanceCalculatorStyles.distanceContainer}>
        <View style={distanceCalculatorStyles.buttonRow}>
          <Text style={distanceCalculatorStyles.distanceLabel}>2地点間の距離:　</Text>
          <Text style={distanceCalculatorStyles.distanceValue}>
            {distance > 0 ? `${(distance / 1000).toFixed(2)} km` : '---'}
          </Text>
        </View>
      </View>

      {/* 地図表示エリア */}
      <View style={{ height: 300, marginTop: 20, borderRadius: 10, overflow: 'hidden' }}>
        <MapView
          style={{ flex: 1 }}
          provider={undefined}
          initialRegion={{
            latitude: point1 && point2
              ? (point1.latitude + point2.latitude) / 2
              : 36.2048, // 日本の中心
            longitude: point1 && point2
              ? (point1.longitude + point2.longitude) / 2
              : 138.2529,
            latitudeDelta: point1 && point2
              ? Math.abs(point1.latitude - point2.latitude) * 2.5 + 0.05
              : 10,
            longitudeDelta: point1 && point2
              ? Math.abs(point1.longitude - point2.longitude) * 2.5 + 0.05
              : 10,
          }}
          region={point1 && point2 ? {
            latitude: (point1.latitude + point2.latitude) / 2,
            longitude: (point1.longitude + point2.longitude) / 2,
            latitudeDelta: Math.abs(point1.latitude - point2.latitude) * 2.5 + 0.05,
            longitudeDelta: Math.abs(point1.longitude - point2.longitude) * 2.5 + 0.05,
          } : undefined}
        >
          {point1 && (
            <Marker
              coordinate={{ latitude: point1.latitude, longitude: point1.longitude }}
              title={point1.name || '地点1'}
              pinColor="blue"
            />
          )}
          {point2 && (
            <Marker
              coordinate={{ latitude: point2.latitude, longitude: point2.longitude }}
              title={point2.name || '地点2'}
              pinColor="red"
            />
          )}
          {point1 && point2 && (
            <Polyline
              coordinates={[
                { latitude: point1.latitude, longitude: point1.longitude },
                { latitude: point2.latitude, longitude: point2.longitude },
              ]}
              strokeColor="#00796b"
              strokeWidth={4}
            />
          )}
        </MapView>
      </View>
    </View>
  );
}

export default DistanceCalculatorScreen;
