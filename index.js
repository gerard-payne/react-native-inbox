import { NativeModules } from 'react-native';
const { Inbox } = NativeModules;

export default {
  /**
   * Connect to IMAP email server
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
   * Disconnect from IMAP email server
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
  getEmails(options) {
    return Inbox.getEmails(options);
  },

  /**
   * Get list of available folders
   * @returns {Promise<Array>} - Array of folder names
   */
  getFolders() {
    return Inbox.getFolders();
  },

  /**
   * Search emails with advanced criteria
   * @param {Object} options - Search options
   * @param {string} options.folder - Folder to search in
   * @param {string} options.query - General search query
   * @param {string} options.from - Search by sender
   * @param {string} options.to - Search by recipient
   * @param {string} options.subject - Search by subject
   * @param {string} options.since - Search emails since date (YYYY-MM-DD)
   * @param {string} options.before - Search emails before date (YYYY-MM-DD)
   * @param {boolean} options.seen - Filter by seen status
   * @param {number} options.limit - Maximum results
   * @returns {Promise<Array>} - Array of matching email objects
   */
  searchEmails(options) {
    return Inbox.searchEmails(options);
  },

  /**
   * Move email to different folder
   * @param {Object} options - Move options
   * @param {number} options.uid - Email UID
   * @param {string} options.fromFolder - Source folder
   * @param {string} options.toFolder - Destination folder
   * @returns {Promise<boolean>} - Success status
   */
  moveEmail(options) {
    return Inbox.moveEmail(options);
  },

  /**
   * Delete email
   * @param {number} uid - Email UID
   * @param {string} folder - Folder containing the email
   * @returns {Promise<boolean>} - Success status
   */
  deleteEmail(uid, folder) {
    return Inbox.deleteEmail(uid, folder);
  },

  /**
   * Update email flags
   * @param {Object} options - Update options
   * @param {number} options.uid - Email UID
   * @param {string} options.folder - Folder containing the email
   * @param {Object} options.flags - Flags to update
   * @returns {Promise<boolean>} - Success status
   */
  updateEmailFlags(options) {
    return Inbox.updateEmailFlags(options);
  },

  /**
   * Get specific email by UID
   * @param {number} uid - Email UID
   * @param {string} folder - Folder containing the email
   * @returns {Promise<Object|null>} - Email object or null if not found
   */
  getEmailByUid(uid, folder) {
    return Inbox.getEmailByUid(uid, folder);
  },

  /**
   * Mark email as read
   * @param {number} uid - Email UID
   * @param {string} folder - Folder containing the email
   * @returns {Promise<boolean>} - Success status
   */
  markAsRead(uid, folder) {
    return Inbox.markAsRead(uid, folder);
  },

  /**
   * Mark email as unread
   * @param {number} uid - Email UID
   * @param {string} folder - Folder containing the email
   * @returns {Promise<boolean>} - Success status
   */
  markAsUnread(uid, folder) {
    return Inbox.markAsUnread(uid, folder);
  },

  /**
   * Add flags to email
   * @param {number} uid - Email UID
   * @param {string} folder - Folder containing the email
   * @param {Array} flags - Array of flags to add
   * @returns {Promise<boolean>} - Success status
   */
  addFlags(uid, folder, flags) {
    return Inbox.addFlags(uid, folder, flags);
  },

  /**
   * Remove flags from email
   * @param {number} uid - Email UID
   * @param {string} folder - Folder containing the email
   * @param {Array} flags - Array of flags to remove
   * @returns {Promise<boolean>} - Success status
   */
  removeFlags(uid, folder, flags) {
    return Inbox.removeFlags(uid, folder, flags);
  },

  /**
   * Connect to SMTP server for sending emails
   * @param {Object} config - SMTP server configuration
   * @param {string} config.host - SMTP server host
   * @param {number} config.port - SMTP server port
   * @param {string} config.username - Email username
   * @param {string} config.password - Email password
   * @param {boolean} config.useSSL - Whether to use SSL
   * @param {boolean} config.useTLS - Whether to use TLS
   * @returns {Promise<boolean>} - Connection status
   */
  connectSmtp(config) {
    return Inbox.connectSmtp(config);
  },

  /**
   * Disconnect from SMTP server
   * @returns {Promise<boolean>} - Disconnection status
   */
  disconnectSmtp() {
    return Inbox.disconnectSmtp();
  },

  /**
   * Send email
   * @param {Object} options - Email options
   * @param {Array} options.to - Array of recipient email addresses
   * @param {Array} options.cc - Array of CC recipients (optional)
   * @param {Array} options.bcc - Array of BCC recipients (optional)
   * @param {string} options.subject - Email subject
   * @param {string} options.body - Email body content
   * @param {Array} options.attachments - Array of attachments (optional)
   * @param {boolean} options.isHtml - Whether body is HTML (optional)
   * @returns {Promise<boolean>} - Success status
   */
  sendEmail(options) {
    return Inbox.sendEmail(options);
  },

  /**
   * Save email as draft
   * @param {Object} options - Email options (same as sendEmail)
   * @returns {Promise<boolean>} - Success status
   */
  saveDraft(options) {
    return Inbox.saveDraft(options);
  },

  /**
   * Delete draft email
   * @param {string} messageId - Message ID of the draft
   * @returns {Promise<boolean>} - Success status
   */
  deleteDraft(messageId) {
    return Inbox.deleteDraft(messageId);
  },

  /**
   * Get all draft emails
   * @returns {Promise<Array>} - Array of draft email objects
   */
  getDrafts() {
    return Inbox.getDrafts();
  },

  /**
   * Get email size in bytes
   * @param {number} uid - Email UID
   * @param {string} folder - Folder containing the email
   * @returns {Promise<number>} - Email size in bytes
   */
  getEmailSize(uid, folder) {
    return Inbox.getEmailSize(uid, folder);
  },

  /**
   * Get mailbox quota information
   * @returns {Promise<Object>} - Object with used and total quota
   */
  getQuota() {
    return Inbox.getQuota();
  },

  /**
   * Permanently remove deleted emails from folder
   * @param {string} folder - Folder to expunge
   * @returns {Promise<boolean>} - Success status
   */
  expunge(folder) {
    return Inbox.expunge(folder);
  }
};
