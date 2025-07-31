import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { reverseGeocode } from '../utils/locationHelpers';
import { mapPickerStyles } from '../styles/styles';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function MapPickerScreen({ navigation, route }) {
  const { pointType } = route.params;
  const [region, setRegion] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationName, setLocationName] = useState('地点を選択中なのだ...');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('位置情報権限がないのだ', '地図を表示するには位置情報権限が必要なのだ。');
        setIsLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        const initialRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        setRegion(initialRegion);
        setSelectedLocation({
          latitude: initialRegion.latitude,
          longitude: initialRegion.longitude,
        });
        const name = await reverseGeocode(initialRegion.latitude, initialRegion.longitude);
        setLocationName(name);
      } catch (error) {
        console.error('現在地取得エラーなのだ:', error);
        Alert.alert('現在地取得エラーなのだ', '現在地を取得できなかったのだ。デフォルトの位置を表示するのだ。');
        const defaultRegion = {
          latitude: 35.681236,
          longitude: 139.767125,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        setRegion(defaultRegion);
        setSelectedLocation({
          latitude: defaultRegion.latitude,
          longitude: defaultRegion.longitude,
        });
        const name = await reverseGeocode(defaultRegion.latitude, defaultRegion.longitude);
        setLocationName(name);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleRegionChangeComplete = async (newRegion) => {
    setSelectedLocation({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    });
    const name = await reverseGeocode(newRegion.latitude, newRegion.longitude);
    setLocationName(name);
  };

  const handleSelectLocation = () => {
    if (selectedLocation) {
      // 既存の地点情報を保持するため、route.paramsからpoint1/point2も引き継ぐ
      const extraParams = {};
      if (route.params?.point1) extraParams.point1 = route.params.point1;
      if (route.params?.point2) extraParams.point2 = route.params.point2;
      navigation.navigate({
        name: 'DistanceCalculator',
        params: { selectedPoint: { ...selectedLocation, name: locationName }, pointType, ...extraParams },
        merge: true,
      });
    } else {
      Alert.alert('地点が選択されていないのだ', '地図を動かして地点を選択するのだ。');
    }
  };

  if (isLoading || !region) {
    return (
      <View style={mapPickerStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>地図を読み込み中なのだ</Text>
      </View>
    );
  }

  return (
    <View style={mapPickerStyles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={mapPickerStyles.map}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={true}
        followsUserLocation={true}
        loadingEnabled={true}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="選択地点なのだ"
            description={locationName}
            draggable={false}
          />
        )}
      </MapView>
      <View style={mapPickerStyles.overlay}>
        <Text style={mapPickerStyles.locationNameText}>{locationName}</Text>
        <Button title="この地点を選択" onPress={handleSelectLocation} />
      </View>
    </View>
  );
}

export default MapPickerScreen;
