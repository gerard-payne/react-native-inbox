package com.reactnativeinbox;

import android.util.Log;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.sun.mail.imap.IMAPFolder;
import com.sun.mail.imap.IMAPStore;

import javax.mail.*;
import javax.mail.internet.*;
import java.util.Properties;
import java.util.ArrayList;
import java.util.List;

public class InboxModule extends ReactContextBaseJavaModule {
    private static final String TAG = "InboxModule";
    private IMAPStore store;
    private IMAPFolder folder;

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
            store = (IMAPStore) session.getStore("imap");
            store.connect(host, port, username, password);
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
            if (folder != null && folder.isOpen()) {
                folder.close(false);
            }
            if (store != null && store.isConnected()) {
                store.close();
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

            folder = (IMAPFolder) store.getFolder(folderName);
            folder.open(Folder.READ_ONLY);

            Message[] messages = folder.getMessages();
            int end = Math.min(messages.length, limit);
            WritableArray emails = Arguments.createArray();

            for (int i = messages.length - end; i < messages.length; i++) {
                Message message = messages[i];
                WritableMap email = Arguments.createMap();
                
                email.putString("subject", message.getSubject());
                email.putString("from", message.getFrom()[0].toString());
                email.putString("date", message.getSentDate().toString());
                
                // Get email content
                Object content = message.getContent();
                if (content instanceof String) {
                    email.putString("body", (String) content);
                } else if (content instanceof Multipart) {
                    Multipart multipart = (Multipart) content;
                    StringBuilder body = new StringBuilder();
                    for (int j = 0; j < multipart.getCount(); j++) {
                        BodyPart bodyPart = multipart.getBodyPart(j);
                        if (bodyPart.getContentType().startsWith("text/plain")) {
                            body.append(bodyPart.getContent().toString());
                        }
                    }
                    email.putString("body", body.toString());
                }

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
            Folder[] folders = store.getDefaultFolder().list();
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
} 