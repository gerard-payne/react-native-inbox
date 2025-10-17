# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-10-15

### 🚀 Added

#### Complete IMAP Enhancement
- **Advanced Email Search**: Multi-criteria search with sender, recipient, subject, date range, and read/unread filtering
- **Email Management Operations**: Move emails between folders, delete emails, mark as read/unread
- **Flag Management System**: Add/remove email flags (seen, answered, flagged, deleted, draft)
- **Enhanced Email Retrieval**: Get specific emails by UID, fetch email sizes, mailbox quota information
- **Folder Operations**: Comprehensive folder management, expunge deleted emails
- **Email Threading Support**: Message ID tracking for conversation management

#### Full SMTP Implementation
- **Email Sending**: Complete email composition with CC/BCC support, HTML/text content
- **Draft Management**: Save, retrieve, and delete email drafts
- **SMTP Configuration**: Separate SMTP connection with SSL/TLS encryption options
- **Multi-recipient Support**: Handle multiple TO/CC/BCC recipients

#### Enhanced Developer Experience
- **Comprehensive TypeScript Support**: Complete type definitions for all 25+ new methods
- **Extensive Test Suite**: 25+ test cases covering all functionality with error scenarios
- **Enhanced Demo Application**: Tabbed interface showcasing all features
- **Improved Documentation**: Complete API reference with practical examples

### 🛠️ Changed

#### Technical Improvements
- **Cross-Platform Compatibility**: Enhanced iOS MailCore2 and Android JavaMail implementations
- **Security Enhancements**: SSL/TLS encryption for both IMAP and SMTP protocols
- **Performance Optimizations**: Memory efficient operations with proper resource cleanup
- **API Consistency**: Unified interface across both platforms

#### Breaking Changes
- Email object structure now includes `to`, `cc`, `bcc` arrays, `messageId`, `uid`, `flags`, and `headers` fields
- `getEmail` method renamed to `getEmails` for consistency
- SMTP methods are now separate from IMAP methods

### 📋 Migration Guide

#### New Method Signatures
- `searchEmails(options)` - Advanced search with multiple criteria
- `moveEmail(options)` - Move emails between folders
- `connectSmtp(config)` - Separate SMTP connection
- `sendEmail(options)` - Send emails with full recipient support

#### Enhanced Existing Methods
- `getEmails(options)` - Now returns enhanced email objects with metadata
- `connect(config)` - Improved SSL/TLS handling and error reporting
- `getFolders()` - Better folder information and error handling

## [1.0.3] - 2024-01-01

### Added
- Initial release with basic IMAP functionality
- Connect/disconnect from email servers
- Download emails from folders
- Get list of available folders

### Features
- Basic email reading capabilities
- Cross-platform support (iOS/Android)
- Simple configuration options

## [1.0.0] - 2023-12-01

### Added
- Initial project setup
- Basic React Native module structure
- Platform-specific native implementations
