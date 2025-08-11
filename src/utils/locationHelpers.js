import * as Location from 'expo-location';

// グローバルなヘルパー関数なのだ
/**
 * Haversineの公式を使用して2点間の距離を計算するのだ。
 * @param {number} lat1 - 地点1の緯度なのだ。
 * @param {number} lon1 - 地点1の経度なのだ。
 * @param {number} lat2 - 地点2の緯度なのだ。
 * @param {number} lon2 - 地点2の経度なのだ。
 * @returns {number} 2点間の距離（メートル）なのだ。
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // 地球の半径（メートル）なのだ
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
};

/**
 * 座標を地名に逆ジオコーディングするのだ（Nominatim APIを使用）。
 * @param {number} latitude - 緯度なのだ。
 * @param {number} longitude - 経度なのだ。
 * @returns {Promise<string>} 地点名、または「不明な地点なのだ」なのだ。
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (results && results.length > 0) {
      const address = results[0];
      // 日本式住所を組み立てる例
      return [
        address.region,      // 都道府県
        address.city,        // 市区町村
        address.street,      // 通り
        address.name         // 番地や建物名
      ].filter(Boolean).join('');
    }
  } catch (error) {
    console.error('逆ジオコーディングエラーなのだ:', error);
  }
  return '不明な地点なのだ';
};
