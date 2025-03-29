#import "RNImap.h"
#import <MailCore/MailCore.h>

@implementation RNImap {
    MCOIMAPSession *session;
    MCOIMAPFolder *currentFolder;
}

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents
{
    return @[];
}

RCT_EXPORT_METHOD(connect:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSString *host = config[@"host"];
    NSNumber *port = config[@"port"];
    NSString *username = config[@"username"];
    NSString *password = config[@"password"];
    BOOL useSSL = [config[@"useSSL"] boolValue];

    session = [[MCOIMAPSession alloc] init];
    session.hostname = host;
    session.port = [port unsignedIntegerValue];
    session.username = username;
    session.password = password;
    session.connectionType = useSSL ? MCOConnectionTypeTLS : MCOConnectionTypeClear;
    
    // Configure SSL/TLS validation
    session.connectionLogger = ^(void *connectionID, MCOConnectionLogType type, NSData *data) {
        NSLog(@"Connection log: %@", [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
    };
    
    // Use system certificates
    session.allowInvalidCertificates = NO;
    session.allowCertificateChainValidation = YES;

    MCOIMAPOperation *checkOp = [session checkAccountOperation];
    [checkOp start:^(NSError *error) {
        if (error) {
            NSLog(@"Connection error: %@", error);
            reject(@"IMAP_CONNECT_ERROR", error.localizedDescription, error);
        } else {
            NSLog(@"Successfully connected to IMAP server");
            resolve(@YES);
        }
    }];
}

RCT_EXPORT_METHOD(disconnect:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (currentFolder) {
        MCOIMAPOperation *closeOp = [session closeFolderOperation:currentFolder];
        [closeOp start:^(NSError *error) {
            if (error) {
                reject(@"IMAP_DISCONNECT_ERROR", error.localizedDescription, error);
            } else {
                resolve(@YES);
            }
        }];
    } else {
        resolve(@YES);
    }
}

RCT_EXPORT_METHOD(getEmails:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSString *folderName = options[@"folder"];
    NSNumber *limit = options[@"limit"];

    MCOIMAPFolder *folder = [MCOIMAPFolder folderWithPath:folderName];
    currentFolder = folder;

    MCOIMAPMessagesOperation *fetchOp = [session fetchMessagesOperationWithFolder:folder];
    fetchOp.extraHeaders = @{@"limit": [limit stringValue]};
    
    [fetchOp start:^(NSError *error, NSArray *messages, MCOIndexSet *vanishedMessages) {
        if (error) {
            reject(@"IMAP_DOWNLOAD_ERROR", error.localizedDescription, error);
        } else {
            NSMutableArray *emails = [NSMutableArray array];
            
            for (MCOIMAPMessage *message in messages) {
                NSMutableDictionary *email = [NSMutableDictionary dictionary];
                email[@"subject"] = message.header.subject;
                email[@"from"] = message.header.from.displayName ?: message.header.from.mailbox;
                email[@"date"] = message.header.date.description;
                
                // Fetch message content
                MCOIMAPFetchContentOperation *contentOp = [session fetchMessageContentOperationWithFolder:folder uid:message.uid];
                [contentOp start:^(NSError *error, NSData *messageData) {
                    if (!error) {
                        MCOMessageParser *parser = [MCOMessageParser messageParserWithData:messageData];
                        email[@"body"] = parser.plainTextBodyRendering;
                        [emails addObject:email];
                        
                        if (emails.count == messages.count) {
                            resolve(emails);
                        }
                    }
                }];
            }
        }
    }];
}

RCT_EXPORT_METHOD(getFolders:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    MCOIMAPFetchFoldersOperation *fetchOp = [session fetchAllFoldersOperation];
    [fetchOp start:^(NSError *error, NSArray *folders) {
        if (error) {
            reject(@"IMAP_FOLDERS_ERROR", error.localizedDescription, error);
        } else {
            NSMutableArray *folderNames = [NSMutableArray array];
            for (MCOIMAPFolder *folder in folders) {
                [folderNames addObject:folder.path];
            }
            resolve(folderNames);
        }
    }];
}

@end 