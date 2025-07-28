import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { calculateDistance } from '../utils/locationHelpers';
import { nameSearchStyles } from '../styles/styles';

function NameSearchScreen({ navigation, route }) {
  const { pointType } = route.params;
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState('none');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLocationLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('位置情報権限がないのだ', '現在地からの距離でソートするには位置情報権限が必要なのだ。');
        setIsLocationLoading(false);
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
      } catch (error) {
        console.error('現在地取得エラーなのだ:', error);
        Alert.alert('現在地取得エラーなのだ', '現在地を取得できなかったのだ。距離でソートできないのだ。');
      } finally {
        setIsLocationLoading(false);
      }
    })();
  }, []);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert('検索キーワードを入力なのだ', '地名、駅名、ランドマーク名を入力するのだ。');
      return;
    }

    setIsLoading(true);
    setSearchResults([]);

    try {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=20&addressdetails=1&accept-language=ja`,
        {
          headers: {
            'User-Agent': 'mapdist/0.1 (koyoi.jhl@g,ail.com)',
            'Referer': 'https://github.com/koyoi/map_dist',
          },
        }
    );
    const text = await response.text(); // まずテキストで取得
    try {
        const data = JSON.parse(text); // JSONとしてパース
        if (data && data.length > 0) {
        const mappedResults = data.map((item) => ({
            id: item.osm_id,
            name: item.display_name,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            address: item.address,
        }));
        setSearchResults(mappedResults);
        } else {
        Alert.alert('検索結果なしなのだ', '指定された名称の地点は見つからなかったのだ。');
        }
    } catch (jsonError) {
        console.error('JSONパースエラーなのだ:', jsonError);
        console.error('レスポンス内容なのだ:', text); // ここでHTML等が出力されるはず
        Alert.alert('検索エラーなのだ', 'レスポンスがJSONではなかったのだ。詳細はコンソールを確認なのだ。');
    }
    } catch (error) {
    console.error('検索エラーなのだ:', error);
    Alert.alert('検索エラーなのだ', '地点の検索中にエラーが発生したのだ。');
    } finally {
      setIsLoading(false);
    }
  };

  const sortAndFilterResults = useCallback(() => {
    let sorted = [...searchResults];

    if (sortOption === 'prefecture') {
      sorted.sort((a, b) => {
        const prefA = a.address?.state || a.address?.county || '';
        const prefB = b.address?.state || b.address?.county || '';
        return prefA.localeCompare(prefB, 'ja');
      });
    } else if (sortOption === 'distance' && currentLocation) {
      sorted.sort((a, b) => {
        const distA = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          a.latitude,
          a.longitude
        );
        const distB = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          b.latitude,
          b.longitude
        );
        return distA - distB;
      });
    }
    return sorted;
  }, [searchResults, sortOption, currentLocation]);

  const sortedDisplayResults = sortAndFilterResults();

  const handleSelectPoint = (item) => {
    navigation.navigate('DistanceCalculator', {
      selectedPoint: {
        latitude: item.latitude,
        longitude: item.longitude,
        name: item.name,
        isCurrentLocation: false,
      },
      pointType: pointType,
    });
  };

  return (
    <View style={nameSearchStyles.container}>
      <TextInput
        style={nameSearchStyles.input}
        placeholder="地名、駅名、ランドマーク名を入力なのだ"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch}
      />
      <Button title="検索なのだ" onPress={handleSearch} disabled={isLoading} />

      <View style={nameSearchStyles.sortContainer}>
        <Text style={nameSearchStyles.sortLabel}>ソートオプションなのだ:</Text>
        <Picker
          selectedValue={sortOption}
          style={nameSearchStyles.picker}
          onValueChange={(itemValue) => setSortOption(itemValue)}
        >
          <Picker.Item label="デフォ" value="none" />
          <Picker.Item label="都道府県別" value="prefecture" />
          <Picker.Item
            label="距離順"
            value="distance"
            disabled={!currentLocation || isLocationLoading}
          />
        </Picker>
      </View>

      {isLoading && <ActivityIndicator size="large" color="#0000ff" style={nameSearchStyles.loader} />}
      {isLocationLoading && sortOption === 'distance' && (
        <Text style={nameSearchStyles.loadingText}>現在地を取得中なのだ...</Text>
      )}

      <FlatList
        data={sortedDisplayResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={nameSearchStyles.resultItem} onPress={() => handleSelectPoint(item)}>
            <Text style={nameSearchStyles.resultName}>{item.name}</Text>
            <Text style={nameSearchStyles.resultCoords}>
              ({item.latitude.toFixed(4)}, {item.longitude.toFixed(4)})
            </Text>
            {sortOption === 'distance' && currentLocation && (
              <Text style={nameSearchStyles.resultDistance}>
                距離: {(calculateDistance(currentLocation.latitude, currentLocation.longitude, item.latitude, item.longitude) / 1000).toFixed(2)} km
              </Text>
            )}
            {sortOption === 'prefecture' && item.address && (item.address.state || item.address.county) && (
              <Text style={nameSearchStyles.resultPrefecture}>
                {item.address.state || item.address.county}
              </Text>
            )}
          </TouchableOpacity>
        )}
        style={nameSearchStyles.resultsList}
      />
    </View>
  );
}

export default NameSearchScreen;
