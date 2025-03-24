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

public class RNInboxModule extends ReactContextBaseJavaModule {
    private static final String TAG = "RNInboxModule";
    private IMAPStore store;
    private IMAPFolder folder;

    public RNInboxModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNInbox";
    }

    @ReactMethod
    public void connect(ReadableMap config, Promise promise) {
        try {
            String host = config.getString("host");
            int port = config.getInt("port");
            String username = config.getString("username");
            String password = config.getString("password");
            boolean useSSL = config.getBoolean("useSSL");

            Properties props = new Properties();
            props.put("mail.store.protocol", "imap");
            props.put("mail.imap.host", host);
            props.put("mail.imap.port", port);
            props.put("mail.imap.ssl.enable", useSSL);
            props.put("mail.imap.ssl.trust", "*"); // Trust all certificates
            props.put("mail.imap.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            
            Session session = Session.getInstance(props);
            store = (IMAPStore) session.getStore("imap");
            store.connect(host, port, username, password);

            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Connection error: " + e.getMessage());
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
    public void downloadEmails(ReadableMap options, Promise promise) {
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