/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  useColorScheme,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import { NativeModules } from 'react-native';
const { Inbox } = NativeModules;

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [server, setServer] = useState({
      host: '',
      port: '',
      username: '',
      password: ''
  });
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEmails = async () => {
    setLoading(true);
    setError('');
    
    try {
      // First connect to the server
      const isConnected = await Inbox.connect({
        host: server.host,
        port: parseInt(server.port),
        username: server.username,
        password: server.password,
        useSSL: true
      });

      if (!isConnected) {
        throw new Error('Failed to connect to email server');
      } else { console.log("connection", isConnected) }

      // Download emails from INBOX
      const inboxEmails = await Inbox.getEmails({
        folder: 'INBOX',
        limit: 20
      });

      // Format emails for display
      const formattedEmails = inboxEmails.map((email, index) => ({
        id: index + 1,
        from: email.from,
        subject: email.subject,
        date: new Date(email.date).toLocaleString(),
      }));

      setEmails(formattedEmails);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching emails');
    } finally {
      setLoading(false);
      // Disconnect after fetching
      Inbox.disconnect();
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView style={backgroundStyle}>
        <View style={{ padding: 16 }}>
          <TextInput
            style={styles.input}
            placeholder="Host"
            value={server.host}
            onChangeText={(text) => setServer({ ...server, host: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Port"
            value={server.port}
            onChangeText={(text) => setServer({ ...server, port: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={server.username}
            onChangeText={(text) => setServer({ ...server, username: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={server.password}
            onChangeText={(text) => setServer({ ...server, password: text })}
            secureTextEntry
          />
          <Button 
            title={loading ? "Fetching..." : "Fetch Emails"} 
            onPress={fetchEmails} 
            disabled={loading}
          />
          
          {error && (
            <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>
          )}

          {emails.map((email) => (
            <View key={email.id} style={styles.emailItem}>
              <Text style={styles.emailFrom}>{email.from}</Text>
              <Text style={styles.emailSubject}>{email.subject}</Text>
              <Text style={styles.emailDate}>{email.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  emailItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emailFrom: {
    fontWeight: 'bold',
  },
  emailSubject: {
    color: '#666',
  },
  emailDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default App;
