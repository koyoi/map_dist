// App.js (プロジェクトのルートに配置するのだ)
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  Switch,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // @react-native-picker/picker を使用するのだ
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import MapView, { Marker, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import DistanceCalculatorScreen from './src/components/DistanceCalculatorScreen';
import MapPickerScreen from './src/components/MapPickerScreen';
import NameSearchScreen from './src/components/NameSearchScreen';

// グローバルなヘルパー関数なのだ
/**
 * Haversineの公式を使用して2点間の距離を計算するのだ。
 * @param {number} lat1 - 地点1の緯度
 * @param {number} lon1 -       経度
 * @param {number} lat2 - 地点2
 * @param {number} lon2 - 
 * @returns {number} 2点間の距離（メートル）なのだ。
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // 地球の半径（メートル）なのだ
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ はラジアンに変換するのだ
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // メートル単位なのだ
  return distance; // メートルを返すのだ
};

/**
 * 座標を地名に逆ジオコーディングするのだ（Nominatim APIを使用）。
 * @param {number} latitude - 緯度なのだ。
 * @param {number} longitude - 経度なのだ。
 * @returns {Promise<string>} 地点名、または「不明な地点なのだ」なのだ。
 */
const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=ja`,
        {
          headers: {
            'User-Agent': 'mapdist/0.1 (koyoi.jhl@g,ail.com)',
            'Referer': 'https://github.com/koyoi/map_dist',
          },
        }
    );
    const data = await response.json();
    if (data && data.display_name) {
      return data.display_name;
    }
  } catch (error) {
    console.error('逆ジオコーディングエラーなのだ:', error);
  }
  return '不明な地点なのだ';
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DistanceCalculator">
        <Stack.Screen
          name="DistanceCalculator"
          component={DistanceCalculatorScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MapPicker"
          component={MapPickerScreen}
          options={{ title: '地図から地点を選択' }}
        />
        <Stack.Screen
          name="NameSearch"
          component={NameSearchScreen}
          options={{ title: '名称から地点を検索' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
