import Inbox from '../index';
import { NativeModules } from 'react-native';

const { Inbox: RNInbox } = NativeModules;

describe('React Native Inbox', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('IMAP functionality', () => {
    describe('connect', () => {
      it('should call native connect method with correct parameters', async () => {
        const config = {
          host: 'imap.gmail.com',
          port: 993,
          username: 'test@example.com',
          password: 'password123',
          useSSL: true,
        };

        RNInbox.connect.mockResolvedValue(true);

        await Inbox.connect(config);

        expect(RNInbox.connect).toHaveBeenCalledWith(config);
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
        RNInbox.connect.mockRejectedValue(error);

        await expect(Inbox.connect(config)).rejects.toThrow('Authentication failed');
      });
    });

    describe('disconnect', () => {
      it('should call native disconnect method', async () => {
        RNInbox.disconnect.mockResolvedValue(true);

        await Inbox.disconnect();

        expect(RNInbox.disconnect).toHaveBeenCalled();
      });

      it('should throw error when native disconnect fails', async () => {
        const error = new Error('Connection error');
        RNInbox.disconnect.mockRejectedValue(error);

        await expect(Inbox.disconnect()).rejects.toThrow('Connection error');
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
            to: ['recipient@example.com'],
            date: '2024-03-20T10:00:00Z',
            body: 'Test content',
            messageId: 'test-message-id',
            flags: { seen: false, answered: false, flagged: false, deleted: false, draft: false }
          },
        ];

        RNInbox.getEmails.mockResolvedValue(mockEmails);

        const result = await Inbox.getEmails(options);

        expect(RNInbox.getEmails).toHaveBeenCalledWith(options);
        expect(result).toEqual(mockEmails);
      });

      it('should throw error when native getEmails fails', async () => {
        const options = {
          folder: 'INBOX',
          limit: 10,
        };

        const error = new Error('Download failed');
        RNInbox.getEmails.mockRejectedValue(error);

        await expect(Inbox.getEmails(options)).rejects.toThrow('Download failed');
      });
    });

    describe('getFolders', () => {
      it('should call native getFolders method', async () => {
        const mockFolders = ['INBOX', 'Sent', 'Drafts', 'Trash'];
        RNInbox.getFolders.mockResolvedValue(mockFolders);

        const result = await Inbox.getFolders();

        expect(RNInbox.getFolders).toHaveBeenCalled();
        expect(result).toEqual(mockFolders);
      });

      it('should throw error when native getFolders fails', async () => {
        const error = new Error('Failed to get folders');
        RNInbox.getFolders.mockRejectedValue(error);

        await expect(Inbox.getFolders()).rejects.toThrow('Failed to get folders');
      });
    });

    describe('searchEmails', () => {
      it('should call native searchEmails method with correct parameters', async () => {
        const options = {
          folder: 'INBOX',
          query: 'test search',
          from: 'sender@example.com',
          since: '2024-01-01',
          limit: 20,
        };

        const mockEmails = [
          {
            subject: 'Test Email',
            from: 'sender@example.com',
            body: 'Test content',
            messageId: 'test-message-id',
          },
        ];

        RNInbox.searchEmails.mockResolvedValue(mockEmails);

        const result = await Inbox.searchEmails(options);

        expect(RNInbox.searchEmails).toHaveBeenCalledWith(options);
        expect(result).toEqual(mockEmails);
      });

      it('should throw error when native searchEmails fails', async () => {
        const options = {
          folder: 'INBOX',
          query: 'test search',
        };

        const error = new Error('Search failed');
        RNInbox.searchEmails.mockRejectedValue(error);

        await expect(Inbox.searchEmails(options)).rejects.toThrow('Search failed');
      });
    });

    describe('moveEmail', () => {
      it('should call native moveEmail method with correct parameters', async () => {
        const options = {
          uid: 123,
          fromFolder: 'INBOX',
          toFolder: 'Archive',
        };

        RNInbox.moveEmail.mockResolvedValue(true);

        await Inbox.moveEmail(options);

        expect(RNInbox.moveEmail).toHaveBeenCalledWith(options);
      });

      it('should throw error when native moveEmail fails', async () => {
        const options = {
          uid: 123,
          fromFolder: 'INBOX',
          toFolder: 'Archive',
        };

        const error = new Error('Move failed');
        RNInbox.moveEmail.mockRejectedValue(error);

        await expect(Inbox.moveEmail(options)).rejects.toThrow('Move failed');
      });
    });

    describe('deleteEmail', () => {
      it('should call native deleteEmail method with correct parameters', async () => {
        RNInbox.deleteEmail.mockResolvedValue(true);

        await Inbox.deleteEmail(123, 'INBOX');

        expect(RNInbox.deleteEmail).toHaveBeenCalledWith(123, 'INBOX');
      });

      it('should throw error when native deleteEmail fails', async () => {
        const error = new Error('Delete failed');
        RNInbox.deleteEmail.mockRejectedValue(error);

        await expect(Inbox.deleteEmail(123, 'INBOX')).rejects.toThrow('Delete failed');
      });
    });

    describe('updateEmailFlags', () => {
      it('should call native updateEmailFlags method with correct parameters', async () => {
        const options = {
          uid: 123,
          folder: 'INBOX',
          flags: {
            seen: true,
            flagged: true,
          },
        };

        RNInbox.updateEmailFlags.mockResolvedValue(true);

        await Inbox.updateEmailFlags(options);

        expect(RNInbox.updateEmailFlags).toHaveBeenCalledWith(options);
      });

      it('should throw error when native updateEmailFlags fails', async () => {
        const options = {
          uid: 123,
          folder: 'INBOX',
          flags: { seen: true },
        };

        const error = new Error('Update flags failed');
        RNInbox.updateEmailFlags.mockRejectedValue(error);

        await expect(Inbox.updateEmailFlags(options)).rejects.toThrow('Update flags failed');
      });
    });

    describe('getEmailByUid', () => {
      it('should call native getEmailByUid method and return email', async () => {
        const mockEmail = {
          subject: 'Test Email',
          from: 'sender@example.com',
          body: 'Test content',
        };

        RNInbox.getEmailByUid.mockResolvedValue(mockEmail);

        const result = await Inbox.getEmailByUid(123, 'INBOX');

        expect(RNInbox.getEmailByUid).toHaveBeenCalledWith(123, 'INBOX');
        expect(result).toEqual(mockEmail);
      });

      it('should return null when email not found', async () => {
        RNInbox.getEmailByUid.mockResolvedValue(null);

        const result = await Inbox.getEmailByUid(999, 'INBOX');

        expect(result).toBeNull();
      });

      it('should throw error when native getEmailByUid fails', async () => {
        const error = new Error('Get email failed');
        RNInbox.getEmailByUid.mockRejectedValue(error);

        await expect(Inbox.getEmailByUid(123, 'INBOX')).rejects.toThrow('Get email failed');
      });
    });

    describe('markAsRead', () => {
      it('should call native markAsRead method', async () => {
        RNInbox.markAsRead.mockResolvedValue(true);

        await Inbox.markAsRead(123, 'INBOX');

        expect(RNInbox.markAsRead).toHaveBeenCalledWith(123, 'INBOX');
      });

      it('should throw error when native markAsRead fails', async () => {
        const error = new Error('Mark as read failed');
        RNInbox.markAsRead.mockRejectedValue(error);

        await expect(Inbox.markAsRead(123, 'INBOX')).rejects.toThrow('Mark as read failed');
      });
    });

    describe('markAsUnread', () => {
      it('should call native markAsUnread method', async () => {
        RNInbox.markAsUnread.mockResolvedValue(true);

        await Inbox.markAsUnread(123, 'INBOX');

        expect(RNInbox.markAsUnread).toHaveBeenCalledWith(123, 'INBOX');
      });

      it('should throw error when native markAsUnread fails', async () => {
        const error = new Error('Mark as unread failed');
        RNInbox.markAsUnread.mockRejectedValue(error);

        await expect(Inbox.markAsUnread(123, 'INBOX')).rejects.toThrow('Mark as unread failed');
      });
    });

    describe('addFlags', () => {
      it('should call native addFlags method with correct parameters', async () => {
        const flags = ['SEEN', 'FLAGGED'];
        RNInbox.addFlags.mockResolvedValue(true);

        await Inbox.addFlags(123, 'INBOX', flags);

        expect(RNInbox.addFlags).toHaveBeenCalledWith(123, 'INBOX', flags);
      });

      it('should throw error when native addFlags fails', async () => {
        const flags = ['SEEN'];
        const error = new Error('Add flags failed');
        RNInbox.addFlags.mockRejectedValue(error);

        await expect(Inbox.addFlags(123, 'INBOX', flags)).rejects.toThrow('Add flags failed');
      });
    });

    describe('removeFlags', () => {
      it('should call native removeFlags method with correct parameters', async () => {
        const flags = ['SEEN', 'FLAGGED'];
        RNInbox.removeFlags.mockResolvedValue(true);

        await Inbox.removeFlags(123, 'INBOX', flags);

        expect(RNInbox.removeFlags).toHaveBeenCalledWith(123, 'INBOX', flags);
      });

      it('should throw error when native removeFlags fails', async () => {
        const flags = ['SEEN'];
        const error = new Error('Remove flags failed');
        RNInbox.removeFlags.mockRejectedValue(error);

        await expect(Inbox.removeFlags(123, 'INBOX', flags)).rejects.toThrow('Remove flags failed');
      });
    });

    describe('getEmailSize', () => {
      it('should call native getEmailSize method and return size', async () => {
        RNInbox.getEmailSize.mockResolvedValue(1024);

        const result = await Inbox.getEmailSize(123, 'INBOX');

        expect(RNInbox.getEmailSize).toHaveBeenCalledWith(123, 'INBOX');
        expect(result).toBe(1024);
      });

      it('should throw error when native getEmailSize fails', async () => {
        const error = new Error('Get size failed');
        RNInbox.getEmailSize.mockRejectedValue(error);

        await expect(Inbox.getEmailSize(123, 'INBOX')).rejects.toThrow('Get size failed');
      });
    });

    describe('getQuota', () => {
      it('should call native getQuota method and return quota info', async () => {
        const mockQuota = { used: 512000, total: 1000000 };
        RNInbox.getQuota.mockResolvedValue(mockQuota);

        const result = await Inbox.getQuota();

        expect(RNInbox.getQuota).toHaveBeenCalled();
        expect(result).toEqual(mockQuota);
      });

      it('should throw error when native getQuota fails', async () => {
        const error = new Error('Get quota failed');
        RNInbox.getQuota.mockRejectedValue(error);

        await expect(Inbox.getQuota()).rejects.toThrow('Get quota failed');
      });
    });

    describe('expunge', () => {
      it('should call native expunge method', async () => {
        RNInbox.expunge.mockResolvedValue(true);

        await Inbox.expunge('INBOX');

        expect(RNInbox.expunge).toHaveBeenCalledWith('INBOX');
      });

      it('should throw error when native expunge fails', async () => {
        const error = new Error('Expunge failed');
        RNInbox.expunge.mockRejectedValue(error);

        await expect(Inbox.expunge('INBOX')).rejects.toThrow('Expunge failed');
      });
    });
  });

  describe('SMTP functionality', () => {
    describe('connectSmtp', () => {
      it('should call native connectSmtp method with correct parameters', async () => {
        const config = {
          host: 'smtp.gmail.com',
          port: 587,
          username: 'test@example.com',
          password: 'password123',
          useSSL: false,
          useTLS: true,
        };

        RNInbox.connectSmtp.mockResolvedValue(true);

        await Inbox.connectSmtp(config);

        expect(RNInbox.connectSmtp).toHaveBeenCalledWith(config);
      });

      it('should throw error when native connectSmtp fails', async () => {
        const config = {
          host: 'smtp.gmail.com',
          port: 587,
          username: 'test@example.com',
          password: 'wrong-password',
          useSSL: false,
          useTLS: true,
        };

        const error = new Error('SMTP authentication failed');
        RNInbox.connectSmtp.mockRejectedValue(error);

        await expect(Inbox.connectSmtp(config)).rejects.toThrow('SMTP authentication failed');
      });
    });

    describe('disconnectSmtp', () => {
      it('should call native disconnectSmtp method', async () => {
        RNInbox.disconnectSmtp.mockResolvedValue(true);

        await Inbox.disconnectSmtp();

        expect(RNInbox.disconnectSmtp).toHaveBeenCalled();
      });

      it('should throw error when native disconnectSmtp fails', async () => {
        const error = new Error('SMTP disconnect failed');
        RNInbox.disconnectSmtp.mockRejectedValue(error);

        await expect(Inbox.disconnectSmtp()).rejects.toThrow('SMTP disconnect failed');
      });
    });

    describe('sendEmail', () => {
      it('should call native sendEmail method with correct parameters', async () => {
        const options = {
          to: ['recipient@example.com'],
          cc: ['cc@example.com'],
          bcc: ['bcc@example.com'],
          subject: 'Test Subject',
          body: 'Test email body',
          isHtml: false,
        };

        RNInbox.sendEmail.mockResolvedValue(true);

        await Inbox.sendEmail(options);

        expect(RNInbox.sendEmail).toHaveBeenCalledWith(options);
      });

      it('should throw error when native sendEmail fails', async () => {
        const options = {
          to: ['recipient@example.com'],
          subject: 'Test Subject',
          body: 'Test email body',
        };

        const error = new Error('Send email failed');
        RNInbox.sendEmail.mockRejectedValue(error);

        await expect(Inbox.sendEmail(options)).rejects.toThrow('Send email failed');
      });
    });

    describe('saveDraft', () => {
      it('should call native saveDraft method with correct parameters', async () => {
        const options = {
          to: ['recipient@example.com'],
          subject: 'Draft Subject',
          body: 'Draft email body',
        };

        RNInbox.saveDraft.mockResolvedValue(true);

        await Inbox.saveDraft(options);

        expect(RNInbox.saveDraft).toHaveBeenCalledWith(options);
      });

      it('should throw error when native saveDraft fails', async () => {
        const options = {
          to: ['recipient@example.com'],
          subject: 'Draft Subject',
          body: 'Draft email body',
        };

        const error = new Error('Save draft failed');
        RNInbox.saveDraft.mockRejectedValue(error);

        await expect(Inbox.saveDraft(options)).rejects.toThrow('Save draft failed');
      });
    });

    describe('deleteDraft', () => {
      it('should call native deleteDraft method with correct parameters', async () => {
        const messageId = 'test-message-id';
        RNInbox.deleteDraft.mockResolvedValue(true);

        await Inbox.deleteDraft(messageId);

        expect(RNInbox.deleteDraft).toHaveBeenCalledWith(messageId);
      });

      it('should throw error when native deleteDraft fails', async () => {
        const messageId = 'test-message-id';
        const error = new Error('Delete draft failed');
        RNInbox.deleteDraft.mockRejectedValue(error);

        await expect(Inbox.deleteDraft(messageId)).rejects.toThrow('Delete draft failed');
      });
    });

    describe('getDrafts', () => {
      it('should call native getDrafts method and return drafts', async () => {
        const mockDrafts = [
          {
            subject: 'Draft 1',
            from: 'sender@example.com',
            body: 'Draft content 1',
            flags: { draft: true },
          },
          {
            subject: 'Draft 2',
            from: 'sender@example.com',
            body: 'Draft content 2',
            flags: { draft: true },
          },
        ];

        RNInbox.getDrafts.mockResolvedValue(mockDrafts);

        const result = await Inbox.getDrafts();

        expect(RNInbox.getDrafts).toHaveBeenCalled();
        expect(result).toEqual(mockDrafts);
      });

      it('should throw error when native getDrafts fails', async () => {
        const error = new Error('Get drafts failed');
        RNInbox.getDrafts.mockRejectedValue(error);

        await expect(Inbox.getDrafts()).rejects.toThrow('Get drafts failed');
      });
    });
  });
});