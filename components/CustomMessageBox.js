// components/CustomMessageBox.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';

const CustomMessageBox = ({ visible, message, type, onClose }) => {
  let backgroundColor = '#fff';
  let textColor = '#333';
  let buttonColor = '#3b82f6'; // blue-600

  switch (type) {
    case 'error':
      backgroundColor = '#fee2e2'; // red-100
      textColor = '#b91c1c'; // red-800
      buttonColor = '#dc2626'; // red-600
      break;
    case 'success':
      backgroundColor = '#dcfce7'; // green-100
      textColor = '#16a34a'; // green-800
      buttonColor = '#22c55e'; // green-600
      break;
    case 'info':
    default:
      backgroundColor = '#dbeafe'; // blue-100
      textColor = '#1e40af'; // blue-800
      buttonColor = '#3b82f6'; // blue-600
      break;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.messageBox, { backgroundColor }]}>
          <Text style={[styles.messageText, { color: textColor }]}>{message}</Text>
          <TouchableOpacity
            style={[styles.messageButton, { backgroundColor: buttonColor }]}
            onPress={onClose}
          >
            <Text style={styles.messageButtonText}>OKなのだ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBox: {
    padding: 32, // p-8
    borderRadius: 12, // rounded-xl
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    alignItems: 'center',
    maxWidth: '90%',
    borderWidth: 1,
    borderColor: '#e5e7eb', // border-gray-200
  },
  messageText: {
    fontSize: 18, // text-lg
    fontWeight: '500', // font-medium
    marginBottom: 24, // mb-6
    textAlign: 'center',
  },
  messageButton: {
    paddingVertical: 10, // py-2
    paddingHorizontal: 20, // px-5
    borderRadius: 6, // rounded-md
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  messageButtonText: {
    color: '#fff', // text-white
    fontWeight: '600', // font-semibold
  },
});

export default CustomMessageBox;
