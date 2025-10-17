# React Native Inbox

A comprehensive React Native plugin for managing email inbox operations with full IMAP and SMTP support.

## Features

### 🚀 **Complete IMAP Support**
- **Advanced Email Search**: Search by sender, recipient, subject, date ranges, and read/unread status
- **Email Management**: Move emails between folders, delete emails, mark as read/unread
- **Flag Operations**: Add/remove email flags (seen, answered, flagged, deleted, draft)
- **Email Retrieval**: Get specific emails by UID, fetch email sizes, quota information
- **Folder Operations**: List folders, expunge deleted emails, comprehensive folder management
- **Email Threading**: Message ID support for conversation tracking

### 📧 **Full SMTP Support**
- **Email Sending**: Send emails with CC/BCC support, HTML/text content
- **Draft Management**: Save drafts, retrieve drafts, delete drafts
- **SMTP Configuration**: Separate SMTP connection with SSL/TLS options
- **Email Composition**: Support for multiple recipients, attachments framework

### 🛠️ **Advanced Features**
- **Cross-Platform Compatibility**: Works seamlessly on both iOS and Android
- **TypeScript Support**: Complete type definitions for all functionality
- **Comprehensive Testing**: Extensive test suite with 25+ test cases
- **Error Handling**: Robust error handling with detailed error messages
- **Connection Management**: Separate IMAP/SMTP connections with proper cleanup
- **Real-time Operations**: Live email search and management capabilities

### 📱 **Enhanced Demo App**
- **Tabbed Interface**: Inbox, Compose, Drafts, and Folders tabs
- **Dual Configuration**: Separate IMAP and SMTP server settings
- **Email Search**: Real-time search functionality
- **Email Composition**: Full compose interface with CC/BCC support
- **Draft Management**: Save and manage email drafts
- **Email Details**: Modal view for email content and metadata
- **Connection Status**: Visual connection status indicators

### 🔒 **Security & Performance**
- **SSL/TLS Support**: Secure connections for both IMAP and SMTP
- **Gmail App Password Support**: Proper authentication for Gmail accounts
- **Memory Efficient**: Optimized for mobile devices with proper resource cleanup
- **Async Operations**: All operations are non-blocking with Promise-based API

## 📋 Release Notes

### Version 2.0.0 - Major Update (October 2025)

This major release transforms React Native Inbox from a basic email reader to a comprehensive email management solution with full IMAP and SMTP capabilities.

#### 🚀 **New Features**

**Complete IMAP Enhancement:**
- **Advanced Email Search**: Multi-criteria search with sender, recipient, subject, date range, and read/unread filtering
- **Email Management Operations**: Move emails between folders, delete emails, mark as read/unread
- **Flag Management System**: Add/remove email flags (seen, answered, flagged, deleted, draft)
- **Enhanced Email Retrieval**: Get specific emails by UID, fetch email sizes, mailbox quota information
- **Folder Operations**: Comprehensive folder management, expunge deleted emails
- **Email Threading Support**: Message ID tracking for conversation management

**Full SMTP Implementation:**
- **Email Sending**: Complete email composition with CC/BCC support, HTML/text content
- **Draft Management**: Save, retrieve, and delete email drafts
- **SMTP Configuration**: Separate SMTP connection with SSL/TLS encryption options
- **Multi-recipient Support**: Handle multiple TO/CC/BCC recipients

**Enhanced Developer Experience:**
- **Comprehensive TypeScript Support**: Complete type definitions for all 25+ new methods
- **Extensive Test Suite**: 25+ test cases covering all functionality with error scenarios
- **Enhanced Demo Application**: Tabbed interface showcasing all features
- **Improved Documentation**: Complete API reference with practical examples

#### 🛠️ **Technical Improvements**

**Cross-Platform Compatibility:**
- **iOS**: Enhanced MailCore2 integration with full IMAP/SMTP support
- **Android**: Upgraded JavaMail implementation with comprehensive email operations
- **Unified API**: Consistent interface across both platforms

**Security & Performance:**
- **SSL/TLS Encryption**: Secure connections for both IMAP and SMTP protocols
- **Gmail App Password Support**: Proper authentication for Gmail accounts
- **Memory Optimization**: Efficient resource management for mobile devices
- **Async Operations**: All operations are non-blocking with Promise-based API

**Developer Tools:**
- **Advanced Error Handling**: Detailed error messages and proper error propagation
- **Connection Management**: Separate IMAP/SMTP connection handling with cleanup
- **Real-time Operations**: Live search and email management capabilities

#### 📱 **Demo App Enhancements**

The demo application now includes:
- **Tabbed Interface**: Inbox, Compose, Drafts, and Folders tabs
- **Dual Server Configuration**: Separate IMAP and SMTP settings
- **Email Search**: Real-time search functionality
- **Email Composition**: Full compose interface with CC/BCC support
- **Draft Management**: Save and manage email drafts
- **Email Details Modal**: Comprehensive email content view
- **Connection Status Indicators**: Visual feedback for server connections

#### 🔄 **Migration Guide**

**Breaking Changes:**
- Email object structure now includes `to`, `cc`, `bcc` arrays, `messageId`, `uid`, `flags`, and `headers` fields
- `getEmail` method renamed to `getEmails` for consistency
- SMTP methods are now separate from IMAP methods

**New Method Signatures:**
- `searchEmails(options)` - Advanced search with multiple criteria
- `moveEmail(options)` - Move emails between folders
- `connectSmtp(config)` - Separate SMTP connection
- `sendEmail(options)` - Send emails with full recipient support

**Enhanced Existing Methods:**
- `getEmails(options)` - Now returns enhanced email objects with metadata
- `connect(config)` - Improved SSL/TLS handling and error reporting
- `getFolders()` - Better folder information and error handling

#### 🧪 **Testing Coverage**

The test suite now includes comprehensive coverage for:
- All 25+ new IMAP and SMTP methods
- Error handling scenarios
- Edge cases and boundary conditions
- Mock implementations for native methods
- Integration test patterns

#### 📚 **Documentation Updates**

- **Complete API Reference**: Detailed documentation for all methods
- **Usage Examples**: Practical code examples for common scenarios
- **Advanced Examples**: Complete EmailManager class implementation
- **Gmail Setup Guide**: Instructions for using app passwords
- **Error Handling Guide**: Best practices for robust applications

This release represents a complete transformation of the React Native Inbox plugin, making it suitable for production email applications with enterprise-grade email management capabilities.

## Installation

1. Install the package:
```bash
npm install react-native-inbox
# or
yarn add react-native-inbox
```

2. Link the native modules:

For iOS:
```bash
cd ios && pod install && cd ..
```

For Android:
The module will be automatically linked in React Native 0.60 and above.

## Usage

### Basic IMAP Connection

```javascript
import Inbox from 'react-native-inbox';

// Connect to IMAP server
const connectToImap = async () => {
  try {
    await Inbox.connect({
      host: 'imap.gmail.com',
      port: 993,
      username: 'your-email@gmail.com',
      password: 'your-app-password',
      useSSL: true
    });
    console.log('Connected to IMAP server');
  } catch (error) {
    console.error('IMAP connection failed:', error);
  }
};

// Download emails
const getEmails = async () => {
  try {
    const emails = await Inbox.getEmails({
      folder: 'INBOX',
      limit: 10
    });
    console.log('Emails:', emails);
  } catch (error) {
    console.error('Failed to download emails:', error);
  }
};

// Search emails
const searchEmails = async () => {
  try {
    const results = await Inbox.searchEmails({
      folder: 'INBOX',
      query: 'urgent',
      from: 'boss@company.com',
      since: '2024-01-01',
      limit: 20
    });
    console.log('Search results:', results);
  } catch (error) {
    console.error('Search failed:', error);
  }
};

// Disconnect
const disconnect = async () => {
  try {
    await Inbox.disconnect();
    console.log('Disconnected from IMAP server');
  } catch (error) {
    console.error('Disconnect failed:', error);
  }
};
```

### SMTP Operations

```javascript
// Connect to SMTP server
const connectToSmtp = async () => {
  try {
    await Inbox.connectSmtp({
      host: 'smtp.gmail.com',
      port: 587,
      username: 'your-email@gmail.com',
      password: 'your-app-password',
      useSSL: false,
      useTLS: true
    });
    console.log('Connected to SMTP server');
  } catch (error) {
    console.error('SMTP connection failed:', error);
  }
};

// Send email
const sendEmail = async () => {
  try {
    await Inbox.sendEmail({
      to: ['recipient@example.com'],
      cc: ['cc@example.com'],
      bcc: ['bcc@example.com'],
      subject: 'Test Email',
      body: 'This is a test email from React Native Inbox',
      isHtml: false
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

// Save draft
const saveDraft = async () => {
  try {
    await Inbox.saveDraft({
      to: ['recipient@example.com'],
      subject: 'Draft Email',
      body: 'This is a draft email'
    });
    console.log('Draft saved successfully');
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
};

// Get drafts
const getDrafts = async () => {
  try {
    const drafts = await Inbox.getDrafts();
    console.log('Drafts:', drafts);
  } catch (error) {
    console.error('Failed to get drafts:', error);
  }
};

// Disconnect from SMTP
const disconnectSmtp = async () => {
  try {
    await Inbox.disconnectSmtp();
    console.log('Disconnected from SMTP server');
  } catch (error) {
    console.error('SMTP disconnect failed:', error);
  }
};
```

### Email Management

```javascript
// Mark email as read
const markAsRead = async (uid, folder) => {
  try {
    await Inbox.markAsRead(uid, folder);
    console.log('Email marked as read');
  } catch (error) {
    console.error('Failed to mark as read:', error);
  }
};

// Mark email as unread
const markAsUnread = async (uid, folder) => {
  try {
    await Inbox.markAsUnread(uid, folder);
    console.log('Email marked as unread');
  } catch (error) {
    console.error('Failed to mark as unread:', error);
  }
};

// Add flags to email
const addFlags = async (uid, folder, flags) => {
  try {
    await Inbox.addFlags(uid, folder, flags); // flags: ['SEEN', 'FLAGGED']
    console.log('Flags added successfully');
  } catch (error) {
    console.error('Failed to add flags:', error);
  }
};

// Remove flags from email
const removeFlags = async (uid, folder, flags) => {
  try {
    await Inbox.removeFlags(uid, folder, flags);
    console.log('Flags removed successfully');
  } catch (error) {
    console.error('Failed to remove flags:', error);
  }
};

// Move email to different folder
const moveEmail = async (uid, fromFolder, toFolder) => {
  try {
    await Inbox.moveEmail({
      uid: uid,
      fromFolder: fromFolder,
      toFolder: toFolder
    });
    console.log('Email moved successfully');
  } catch (error) {
    console.error('Failed to move email:', error);
  }
};

// Delete email
const deleteEmail = async (uid, folder) => {
  try {
    await Inbox.deleteEmail(uid, folder);
    console.log('Email deleted successfully');
  } catch (error) {
    console.error('Failed to delete email:', error);
  }
};

// Get specific email by UID
const getEmailByUid = async (uid, folder) => {
  try {
    const email = await Inbox.getEmailByUid(uid, folder);
    if (email) {
      console.log('Email:', email);
    } else {
      console.log('Email not found');
    }
  } catch (error) {
    console.error('Failed to get email:', error);
  }
};

// Get email size
const getEmailSize = async (uid, folder) => {
  try {
    const size = await Inbox.getEmailSize(uid, folder);
    console.log('Email size:', size, 'bytes');
  } catch (error) {
    console.error('Failed to get email size:', error);
  }
};

// Get mailbox quota
const getQuota = async () => {
  try {
    const quota = await Inbox.getQuota();
    console.log('Quota:', quota.used, '/', quota.total, 'bytes');
  } catch (error) {
    console.error('Failed to get quota:', error);
  }
};

// Expunge deleted emails
const expunge = async (folder) => {
  try {
    await Inbox.expunge(folder);
    console.log('Folder expunged successfully');
  } catch (error) {
    console.error('Failed to expunge folder:', error);
  }
};
```

### Advanced Search

```javascript
// Advanced email search
const advancedSearch = async () => {
  try {
    const results = await Inbox.searchEmails({
      folder: 'INBOX',
      query: 'urgent project', // Search in subject and body
      from: 'boss@company.com',
      to: 'team@company.com',
      subject: 'Review', // Search in subject only
      since: '2024-01-01',
      before: '2024-12-31',
      seen: false, // Only unread emails
      limit: 50
    });
    console.log('Advanced search results:', results);
  } catch (error) {
    console.error('Advanced search failed:', error);
  }
};
```

### Complete Example

```javascript
import Inbox from 'react-native-inbox';

class EmailManager {
  constructor() {
    this.isImapConnected = false;
    this.isSmtpConnected = false;
  }

  // Initialize connections
  async initialize() {
    try {
      // Connect to IMAP
      await Inbox.connect({
        host: 'imap.gmail.com',
        port: 993,
        username: 'your-email@gmail.com',
        password: 'your-app-password',
        useSSL: true
      });
      this.isImapConnected = true;

      // Connect to SMTP
      await Inbox.connectSmtp({
        host: 'smtp.gmail.com',
        port: 587,
        username: 'your-email@gmail.com',
        password: 'your-app-password',
        useSSL: false,
        useTLS: true
      });
      this.isSmtpConnected = true;

      console.log('All connections established');
    } catch (error) {
      console.error('Initialization failed:', error);
    }
  }

  // Get unread emails
  async getUnreadEmails() {
    if (!this.isImapConnected) {
      throw new Error('IMAP not connected');
    }

    try {
      const unreadEmails = await Inbox.searchEmails({
        folder: 'INBOX',
        seen: false,
        limit: 20
      });
      return unreadEmails;
    } catch (error) {
      console.error('Failed to get unread emails:', error);
      throw error;
    }
  }

  // Send notification email
  async sendNotificationEmail(recipient, subject, message) {
    if (!this.isSmtpConnected) {
      throw new Error('SMTP not connected');
    }

    try {
      await Inbox.sendEmail({
        to: [recipient],
        subject: subject,
        body: message,
        isHtml: false
      });
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  // Cleanup connections
  async cleanup() {
    try {
      if (this.isImapConnected) {
        await Inbox.disconnect();
      }
      if (this.isSmtpConnected) {
        await Inbox.disconnectSmtp();
      }
      console.log('All connections closed');
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
}

// Usage
const emailManager = new EmailManager();
await emailManager.initialize();
const unreadEmails = await emailManager.getUnreadEmails();
await emailManager.sendNotificationEmail(
  'admin@company.com',
  'Unread Emails Report',
  `You have ${unreadEmails.length} unread emails`
);
await emailManager.cleanup();
```

## API Reference

### IMAP Methods

#### `connect(config)`
Connects to an IMAP email server.

**Parameters:**
- `config` (Object):
  - `host` (string): Email server host (e.g., 'imap.gmail.com')
  - `port` (number): Email server port (e.g., 993)
  - `username` (string): Email username
  - `password` (string): Email password or app password
  - `useSSL` (boolean): Whether to use SSL/TLS encryption

**Returns:** `Promise<boolean>` - Connection status

#### `disconnect()`
Disconnects from the IMAP email server.

**Returns:** `Promise<boolean>` - Disconnection status

#### `getEmails(options)`
Downloads emails from a specific folder.

**Parameters:**
- `options` (Object):
  - `folder` (string): Folder name (e.g., 'INBOX')
  - `limit` (number): Maximum number of emails to download

**Returns:** `Promise<Email[]>` - Array of email objects

#### `getFolders()`
Returns a list of available folders.

**Returns:** `Promise<string[]>` - Array of folder names

#### `searchEmails(options)`
Searches emails with advanced criteria.

**Parameters:**
- `options` (Object):
  - `folder` (string): Folder to search in
  - `query` (string, optional): General search query (searches subject and body)
  - `from` (string, optional): Search by sender email
  - `to` (string, optional): Search by recipient email
  - `subject` (string, optional): Search by subject
  - `since` (string, optional): Search emails since date (YYYY-MM-DD)
  - `before` (string, optional): Search emails before date (YYYY-MM-DD)
  - `seen` (boolean, optional): Filter by seen status
  - `limit` (number, optional): Maximum results to return

**Returns:** `Promise<Email[]>` - Array of matching email objects

#### `moveEmail(options)`
Moves email to a different folder.

**Parameters:**
- `options` (Object):
  - `uid` (number): Email UID
  - `fromFolder` (string): Source folder
  - `toFolder` (string): Destination folder

**Returns:** `Promise<boolean>` - Success status

#### `deleteEmail(uid, folder)`
Deletes an email (marks as deleted).

**Parameters:**
- `uid` (number): Email UID
- `folder` (string): Folder containing the email

**Returns:** `Promise<boolean>` - Success status

#### `updateEmailFlags(options)`
Updates email flags.

**Parameters:**
- `options` (Object):
  - `uid` (number): Email UID
  - `folder` (string): Folder containing the email
  - `flags` (Object): Flags to update (seen, answered, flagged, deleted, draft)

**Returns:** `Promise<boolean>` - Success status

#### `getEmailByUid(uid, folder)`
Gets a specific email by UID.

**Parameters:**
- `uid` (number): Email UID
- `folder` (string): Folder containing the email

**Returns:** `Promise<Email | null>` - Email object or null if not found

#### `markAsRead(uid, folder)`
Marks an email as read.

**Parameters:**
- `uid` (number): Email UID
- `folder` (string): Folder containing the email

**Returns:** `Promise<boolean>` - Success status

#### `markAsUnread(uid, folder)`
Marks an email as unread.

**Parameters:**
- `uid` (number): Email UID
- `folder` (string): Folder containing the email

**Returns:** `Promise<boolean>` - Success status

#### `addFlags(uid, folder, flags)`
Adds flags to an email.

**Parameters:**
- `uid` (number): Email UID
- `folder` (string): Folder containing the email
- `flags` (string[]): Array of flags to add ('SEEN', 'ANSWERED', 'FLAGGED', 'DELETED', 'DRAFT')

**Returns:** `Promise<boolean>` - Success status

#### `removeFlags(uid, folder, flags)`
Removes flags from an email.

**Parameters:**
- `uid` (number): Email UID
- `folder` (string): Folder containing the email
- `flags` (string[]): Array of flags to remove

**Returns:** `Promise<boolean>` - Success status

#### `getEmailSize(uid, folder)`
Gets the size of an email in bytes.

**Parameters:**
- `uid` (number): Email UID
- `folder` (string): Folder containing the email

**Returns:** `Promise<number>` - Email size in bytes

#### `getQuota()`
Gets mailbox quota information.

**Returns:** `Promise<Object>` - Object with used and total quota in bytes

#### `expunge(folder)`
Permanently removes deleted emails from a folder.

**Parameters:**
- `folder` (string): Folder to expunge

**Returns:** `Promise<boolean>` - Success status

### SMTP Methods

#### `connectSmtp(config)`
Connects to an SMTP server for sending emails.

**Parameters:**
- `config` (Object):
  - `host` (string): SMTP server host (e.g., 'smtp.gmail.com')
  - `port` (number): SMTP server port (e.g., 587)
  - `username` (string): Email username
  - `password` (string): Email password or app password
  - `useSSL` (boolean): Whether to use SSL encryption
  - `useTLS` (boolean, optional): Whether to use TLS encryption

**Returns:** `Promise<boolean>` - Connection status

#### `disconnectSmtp()`
Disconnects from the SMTP server.

**Returns:** `Promise<boolean>` - Disconnection status

#### `sendEmail(options)`
Sends an email.

**Parameters:**
- `options` (Object):
  - `to` (string[]): Array of recipient email addresses
  - `cc` (string[], optional): Array of CC recipients
  - `bcc` (string[], optional): Array of BCC recipients
  - `subject` (string): Email subject
  - `body` (string): Email body content
  - `isHtml` (boolean, optional): Whether body is HTML content

**Returns:** `Promise<boolean>` - Success status

#### `saveDraft(options)`
Saves an email as a draft.

**Parameters:**
- `options` (Object): Same as sendEmail options

**Returns:** `Promise<boolean>` - Success status

#### `deleteDraft(messageId)`
Deletes a draft email.

**Parameters:**
- `messageId` (string): Message ID of the draft

**Returns:** `Promise<boolean>` - Success status

#### `getDrafts()`
Gets all draft emails.

**Returns:** `Promise<Email[]>` - Array of draft email objects

## Email Object Structure

```typescript
interface Email {
  subject: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  date: string;
  body: string;
  attachments?: EmailAttachment[];
  messageId: string;
  uid?: number;
  flags?: EmailFlags;
  headers?: { [key: string]: string };
}

interface EmailAttachment {
  filename: string;
  contentType: string;
  size: number;
  data?: string; // base64 encoded content
}

interface EmailFlags {
  seen: boolean;
  answered: boolean;
  flagged: boolean;
  deleted: boolean;
  draft: boolean;
}
```

## Platform Specific Notes

### iOS
- Uses MailCore2 library for email functionality
- Requires iOS 9.0 or later
- Make sure to run `pod install` in the ios directory after installation

### Android
- Uses JavaMail API for email functionality
- Requires Android API level 21 or later
- No additional setup required

## Error Handling

All methods return promises that reject with error messages. Always wrap API calls in try-catch blocks:

```javascript
try {
  await Inbox.connect(config);
} catch (error) {
  console.error('Connection failed:', error.message);
}
```

## Gmail Setup

For Gmail, you need to use an "App Password" instead of your regular password:

1. Enable 2-factor authentication on your Google account
2. Go to Google Account settings > Security > App passwords
3. Generate a new app password for "Mail"
4. Use this 16-character password in the `password` field

## License

MIT