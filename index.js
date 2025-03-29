import { NativeModules } from 'react-native';
const { Inbox } = NativeModules;

export default {
  /**
   * Connect to email server
   * @param {Object} config - Email server configuration
   * @param {string} config.host - Email server host
   * @param {number} config.port - Email server port
   * @param {string} config.username - Email username
   * @param {string} config.password - Email password
   * @param {boolean} config.useSSL - Whether to use SSL
   * @returns {Promise<boolean>} - Connection status
   */
  connect(config) {
    return Inbox.connect(config);
  },

  /**
   * Disconnect from email server
   * @returns {Promise<boolean>} - Disconnection status
   */
  disconnect() {
    return Inbox.disconnect();
  },

  /**
   * Download emails from a specific folder
   * @param {Object} options - Download options
   * @param {string} options.folder - Folder name (e.g., 'INBOX')
   * @param {number} options.limit - Maximum number of emails to download
   * @returns {Promise<Array>} - Array of email objects
   */
  getEmail(options) {
    return Inbox.getEmails(options);
  },

  /**
   * Get list of available folders
   * @returns {Promise<Array>} - Array of folder names
   */
  getFolders() {
    return Inbox.getFolders();
  }
};
