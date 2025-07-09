// utils/geoUtils.js

// 度をラジアンに変換するヘルパー関数なのだ
export const toRadians = (degrees) => {
  return degrees * Math.PI / 180;
};

// 2点間の距離を計算する関数なのだ (ハーバサインの公式を使用するのだ)
export const calculateDistance = (loc1, loc2) => {
  const R = 6371; // 地球の半径 (km)なのだ
  const lat1Rad = toRadians(loc1.latitude);
  const lon1Rad = toRadians(loc1.longitude);
  const lat2Rad = toRadians(loc2.latitude);
  const lon2Rad = toRadians(loc2.longitude);

  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
