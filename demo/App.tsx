/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
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
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import Inbox from 'react-native-inbox';

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

type Email = {
  id: number;
  from: string;
  to: string[];
  subject: string;
  date: string;
  body: string;
  flags?: {
    seen: boolean;
    answered: boolean;
    flagged: boolean;
    deleted: boolean;
    draft: boolean;
  };
};

type Folder = {
  name: string;
  type: 'system' | 'custom';
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isSmtpConnected, setIsSmtpConnected] = useState(false);

  // Email server config
  const [imapConfig, setImapConfig] = useState({
    host: '',
    port: '993',
    username: '',
    password: ''
  });

  const [smtpConfig, setSmtpConfig] = useState({
    host: '',
    port: '587',
    username: '',
    password: '',
    useTLS: true
  });

  // Email operations state
  const [emails, setEmails] = useState<Email[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose' | 'drafts' | 'folders'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Compose email state
  const [composeEmail, setComposeEmail] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    isHtml: false
  });

  const connectToImap = async () => {
    setLoading(true);
    setError('');

    try {
      const connected = await Inbox.connect({
        host: imapConfig.host,
        port: parseInt(imapConfig.port),
        username: imapConfig.username,
        password: imapConfig.password,
        useSSL: true
      });

      if (connected) {
        setIsConnected(true);
        // Load folders
        const folderList = await Inbox.getFolders();
        setFolders(folderList);
      } else {
        setError('Failed to connect to IMAP server');
      }
    } catch (err: any) {
      setError(err.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const connectToSmtp = async () => {
    setLoading(true);
    setError('');

    try {
      const connected = await Inbox.connectSmtp({
        host: smtpConfig.host,
        port: parseInt(smtpConfig.port),
        username: smtpConfig.username,
        password: smtpConfig.password,
        useSSL: false,
        useTLS: smtpConfig.useTLS
      });

      if (connected) {
        setIsSmtpConnected(true);
      } else {
        setError('Failed to connect to SMTP server');
      }
    } catch (err: any) {
      setError(err.message || 'SMTP connection failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmails = async () => {
    setLoading(true);
    setError('');

    try {
      const inboxEmails = await Inbox.getEmails({
        folder: 'INBOX',
        limit: 20
      });

      const formattedEmails = inboxEmails.map((email: any, index: number) => ({
        id: index + 1,
        from: email.from,
        to: email.to || [],
        subject: email.subject || 'No Subject',
        date: new Date(email.date).toLocaleString(),
        body: email.body || '',
        flags: email.flags || {}
      }));

      setEmails(formattedEmails);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };

  const searchEmails = async (query: string) => {
    setLoading(true);
    setError('');

    try {
      const searchResults = await Inbox.searchEmails({
        folder: 'INBOX',
        query: query,
        limit: 20
      });

      const formattedEmails = searchResults.map((email: any, index: number) => ({
        id: index + 1,
        from: email.from,
        to: email.to || [],
        subject: email.subject || 'No Subject',
        date: new Date(email.date).toLocaleString(),
        body: email.body || '',
        flags: email.flags || {}
      }));

      setEmails(formattedEmails);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchDrafts = async () => {
    setLoading(true);
    setError('');

    try {
      const draftEmails = await Inbox.getDrafts();

      const formattedDrafts = draftEmails.map((email: any, index: number) => ({
        id: index + 1,
        from: email.from,
        to: email.to || [],
        subject: email.subject || 'No Subject',
        date: new Date(email.date).toLocaleString(),
        body: email.body || '',
        flags: email.flags || {}
      }));

      setDrafts(formattedDrafts);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch drafts');
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    if (!composeEmail.to || !composeEmail.subject || !composeEmail.body) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const recipients = composeEmail.to.split(',').map(email => email.trim());
      const ccRecipients = composeEmail.cc ? composeEmail.cc.split(',').map(email => email.trim()).filter(email => email) : undefined;
      const bccRecipients = composeEmail.bcc ? composeEmail.bcc.split(',').map(email => email.trim()).filter(email => email) : undefined;

      await Inbox.sendEmail({
        to: recipients,
        cc: ccRecipients,
        bcc: bccRecipients,
        subject: composeEmail.subject,
        body: composeEmail.body,
        isHtml: composeEmail.isHtml
      });

      Alert.alert('Success', 'Email sent successfully!');
      setComposeEmail({
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
        isHtml: false
      });
      setActiveTab('inbox');
    } catch (err: any) {
      setError(err.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async () => {
    if (!composeEmail.subject && !composeEmail.body) {
      setError('Please enter subject or body to save as draft');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const recipients = composeEmail.to ? composeEmail.to.split(',').map(email => email.trim()).filter(email => email) : [];

      await Inbox.saveDraft({
        to: recipients,
        cc: composeEmail.cc ? composeEmail.cc.split(',').map(email => email.trim()).filter(email => email) : undefined,
        bcc: composeEmail.bcc ? composeEmail.bcc.split(',').map(email => email.trim()).filter(email => email) : undefined,
        subject: composeEmail.subject,
        body: composeEmail.body,
        isHtml: composeEmail.isHtml
      });

      Alert.alert('Success', 'Draft saved successfully!');
      setComposeEmail({
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
        isHtml: false
      });
      setActiveTab('drafts');
    } catch (err: any) {
      setError(err.message || 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  const disconnectAll = async () => {
    setLoading(true);

    try {
      if (isConnected) {
        await Inbox.disconnect();
        setIsConnected(false);
      }
      if (isSmtpConnected) {
        await Inbox.disconnectSmtp();
        setIsSmtpConnected(false);
      }
      setEmails([]);
      setFolders([]);
      setDrafts([]);
    } catch (err: any) {
      setError(err.message || 'Disconnect failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchEmails();
    }
    if (isSmtpConnected) {
      fetchDrafts();
    }
  }, [isConnected, isSmtpConnected]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const renderEmailItem = ({ item }: { item: Email }) => (
    <TouchableOpacity
      style={styles.emailItem}
      onPress={() => {
        setSelectedEmail(item);
        setShowEmailModal(true);
      }}>
      <Text style={[styles.emailFrom, item.flags?.seen === false && styles.unreadEmail]}>
        {item.from}
      </Text>
      <Text style={[styles.emailSubject, item.flags?.seen === false && styles.unreadEmail]}>
        {item.subject}
      </Text>
      <Text style={styles.emailDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      {/* Connection Status */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          IMAP: {isConnected ? 'Connected' : 'Disconnected'} |
          SMTP: {isSmtpConnected ? 'Connected' : 'Disconnected'}
        </Text>
        {isConnected || isSmtpConnected ? (
          <Button title="Disconnect" onPress={disconnectAll} />
        ) : null}
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'inbox' && styles.activeTab]}
          onPress={() => setActiveTab('inbox')}>
          <Text style={[styles.tabText, activeTab === 'inbox' && styles.activeTabText]}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'compose' && styles.activeTab]}
          onPress={() => setActiveTab('compose')}>
          <Text style={[styles.tabText, activeTab === 'compose' && styles.activeTabText]}>Compose</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'drafts' && styles.activeTab]}
          onPress={() => setActiveTab('drafts')}>
          <Text style={[styles.tabText, activeTab === 'drafts' && styles.activeTabText]}>Drafts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'folders' && styles.activeTab]}
          onPress={() => setActiveTab('folders')}>
          <Text style={[styles.tabText, activeTab === 'folders' && styles.activeTabText]}>Folders</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={backgroundStyle}>
        <View style={{ padding: 16 }}>
          {error && (
            <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>
          )}

          {!isConnected && !isSmtpConnected && (
            <>
              {/* IMAP Configuration */}
              <Text style={styles.sectionTitle}>IMAP Configuration</Text>
              <TextInput
                style={styles.input}
                placeholder="IMAP Host (e.g., imap.gmail.com)"
                value={imapConfig.host}
                onChangeText={(text) => setImapConfig({ ...imapConfig, host: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Port (e.g., 993)"
                value={imapConfig.port}
                onChangeText={(text) => setImapConfig({ ...imapConfig, port: text })}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={imapConfig.username}
                onChangeText={(text) => setImapConfig({ ...imapConfig, username: text })}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={imapConfig.password}
                onChangeText={(text) => setImapConfig({ ...imapConfig, password: text })}
                secureTextEntry
              />
              <Button
                title={loading ? "Connecting..." : "Connect to IMAP"}
                onPress={connectToImap}
                disabled={loading}
              />

              {/* SMTP Configuration */}
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>SMTP Configuration</Text>
              <TextInput
                style={styles.input}
                placeholder="SMTP Host (e.g., smtp.gmail.com)"
                value={smtpConfig.host}
                onChangeText={(text) => setSmtpConfig({ ...smtpConfig, host: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Port (e.g., 587)"
                value={smtpConfig.port}
                onChangeText={(text) => setSmtpConfig({ ...smtpConfig, port: text })}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={smtpConfig.username}
                onChangeText={(text) => setSmtpConfig({ ...smtpConfig, username: text })}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={smtpConfig.password}
                onChangeText={(text) => setSmtpConfig({ ...smtpConfig, password: text })}
                secureTextEntry
              />
              <Button
                title={loading ? "Connecting..." : "Connect to SMTP"}
                onPress={connectToSmtp}
                disabled={loading}
              />
            </>
          )}

          {/* Inbox Tab */}
          {activeTab === 'inbox' && isConnected && (
            <>
              <View style={styles.actionBar}>
                <Button title="Refresh Emails" onPress={fetchEmails} disabled={loading} />
                <TextInput
                  style={[styles.input, { flex: 1, marginLeft: 10 }]}
                  placeholder="Search emails..."
                  onSubmitEditing={(event) => searchEmails(event.nativeEvent.text)}
                />
              </View>

              <FlatList
                data={emails}
                renderItem={renderEmailItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text>No emails found</Text>}
              />
            </>
          )}

          {/* Compose Tab */}
          {activeTab === 'compose' && isSmtpConnected && (
            <>
              <TextInput
                style={styles.input}
                placeholder="To (comma-separated)"
                value={composeEmail.to}
                onChangeText={(text) => setComposeEmail({ ...composeEmail, to: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="CC (comma-separated)"
                value={composeEmail.cc}
                onChangeText={(text) => setComposeEmail({ ...composeEmail, cc: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="BCC (comma-separated)"
                value={composeEmail.bcc}
                onChangeText={(text) => setComposeEmail({ ...composeEmail, bcc: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Subject"
                value={composeEmail.subject}
                onChangeText={(text) => setComposeEmail({ ...composeEmail, subject: text })}
              />
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Email body"
                value={composeEmail.body}
                onChangeText={(text) => setComposeEmail({ ...composeEmail, body: text })}
                multiline
              />

              <View style={styles.buttonRow}>
                <Button title="Send" onPress={sendEmail} disabled={loading} />
                <Button title="Save Draft" onPress={saveDraft} disabled={loading} />
                <Button title="Cancel" onPress={() => setActiveTab('inbox')} />
              </View>
            </>
          )}

          {/* Drafts Tab */}
          {activeTab === 'drafts' && isSmtpConnected && (
            <>
              <Button title="Refresh Drafts" onPress={fetchDrafts} disabled={loading} />
              <FlatList
                data={drafts}
                renderItem={renderEmailItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text>No drafts found</Text>}
              />
            </>
          )}

          {/* Folders Tab */}
          {activeTab === 'folders' && isConnected && (
            <>
              <Text style={styles.sectionTitle}>Available Folders:</Text>
              {folders.map((folder, index) => (
                <TouchableOpacity key={index} style={styles.folderItem}>
                  <Text>{folder}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Email Detail Modal */}
      <Modal
        visible={showEmailModal}
        animationType="slide"
        onRequestClose={() => setShowEmailModal(false)}>
        <View style={backgroundStyle}>
          <View style={styles.modalHeader}>
            <Button title="Close" onPress={() => setShowEmailModal(false)} />
          </View>
          {selectedEmail && (
            <ScrollView style={{ padding: 16 }}>
              <Text style={styles.emailDetailTitle}>From:</Text>
              <Text style={styles.emailDetailText}>{selectedEmail.from}</Text>

              <Text style={styles.emailDetailTitle}>To:</Text>
              <Text style={styles.emailDetailText}>{selectedEmail.to.join(', ')}</Text>

              <Text style={styles.emailDetailTitle}>Subject:</Text>
              <Text style={styles.emailDetailText}>{selectedEmail.subject}</Text>

              <Text style={styles.emailDetailTitle}>Date:</Text>
              <Text style={styles.emailDetailText}>{selectedEmail.date}</Text>

              <Text style={styles.emailDetailTitle}>Body:</Text>
              <Text style={styles.emailDetailText}>{selectedEmail.body}</Text>

              {selectedEmail.flags && (
                <>
                  <Text style={styles.emailDetailTitle}>Flags:</Text>
                  <Text style={styles.emailDetailText}>
                    {Object.entries(selectedEmail.flags)
                      .filter(([key, value]) => value)
                      .map(([key, value]) => key)
                      .join(', ')}
                  </Text>
                </>
              )}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 16,
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
    marginTop: 4,
  },
  emailDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  unreadEmail: {
    fontWeight: 'bold',
    color: '#000',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  statusText: {
    fontSize: 14,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#333',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  folderItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emailDetailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emailDetailText: {
    fontSize: 14,
    marginBottom: 8,
  },
});

export default App;
