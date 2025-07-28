import { StyleSheet, Dimensions } from 'react-native';

export const distanceCalculatorStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  pointContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pointText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  distanceContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  distanceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 5,
  },
  distanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d40',
  },
});

export const mapPickerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationNameText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export const nameSearchStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
  },
  sortLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  picker: {
    flex: 1,
    height: 40,
  },
  loader: {
    marginTop: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  resultsList: {
    marginTop: 10,
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultCoords: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  resultDistance: {
    fontSize: 14,
    color: '#00796b',
    marginTop: 5,
  },
  resultPrefecture: {
    fontSize: 14,
    color: '#00796b',
    marginTop: 5,
  },
});
