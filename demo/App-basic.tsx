/**
 * @format
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Test basic React Native functionality without any native modules
function App(): React.JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Basic React Native Test
      </Text>
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>
        No native modules - just React Native
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
