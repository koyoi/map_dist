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
  }, [isAutoUpdateEnabled, point1?.isCurrentLocation]);

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
          if (!selectedPoint.isCurrentLocation) {
            setIsAutoUpdateEnabled(false);
          }
        } else if (pointType === 'point2') {
          setPoint2(selectedPoint);
        }
        navigation.setParams({ selectedPoint: undefined, pointType: undefined });
      }
    }, [route.params, navigation])
  );

  return (
    <View style={distanceCalculatorStyles.container}>
      <Text style={distanceCalculatorStyles.title}>地点1なのだ</Text>
      <View style={distanceCalculatorStyles.pointContainer}>
        <Text style={distanceCalculatorStyles.pointText}>
          {point1 ? `${point1.name} (${point1.latitude.toFixed(4)}, ${point1.longitude.toFixed(4)})` : '未選択なのだ'}
        </Text>
        <View style={distanceCalculatorStyles.buttonRow}>
          <Button
            title="現在地を選択なのだ"
            onPress={setCurrentLocationForPoint1}
            disabled={isLoadingLocation}
          />
          {isLoadingLocation && <ActivityIndicator size="small" color="#0000ff" style={{ marginLeft: 5 }} />}
          <View style={distanceCalculatorStyles.switchContainer}>
            <Text>自動更新なのだ</Text>
            <Switch
              onValueChange={setIsAutoUpdateEnabled}
              value={isAutoUpdateEnabled}
              disabled={!point1?.isCurrentLocation}
            />
          </View>
        </View>
        <View style={distanceCalculatorStyles.buttonRow}>
          <Button
            title="地図から選択なのだ"
            onPress={() => navigation.navigate('MapPicker', { pointType: 'point1' })}
          />
          <Button
            title="名称から選択なのだ"
            onPress={() => navigation.navigate('NameSearch', { pointType: 'point1' })}
          />
        </View>
      </View>

      <Text style={distanceCalculatorStyles.title}>地点2なのだ</Text>
      <View style={distanceCalculatorStyles.pointContainer}>
        <Text style={distanceCalculatorStyles.pointText}>
          {point2 ? `${point2.name} (${point2.latitude.toFixed(4)}, ${point2.longitude.toFixed(4)})` : '未選択なのだ'}
        </Text>
        <View style={distanceCalculatorStyles.buttonRow}>
          <Button
            title="地図から選択なのだ"
            onPress={() => navigation.navigate('MapPicker', { pointType: 'point2' })}
          />
          <Button
            title="名称から選択なのだ"
            onPress={() => navigation.navigate('NameSearch', { pointType: 'point2' })}
          />
        </View>
      </View>

      <View style={distanceCalculatorStyles.distanceContainer}>
        <Text style={distanceCalculatorStyles.distanceLabel}>2地点間の距離なのだ:</Text>
        <Text style={distanceCalculatorStyles.distanceValue}>
          {distance > 0 ? `${(distance / 1000).toFixed(2)} km` : '---'}
        </Text>
      </View>
    </View>
  );
}

export default DistanceCalculatorScreen;
