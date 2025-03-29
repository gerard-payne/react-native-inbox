declare module 'react-native-inbox' {
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
    date: string;
    body: string;
  }

  export interface InboxModule {
    connect(config: EmailConfig): Promise<boolean>;
    disconnect(): Promise<boolean>;
    getEmails(options: EmailOptions): Promise<Email[]>;
    getFolders(): Promise<string[]>;
  }

  const Inbox: InboxModule;
  export default Inbox;
} 