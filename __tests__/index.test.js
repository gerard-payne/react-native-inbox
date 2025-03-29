import Imap from '../index';
import { NativeModules } from 'react-native';

const { RNImap } = NativeModules;

describe('React Native IMAP', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('connect', () => {
    it('should call native connect method with correct parameters', async () => {
      const config = {
        host: 'imap.gmail.com',
        port: 993,
        username: 'test@example.com',
        password: 'password123',
        useSSL: true,
      };

      RNImap.connect.mockResolvedValue(true);

      await Imap.connect(config);

      expect(RNImap.connect).toHaveBeenCalledWith(config);
    });

    it('should throw error when native connect fails', async () => {
      const config = {
        host: 'imap.gmail.com',
        port: 993,
        username: 'test@example.com',
        password: 'wrong-password',
        useSSL: true,
      };

      const error = new Error('Authentication failed');
      RNImap.connect.mockRejectedValue(error);

      await expect(Imap.connect(config)).rejects.toThrow('Authentication failed');
    });
  });

  describe('disconnect', () => {
    it('should call native disconnect method', async () => {
      RNImap.disconnect.mockResolvedValue(true);

      await Imap.disconnect();

      expect(RNImap.disconnect).toHaveBeenCalled();
    });

    it('should throw error when native disconnect fails', async () => {
      const error = new Error('Connection error');
      RNImap.disconnect.mockRejectedValue(error);

      await expect(Imap.disconnect()).rejects.toThrow('Connection error');
    });
  });

  describe('getEmails', () => {
    it('should call native getEmails method with correct parameters', async () => {
      const options = {
        folder: 'INBOX',
        limit: 10,
      };

      const mockEmails = [
        {
          subject: 'Test Email',
          from: 'sender@example.com',
          date: '2024-03-20T10:00:00Z',
          body: 'Test content',
        },
      ];

      RNImap.getEmails.mockResolvedValue(mockEmails);

      const result = await Imap.getEmails(options);

      expect(RNImap.getEmails).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockEmails);
    });

    it('should throw error when native getEmails fails', async () => {
      const options = {
        folder: 'INBOX',
        limit: 10,
      };

      const error = new Error('Download failed');
      RNImap.getEmails.mockRejectedValue(error);

      await expect(Imap.getEmails(options)).rejects.toThrow('Download failed');
    });
  });

  describe('getFolders', () => {
    it('should call native getFolders method', async () => {
      const mockFolders = ['INBOX', 'Sent', 'Drafts', 'Trash'];
      RNImap.getFolders.mockResolvedValue(mockFolders);

      const result = await Imap.getFolders();

      expect(RNImap.getFolders).toHaveBeenCalled();
      expect(result).toEqual(mockFolders);
    });

    it('should throw error when native getFolders fails', async () => {
      const error = new Error('Failed to get folders');
      RNImap.getFolders.mockRejectedValue(error);

      await expect(Imap.getFolders()).rejects.toThrow('Failed to get folders');
    });
  });
}); 