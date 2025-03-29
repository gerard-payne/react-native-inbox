# React Native Inbox

A React Native plugin for managing email inbox operations.

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

```javascript
import Inbox from 'react-native-inbox';

// Connect to email server
const connectToEmail = async () => {
  try {
    await Inbox.connect({
      host: 'imap.gmail.com',
      port: 993,
      username: 'your-email@gmail.com',
      password: 'your-password',
      useSSL: true
    });
    console.log('Connected successfully');
  } catch (error) {
    console.error('Connection failed:', error);
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

// Get available folders
const getFolders = async () => {
  try {
    const folders = await Inbox.getFolders();
    console.log('Available folders:', folders);
  } catch (error) {
    console.error('Failed to get folders:', error);
  }
};

// Disconnect from email server
const disconnect = async () => {
  try {
    await Inbox.disconnect();
    console.log('Disconnected successfully');
  } catch (error) {
    console.error('Disconnect failed:', error);
  }
};
```

## API

### connect(config)
Connects to an email server.

**Parameters:**
- `config` (Object):
  - `host` (string): Email server host
  - `port` (number): Email server port
  - `username` (string): Email username
  - `password` (string): Email password
  - `useSSL` (boolean): Whether to use SSL

### disconnect()
Disconnects from the email server.

### getEmails(options)
Downloads emails from a specific folder.

**Parameters:**
- `options` (Object):
  - `folder` (string): Folder name (e.g., 'INBOX')
  - `limit` (number): Maximum number of emails to download

### getFolders()
Returns a list of available folders.

## Platform Specific Notes

### iOS
- Uses MailCore2 library for email functionality
- Requires iOS 9.0 or later
- Make sure to run `pod install` in the ios directory after installation

### Android
- Uses JavaMail API for email functionality
- Requires Android API level 21 or later
- No additional setup required

## License

MIT 