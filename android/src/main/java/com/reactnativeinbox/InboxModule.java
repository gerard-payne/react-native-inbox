package com.reactnativeinbox;

import android.util.Log;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.sun.mail.imap.IMAPFolder;
import com.sun.mail.imap.IMAPStore;

import javax.mail.*;
import javax.mail.internet.*;
import javax.mail.search.*;
import java.util.Properties;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;
import java.util.Enumeration;
import java.text.SimpleDateFormat;
import java.io.IOException;
import java.io.ByteArrayOutputStream;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;

public class InboxModule extends ReactContextBaseJavaModule {
    private static final String TAG = "InboxModule";
    private IMAPStore imapStore;
    private IMAPFolder currentFolder;
    private Session smtpSession;
    private javax.mail.Transport smtpTransport;

    public InboxModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Inbox";
    }

    @ReactMethod
    public void connect(ReadableMap config, Promise promise) {
        try {
            String host = config.getString("host");
            int port = config.getInt("port");
            String username = config.getString("username");
            String password = config.getString("password");
            boolean useSSL = config.getBoolean("useSSL");

            // Set up SSL configuration
            Properties props = new Properties();
            props.put("mail.store.protocol", "imap");
            props.put("mail.imap.host", host);
            props.put("mail.imap.port", port);
            props.put("mail.imap.ssl.enable", useSSL);
            props.put("mail.imap.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            props.put("mail.imap.socketFactory.fallback", "false");
            props.put("mail.imap.auth", "true");
            props.put("mail.imap.auth.mechanisms", "XOAUTH2");
            props.put("mail.imap.auth.login.disable", "true");
            props.put("mail.imap.auth.plain.disable", "true");

            // Configure SSL context with custom trust manager
            javax.net.ssl.SSLContext sslContext = javax.net.ssl.SSLContext.getInstance("TLSv1.2");

            // Create a custom trust manager that accepts the server's certificate
            javax.net.ssl.X509TrustManager customTrustManager = new javax.net.ssl.X509TrustManager() {
                @Override
                public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) {
                    // Not used for server connection
                }

                @Override
                public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) throws java.security.cert.CertificateException {
                    // Accept the server's certificate
                    try {
                        java.security.cert.CertificateFactory cf = java.security.cert.CertificateFactory.getInstance("X.509");
                        java.security.cert.X509Certificate cert = (java.security.cert.X509Certificate) cf.generateCertificate(
                            new java.io.ByteArrayInputStream(chain[0].getEncoded()));
                        cert.checkValidity();
                    } catch (Exception e) {
                        Log.e(TAG, "Certificate validation error: " + e.getMessage());
                        throw new java.security.cert.CertificateException(e.getMessage());
                    }
                }

                @Override
                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return new java.security.cert.X509Certificate[0];
                }
            };

            javax.net.ssl.TrustManager[] trustManagers = new javax.net.ssl.TrustManager[] { customTrustManager };
            sslContext.init(null, trustManagers, new java.security.SecureRandom());
            javax.net.ssl.SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();
            props.put("mail.imap.socketFactory", sslSocketFactory);

            Log.d(TAG, "Connecting to " + host + ":" + port + " with SSL: " + useSSL);
            Session session = Session.getInstance(props);
            imapStore = (IMAPStore) session.getStore("imap");
            imapStore.connect(host, port, username, password);
            Log.d(TAG, "Successfully connected to IMAP server");

            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Connection error: " + e.getMessage(), e);
            promise.reject("INBOX_CONNECT_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void disconnect(Promise promise) {
        try {
            if (currentFolder != null && currentFolder.isOpen()) {
                currentFolder.close(false);
            }
            if (imapStore != null && imapStore.isConnected()) {
                imapStore.close();
            }
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Disconnect error: " + e.getMessage());
            promise.reject("INBOX_DISCONNECT_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getEmails(ReadableMap options, Promise promise) {
        try {
            String folderName = options.getString("folder");
            int limit = options.getInt("limit");

            currentFolder = (IMAPFolder) imapStore.getFolder(folderName);
            currentFolder.open(Folder.READ_ONLY);

            Message[] messages = currentFolder.getMessages();
            int end = Math.min(messages.length, limit);
            WritableArray emails = Arguments.createArray();

            for (int i = messages.length - end; i < messages.length; i++) {
                Message message = messages[i];
                WritableMap email = convertMessageToMap(message);
                emails.pushMap(email);
            }

            promise.resolve(emails);
        } catch (Exception e) {
            Log.e(TAG, "Download error: " + e.getMessage());
            promise.reject("INBOX_DOWNLOAD_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getFolders(Promise promise) {
        try {
            Folder[] folders = imapStore.getDefaultFolder().list();
            WritableArray folderList = Arguments.createArray();

            for (Folder folder : folders) {
                folderList.pushString(folder.getName());
            }

            promise.resolve(folderList);
        } catch (Exception e) {
            Log.e(TAG, "Get folders error: " + e.getMessage());
            promise.reject("INBOX_FOLDERS_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void searchEmails(ReadableMap options, Promise promise) {
        try {
            String folderName = options.getString("folder");
            currentFolder = (IMAPFolder) imapStore.getFolder(folderName);
            currentFolder.open(Folder.READ_ONLY);

            SearchTerm searchTerm = buildSearchTerm(options);
            Message[] messages = currentFolder.search(searchTerm);

            Integer limit = options.hasKey("limit") ? options.getInt("limit") : null;
            int end = limit != null ? Math.min(messages.length, limit) : messages.length;

            WritableArray emails = Arguments.createArray();
            for (int i = messages.length - end; i < messages.length; i++) {
                Message message = messages[i];
                WritableMap email = convertMessageToMap(message);
                emails.pushMap(email);
            }

            promise.resolve(emails);
        } catch (Exception e) {
            Log.e(TAG, "Search error: " + e.getMessage());
            promise.reject("INBOX_SEARCH_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void moveEmail(ReadableMap options, Promise promise) {
        try {
            int uid = options.getInt("uid");
            String fromFolder = options.getString("fromFolder");
            String toFolder = options.getString("toFolder");

            IMAPFolder sourceFolder = (IMAPFolder) imapStore.getFolder(fromFolder);
            IMAPFolder destFolder = (IMAPFolder) imapStore.getFolder(toFolder);

            sourceFolder.open(Folder.READ_WRITE);
            destFolder.open(Folder.READ_WRITE);

            Message message = sourceFolder.getMessageByUID(uid);
            sourceFolder.copyMessages(new Message[]{message}, destFolder);
            message.setFlag(Flags.Flag.DELETED, true);

            sourceFolder.close(false);
            destFolder.close(false);

            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Move error: " + e.getMessage());
            promise.reject("INBOX_MOVE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void deleteEmail(int uid, String folder, Promise promise) {
        try {
            IMAPFolder imapFolder = (IMAPFolder) imapStore.getFolder(folder);
            imapFolder.open(Folder.READ_WRITE);

            Message message = imapFolder.getMessageByUID(uid);
            message.setFlag(Flags.Flag.DELETED, true);

            imapFolder.close(false);
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Delete error: " + e.getMessage());
            promise.reject("INBOX_DELETE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void updateEmailFlags(ReadableMap options, Promise promise) {
        try {
            int uid = options.getInt("uid");
            String folder = options.getString("folder");
            ReadableMap flagsMap = options.getMap("flags");

            IMAPFolder imapFolder = (IMAPFolder) imapStore.getFolder(folder);
            imapFolder.open(Folder.READ_WRITE);

            Message message = imapFolder.getMessageByUID(uid);
            Flags flags = new Flags();

            if (flagsMap.hasKey("seen")) {
                flags.add(Flags.Flag.SEEN);
            }
            if (flagsMap.hasKey("answered")) {
                flags.add(Flags.Flag.ANSWERED);
            }
            if (flagsMap.hasKey("flagged")) {
                flags.add(Flags.Flag.FLAGGED);
            }
            if (flagsMap.hasKey("deleted")) {
                flags.add(Flags.Flag.DELETED);
            }
            if (flagsMap.hasKey("draft")) {
                flags.add(Flags.Flag.DRAFT);
            }

            message.setFlags(flags, true);
            imapFolder.close(false);

            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Update flags error: " + e.getMessage());
            promise.reject("INBOX_UPDATE_FLAGS_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getEmailByUid(int uid, String folder, Promise promise) {
        try {
            IMAPFolder imapFolder = (IMAPFolder) imapStore.getFolder(folder);
            imapFolder.open(Folder.READ_ONLY);

            Message message = imapFolder.getMessageByUID(uid);
            if (message != null) {
                WritableMap email = convertMessageToMap(message);
                promise.resolve(email);
            } else {
                promise.resolve(null);
            }

            imapFolder.close(false);
        } catch (Exception e) {
            Log.e(TAG, "Get email by UID error: " + e.getMessage());
            promise.reject("INBOX_GET_EMAIL_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void markAsRead(int uid, String folder, Promise promise) {
        try {
            IMAPFolder imapFolder = (IMAPFolder) imapStore.getFolder(folder);
            imapFolder.open(Folder.READ_WRITE);

            Message message = imapFolder.getMessageByUID(uid);
            message.setFlag(Flags.Flag.SEEN, true);

            imapFolder.close(false);
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Mark as read error: " + e.getMessage());
            promise.reject("INBOX_MARK_READ_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void markAsUnread(int uid, String folder, Promise promise) {
        try {
            IMAPFolder imapFolder = (IMAPFolder) imapStore.getFolder(folder);
            imapFolder.open(Folder.READ_WRITE);

            Message message = imapFolder.getMessageByUID(uid);
            message.setFlag(Flags.Flag.SEEN, false);

            imapFolder.close(false);
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Mark as unread error: " + e.getMessage());
            promise.reject("INBOX_MARK_UNREAD_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void addFlags(int uid, String folder, ReadableArray flagsArray, Promise promise) {
        try {
            IMAPFolder imapFolder = (IMAPFolder) imapStore.getFolder(folder);
            imapFolder.open(Folder.READ_WRITE);

            Message message = imapFolder.getMessageByUID(uid);
            Flags flags = new Flags();

            for (int i = 0; i < flagsArray.size(); i++) {
                String flagName = flagsArray.getString(i).toUpperCase();
                switch (flagName) {
                    case "SEEN":
                        flags.add(Flags.Flag.SEEN);
                        break;
                    case "ANSWERED":
                        flags.add(Flags.Flag.ANSWERED);
                        break;
                    case "FLAGGED":
                        flags.add(Flags.Flag.FLAGGED);
                        break;
                    case "DELETED":
                        flags.add(Flags.Flag.DELETED);
                        break;
                    case "DRAFT":
                        flags.add(Flags.Flag.DRAFT);
                        break;
                }
            }

            message.setFlags(flags, true);
            imapFolder.close(false);

            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Add flags error: " + e.getMessage());
            promise.reject("INBOX_ADD_FLAGS_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void removeFlags(int uid, String folder, ReadableArray flagsArray, Promise promise) {
        try {
            IMAPFolder imapFolder = (IMAPFolder) imapStore.getFolder(folder);
            imapFolder.open(Folder.READ_WRITE);

            Message message = imapFolder.getMessageByUID(uid);
            Flags flags = new Flags();

            for (int i = 0; i < flagsArray.size(); i++) {
                String flagName = flagsArray.getString(i).toUpperCase();
                switch (flagName) {
                    case "SEEN":
                        flags.add(Flags.Flag.SEEN);
                        break;
                    case "ANSWERED":
                        flags.add(Flags.Flag.ANSWERED);
                        break;
                    case "FLAGGED":
                        flags.add(Flags.Flag.FLAGGED);
                        break;
                    case "DELETED":
                        flags.add(Flags.Flag.DELETED);
                        break;
                    case "DRAFT":
                        flags.add(Flags.Flag.DRAFT);
                        break;
                }
            }

            message.setFlags(flags, false);
            imapFolder.close(false);

            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Remove flags error: " + e.getMessage());
            promise.reject("INBOX_REMOVE_FLAGS_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void connectSmtp(ReadableMap config, Promise promise) {
        try {
            String host = config.getString("host");
            int port = config.getInt("port");
            String username = config.getString("username");
            String password = config.getString("password");
            boolean useSSL = config.getBoolean("useSSL");
            boolean useTLS = config.hasKey("useTLS") && config.getBoolean("useTLS");

            Properties props = new Properties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.host", host);
            props.put("mail.smtp.port", port);
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", useTLS);

            if (useSSL) {
                props.put("mail.smtp.ssl.enable", "true");
                props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
                props.put("mail.smtp.socketFactory.fallback", "false");
            }

            smtpSession = Session.getInstance(props);
            smtpTransport = smtpSession.getTransport("smtp");
            smtpTransport.connect(host, username, password);

            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "SMTP connection error: " + e.getMessage());
            promise.reject("SMTP_CONNECT_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void disconnectSmtp(Promise promise) {
        try {
            if (smtpTransport != null && smtpTransport.isConnected()) {
                smtpTransport.close();
            }
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "SMTP disconnect error: " + e.getMessage());
            promise.reject("SMTP_DISCONNECT_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void sendEmail(ReadableMap options, Promise promise) {
        try {
            String[] to = convertReadableArrayToStringArray(options.getArray("to"));
            String[] cc = options.hasKey("cc") ? convertReadableArrayToStringArray(options.getArray("cc")) : null;
            String[] bcc = options.hasKey("bcc") ? convertReadableArrayToStringArray(options.getArray("bcc")) : null;
            String subject = options.getString("subject");
            String body = options.getString("body");
            boolean isHtml = options.hasKey("isHtml") && options.getBoolean("isHtml");

            Message message = new MimeMessage(smtpSession);
            message.setFrom(new InternetAddress(smtpSession.getProperty("mail.user")));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(String.join(",", to)));

            if (cc != null && cc.length > 0) {
                message.setRecipients(Message.RecipientType.CC, InternetAddress.parse(String.join(",", cc)));
            }
            if (bcc != null && bcc.length > 0) {
                message.setRecipients(Message.RecipientType.BCC, InternetAddress.parse(String.join(",", bcc)));
            }

            message.setSubject(subject);
            message.setSentDate(new Date());

            if (isHtml) {
                message.setContent(body, "text/html");
            } else {
                message.setText(body);
            }

            smtpTransport.sendMessage(message, message.getAllRecipients());
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Send email error: " + e.getMessage());
            promise.reject("SMTP_SEND_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void saveDraft(ReadableMap options, Promise promise) {
        try {
            // For now, we'll just save as a regular email in Drafts folder
            // In a real implementation, you'd want proper draft management
            String[] to = convertReadableArrayToStringArray(options.getArray("to"));
            String[] cc = options.hasKey("cc") ? convertReadableArrayToStringArray(options.getArray("cc")) : null;
            String[] bcc = options.hasKey("bcc") ? convertReadableArrayToStringArray(options.getArray("bcc")) : null;
            String subject = options.getString("subject");
            String body = options.getString("body");

            IMAPFolder draftsFolder = (IMAPFolder) imapStore.getFolder("Drafts");
            draftsFolder.open(Folder.READ_WRITE);

            Message message = new MimeMessage(smtpSession);
            message.setFrom(new InternetAddress(smtpSession.getProperty("mail.user")));
            if (to.length > 0) {
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(String.join(",", to)));
            }
            if (cc != null && cc.length > 0) {
                message.setRecipients(Message.RecipientType.CC, InternetAddress.parse(String.join(",", cc)));
            }
            if (bcc != null && bcc.length > 0) {
                message.setRecipients(Message.RecipientType.BCC, InternetAddress.parse(String.join(",", bcc)));
            }

            message.setSubject(subject);
            message.setText(body);
            message.setFlag(Flags.Flag.DRAFT, true);

            draftsFolder.appendMessages(new Message[]{message});
            draftsFolder.close(false);

            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Save draft error: " + e.getMessage());
            promise.reject("SMTP_SAVE_DRAFT_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void deleteDraft(String messageId, Promise promise) {
        try {
            // This is a simplified implementation
            // In a real implementation, you'd search for the draft by message ID
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Delete draft error: " + e.getMessage());
            promise.reject("SMTP_DELETE_DRAFT_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getDrafts(Promise promise) {
        try {
            IMAPFolder draftsFolder = (IMAPFolder) imapStore.getFolder("Drafts");
            draftsFolder.open(Folder.READ_ONLY);

            Message[] messages = draftsFolder.getMessages();
            WritableArray drafts = Arguments.createArray();

            for (Message message : messages) {
                if (message.isSet(Flags.Flag.DRAFT)) {
                    WritableMap email = convertMessageToMap(message);
                    drafts.pushMap(email);
                }
            }

            draftsFolder.close(false);
            promise.resolve(drafts);
        } catch (Exception e) {
            Log.e(TAG, "Get drafts error: " + e.getMessage());
            promise.reject("SMTP_GET_DRAFTS_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getEmailSize(int uid, String folder, Promise promise) {
        try {
            IMAPFolder imapFolder = (IMAPFolder) imapStore.getFolder(folder);
            imapFolder.open(Folder.READ_ONLY);

            Message message = imapFolder.getMessageByUID(uid);
            int size = message.getSize();

            imapFolder.close(false);
            promise.resolve(size);
        } catch (Exception e) {
            Log.e(TAG, "Get email size error: " + e.getMessage());
            promise.reject("INBOX_GET_SIZE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getQuota(Promise promise) {
        try {
            // This is a simplified implementation
            // Real quota support would require QUOTA extension
            WritableMap quota = Arguments.createMap();
            quota.putInt("used", 0);
            quota.putInt("total", 0);
            promise.resolve(quota);
        } catch (Exception e) {
            Log.e(TAG, "Get quota error: " + e.getMessage());
            promise.reject("INBOX_QUOTA_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void expunge(String folder, Promise promise) {
        try {
            IMAPFolder imapFolder = (IMAPFolder) imapStore.getFolder(folder);
            imapFolder.open(Folder.READ_WRITE);
            imapFolder.expunge();
            imapFolder.close(false);

            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Expunge error: " + e.getMessage());
            promise.reject("INBOX_EXPUNGE_ERROR", e.getMessage());
        }
    }

    private WritableMap convertMessageToMap(Message message) throws MessagingException, IOException {
        WritableMap email = Arguments.createMap();

        // Basic fields
        email.putString("subject", message.getSubject() != null ? message.getSubject() : "");
        email.putString("from", message.getFrom() != null && message.getFrom().length > 0 ?
            message.getFrom()[0].toString() : "");

        // Recipients
        Address[] toAddresses = message.getRecipients(Message.RecipientType.TO);
        if (toAddresses != null && toAddresses.length > 0) {
            WritableArray toArray = Arguments.createArray();
            for (Address addr : toAddresses) {
                toArray.pushString(addr.toString());
            }
            email.putArray("to", toArray);
        } else {
            email.putArray("to", Arguments.createArray());
        }

        // CC recipients
        Address[] ccAddresses = message.getRecipients(Message.RecipientType.CC);
        if (ccAddresses != null && ccAddresses.length > 0) {
            WritableArray ccArray = Arguments.createArray();
            for (Address addr : ccAddresses) {
                ccArray.pushString(addr.toString());
            }
            email.putArray("cc", ccArray);
        }

        // BCC recipients
        Address[] bccAddresses = message.getRecipients(Message.RecipientType.BCC);
        if (bccAddresses != null && bccAddresses.length > 0) {
            WritableArray bccArray = Arguments.createArray();
            for (Address addr : bccAddresses) {
                bccArray.pushString(addr.toString());
            }
            email.putArray("bcc", bccArray);
        }

        email.putString("date", message.getSentDate() != null ? message.getSentDate().toString() : "");

        // Message content
        StringBuilder body = new StringBuilder();
        try {
            Object content = message.getContent();
            if (content instanceof String) {
                body.append((String) content);
            } else if (content instanceof Multipart) {
                Multipart multipart = (Multipart) content;
                for (int i = 0; i < multipart.getCount(); i++) {
                    BodyPart bodyPart = multipart.getBodyPart(i);
                    if (bodyPart.getContentType().toLowerCase().startsWith("text/plain")) {
                        body.append(bodyPart.getContent().toString());
                    }
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "Error reading message content: " + e.getMessage());
        }
        email.putString("body", body.toString());

        // Message ID and UID
        try {
            if (message instanceof javax.mail.internet.MimeMessage) {
                String[] messageIdHeaders = message.getHeader("Message-ID");
                if (messageIdHeaders != null && messageIdHeaders.length > 0) {
                    email.putString("messageId", messageIdHeaders[0]);
                }
            }

            if (currentFolder != null) {
                email.putInt("uid", currentFolder.getUID(message));
            }
        } catch (Exception e) {
            Log.w(TAG, "Error getting message metadata: " + e.getMessage());
        }

        // Flags
        Flags flags = message.getFlags();
        WritableMap flagsMap = Arguments.createMap();
        flagsMap.putBoolean("seen", flags.contains(Flags.Flag.SEEN));
        flagsMap.putBoolean("answered", flags.contains(Flags.Flag.ANSWERED));
        flagsMap.putBoolean("flagged", flags.contains(Flags.Flag.FLAGGED));
        flagsMap.putBoolean("deleted", flags.contains(Flags.Flag.DELETED));
        flagsMap.putBoolean("draft", flags.contains(Flags.Flag.DRAFT));
        email.putMap("flags", flagsMap);

        return email;
    }

    private SearchTerm buildSearchTerm(ReadableMap options) throws Exception {
        List<SearchTerm> terms = new ArrayList<>();

        if (options.hasKey("query") && !options.getString("query").isEmpty()) {
            String query = options.getString("query");
            SearchTerm subjectTerm = new SubjectTerm(query);
            SearchTerm bodyTerm = new BodyTerm(query);
            terms.add(new OrTerm(subjectTerm, bodyTerm));
        }

        if (options.hasKey("from") && !options.getString("from").isEmpty()) {
            terms.add(new FromStringTerm(options.getString("from")));
        }

        if (options.hasKey("to") && !options.getString("to").isEmpty()) {
            terms.add(new RecipientStringTerm(Message.RecipientType.TO, options.getString("to")));
        }

        if (options.hasKey("subject") && !options.getString("subject").isEmpty()) {
            terms.add(new SubjectTerm(options.getString("subject")));
        }

        if (options.hasKey("since") && !options.getString("since").isEmpty()) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date sinceDate = sdf.parse(options.getString("since"));
            terms.add(new SentDateTerm(ComparisonTerm.GE, sinceDate));
        }

        if (options.hasKey("before") && !options.getString("before").isEmpty()) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date beforeDate = sdf.parse(options.getString("before"));
            terms.add(new SentDateTerm(ComparisonTerm.LE, beforeDate));
        }

        if (options.hasKey("seen")) {
            boolean seen = options.getBoolean("seen");
            terms.add(new FlagTerm(new Flags(Flags.Flag.SEEN), seen));
        }

        if (terms.size() == 1) {
            return terms.get(0);
        } else if (terms.size() > 1) {
            return new AndTerm(terms.toArray(new SearchTerm[0]));
        } else {
            return new SubjectTerm("*"); // Match all if no criteria
        }
    }

    private String[] convertReadableArrayToStringArray(ReadableArray array) {
        String[] result = new String[array.size()];
        for (int i = 0; i < array.size(); i++) {
            result[i] = array.getString(i);
        }
        return result;
    }
} 