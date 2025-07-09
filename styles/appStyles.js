// styles/appStyles.js
import { StyleSheet } from 'react-native';

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8', // bg-gray-100
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24, // text-3xl
    fontWeight: 'bold', // font-bold
    textAlign: 'center',
    marginBottom: 24, // mb-6
    color: '#1f2937', // text-gray-800
  },
  map: {
    width: '100%',
    height: 300, // height: 500px だったが、画面に収まるように調整したのだ
    borderRadius: 12, // rounded-xl
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Androidの影なのだ
    marginBottom: 24, // mb-6
  },
  controlPanelContainer: {
    flexDirection: 'column', // md:grid-cols-2 の代わりに縦に並べるのだ
    width: '100%',
    gap: 24, // gap-6
    marginBottom: 24, // mb-6
  },
  pointContainer: {
    backgroundColor: '#eff6ff', // bg-blue-50 または bg-purple-50
    padding: 20, // p-5
    borderRadius: 8, // rounded-lg
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2, // Androidの影なのだ
    borderColor: '#bfdbfe', // border-blue-200
    borderWidth: 1,
  },
  pointTitle: {
    fontSize: 20, // text-xl
    fontWeight: '600', // font-semibold
    marginBottom: 12, // mb-3
    color: '#1e40af', // text-blue-800 または text-purple-800
  },
  button: {
    width: '100%',
    paddingVertical: 12, // py-2
    paddingHorizontal: 16, // px-4
    backgroundColor: '#22c55e', // bg-green-500
    borderRadius: 6, // rounded-md
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12, // mb-3
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff', // text-white
    fontWeight: '600', // font-semibold
  },
  buttonPlaceholder: {
    height: 40, // ボタンの高さに合わせるのだ
    marginBottom: 12, // mb-3
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12, // mb-3
  },
  switchLabel: {
    color: '#374151', // text-gray-700
    fontWeight: '500', // font-medium
  },
  locationText: {
    fontSize: 14, // text-sm
    color: '#4b5563', // text-gray-600
    marginBottom: 8, // mb-2
  },
  addressText: {
    fontSize: 14, // text-sm
    color: '#4b5563', // text-gray-600
  },
  distanceContainer: {
    backgroundColor: '#4f46e5', // bg-indigo-600
    padding: 24, // p-6
    borderRadius: 12, // rounded-xl
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    width: '100%',
  },
  distanceTitle: {
    fontSize: 20, // text-2xl
    fontWeight: 'bold', // font-bold
    marginBottom: 8, // mb-2
    color: '#fff', // text-white
  },
  distanceResult: {
    fontSize: 36, // text-4xl
    fontWeight: '800', // font-extrabold
    color: '#fff', // text-white
  },
});

export default appStyles;
