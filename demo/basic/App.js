import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Inbox from 'react-native-inbox';

const App = () => {
  const [credentials, setCredentials] = useState({
    host: '',
    port: '993',
    username: '',
    password: '',
    useSSL: true,
  });
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      await Inbox.connect({
        ...credentials,
        port: parseInt(credentials.port, 10),
      });
      setConnected(true);
      Alert.alert('Success', 'Connected to email server');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      await Inbox.disconnect();
      setConnected(false);
      setEmails([]);
      Alert.alert('Success', 'Disconnected from email server');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadEmails = async () => {
    try {
      setLoading(true);
      const result = await Inbox.downloadEmails({
        folder: 'INBOX',
        limit: 20,
      });
      setEmails(result);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderEmail = ({ item }) => (
    <View style={styles.emailItem}>
      <Text style={styles.subject}>{item.subject}</Text>
      <Text style={styles.from}>{item.from}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Host (e.g., imap.gmail.com)"
          value={credentials.host}
          onChangeText={(text) => setCredentials({ ...credentials, host: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Port (default: 993)"
          value={credentials.port}
          keyboardType="numeric"
          onChangeText={(text) => setCredentials({ ...credentials, port: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={credentials.username}
          onChangeText={(text) => setCredentials({ ...credentials, username: text })}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={credentials.password}
          onChangeText={(text) => setCredentials({ ...credentials, password: text })}
          secureTextEntry
        />
        
        {!connected ? (
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleConnect}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Connect</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLoadEmails}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Load Emails</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.disconnectButton]} 
              onPress={handleDisconnect}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}

      <FlatList
        data={emails}
        renderItem={renderEmail}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  disconnectButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
  list: {
    flex: 1,
  },
  emailItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  subject: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  from: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});

export default App; 