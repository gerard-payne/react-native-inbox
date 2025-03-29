import { NativeModules } from 'react-native';

// Mock the native module
NativeModules.RNImap = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  getEmails: jest.fn(),
  getFolders: jest.fn(),
};

// Mock console.error to prevent noise in tests
console.error = jest.fn(); 