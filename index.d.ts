declare module 'react-native-inbox' {
  // Existing interfaces
  export interface EmailConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    useSSL: boolean;
  }

  export interface EmailOptions {
    folder: string;
    limit: number;
  }

  export interface Email {
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

  export interface EmailAttachment {
    filename: string;
    contentType: string;
    size: number;
    data?: string; // base64 encoded content
  }

  export interface EmailFlags {
    seen: boolean;
    answered: boolean;
    flagged: boolean;
    deleted: boolean;
    draft: boolean;
  }

  export interface SearchOptions {
    folder: string;
    query?: string;
    from?: string;
    to?: string;
    subject?: string;
    since?: string;
    before?: string;
    seen?: boolean;
    limit?: number;
  }

  export interface EmailMoveOptions {
    uid: number;
    fromFolder: string;
    toFolder: string;
  }

  export interface EmailUpdateOptions {
    uid: number;
    folder: string;
    flags: Partial<EmailFlags>;
  }

  // SMTP interfaces
  export interface SmtpConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    useSSL: boolean;
    useTLS?: boolean;
  }

  export interface SendEmailOptions {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
    attachments?: SendAttachment[];
    isHtml?: boolean;
  }

  export interface SendAttachment {
    filename: string;
    contentType: string;
    data: string; // base64 encoded content
  }

  // Enhanced InboxModule interface
  export interface InboxModule {
    // Existing methods
    connect(config: EmailConfig): Promise<boolean>;
    disconnect(): Promise<boolean>;
    getEmails(options: EmailOptions): Promise<Email[]>;
    getFolders(): Promise<string[]>;

    // Enhanced IMAP methods
    searchEmails(options: SearchOptions): Promise<Email[]>;
    moveEmail(options: EmailMoveOptions): Promise<boolean>;
    deleteEmail(uid: number, folder: string): Promise<boolean>;
    updateEmailFlags(options: EmailUpdateOptions): Promise<boolean>;
    getEmailByUid(uid: number, folder: string): Promise<Email | null>;
    markAsRead(uid: number, folder: string): Promise<boolean>;
    markAsUnread(uid: number, folder: string): Promise<boolean>;
    addFlags(uid: number, folder: string, flags: string[]): Promise<boolean>;
    removeFlags(uid: number, folder: string, flags: string[]): Promise<boolean>;

    // SMTP methods
    connectSmtp(config: SmtpConfig): Promise<boolean>;
    disconnectSmtp(): Promise<boolean>;
    sendEmail(options: SendEmailOptions): Promise<boolean>;
    saveDraft(options: SendEmailOptions): Promise<boolean>;
    deleteDraft(messageId: string): Promise<boolean>;
    getDrafts(): Promise<Email[]>;

    // Utility methods
    getEmailSize(uid: number, folder: string): Promise<number>;
    getQuota(): Promise<{ used: number; total: number }>;
    expunge(folder: string): Promise<boolean>;
  }

  const Inbox: InboxModule;
  export default Inbox;
}