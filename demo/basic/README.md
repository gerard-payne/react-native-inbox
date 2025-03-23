# React Native Inbox Demo

This is a basic example of using the `react-native-inbox` package to connect to an email server and display emails.

## Features

- Connect to any IMAP email server
- View emails from your inbox
- Secure password handling
- Clean and simple UI

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. For iOS, install pods:
```bash
cd ios && pod install && cd ..
```

3. Start the app:
```bash
# Start Metro bundler
npm start
# or
yarn start

# Run on iOS
npm run ios
# or
yarn ios

# Run on Android
npm run android
# or
yarn android
```

## Usage

1. Enter your email server details:
   - Host (e.g., imap.gmail.com)
   - Port (default: 993)
   - Username (your email address)
   - Password

2. Tap "Connect" to establish a connection

3. Once connected, you can:
   - Load emails from your inbox
   - View email subjects, senders, and dates
   - Disconnect when done

## Note for Gmail Users

If you're using Gmail, you'll need to:
1. Enable 2-Step Verification
2. Generate an App Password
3. Use the App Password instead of your regular Gmail password

## Security Note

This is a demo application. In a production environment, you should:
- Never store passwords in plain text
- Use secure storage for credentials
- Implement proper error handling
- Add proper loading states and retry mechanisms 