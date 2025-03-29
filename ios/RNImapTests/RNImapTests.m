#import <XCTest/XCTest.h>
#import <OCMock/OCMock.h>
#import "../RNImap/RNImap.h"
#import <MailCore/MailCore.h>

@interface RNImapTests : XCTestCase
@property (nonatomic, strong) RNImap *module;
@property (nonatomic, strong) id mockSession;
@end

@implementation RNImapTests

- (void)setUp {
    [super setUp];
    self.module = [[RNImap alloc] init];
    self.mockSession = OCMClassMock([MCOIMAPSession class]);
}

- (void)tearDown {
    [super tearDown];
    [self.mockSession stopMocking];
}

- (void)testConnect {
    NSDictionary *config = @{
        @"host": @"imap.gmail.com",
        @"port": @993,
        @"username": @"test@example.com",
        @"password": @"password123",
        @"useSSL": @YES
    };
    
    id mockOperation = OCMClassMock([MCOIMAPOperation class]);
    OCMStub([self.mockSession checkAccountOperation]).andReturn(mockOperation);
    
    XCTestExpectation *expectation = [self expectationWithDescription:@"connect"];
    
    [self.module connect:config resolver:^(id result) {
        XCTAssertEqual([result boolValue], YES);
        [expectation fulfill];
    } rejecter:^(NSString *code, NSString *message, NSError *error) {
        XCTFail(@"Should not reject");
    }];
    
    [self waitForExpectationsWithTimeout:1 handler:nil];
}

- (void)testDisconnect {
    XCTestExpectation *expectation = [self expectationWithDescription:@"disconnect"];
    
    [self.module disconnect:^(id result) {
        XCTAssertEqual([result boolValue], YES);
        [expectation fulfill];
    } rejecter:^(NSString *code, NSString *message, NSError *error) {
        XCTFail(@"Should not reject");
    }];
    
    [self waitForExpectationsWithTimeout:1 handler:nil];
}

- (void)testgetEmails {
    NSDictionary *options = @{
        @"folder": @"INBOX",
        @"limit": @10
    };
    
    id mockFolder = OCMClassMock([MCOIMAPFolder class]);
    id mockOperation = OCMClassMock([MCOIMAPMessagesOperation class]);
    
    OCMStub([self.mockSession fetchMessagesOperationWithFolder:mockFolder]).andReturn(mockOperation);
    
    XCTestExpectation *expectation = [self expectationWithDescription:@"getEmails"];
    
    [self.module getEmails:options resolver:^(id result) {
        XCTAssertTrue([result isKindOfClass:[NSArray class]]);
        [expectation fulfill];
    } rejecter:^(NSString *code, NSString *message, NSError *error) {
        XCTFail(@"Should not reject");
    }];
    
    [self waitForExpectationsWithTimeout:1 handler:nil];
}

- (void)testGetFolders {
    id mockOperation = OCMClassMock([MCOIMAPFetchFoldersOperation class]);
    OCMStub([self.mockSession fetchAllFoldersOperation]).andReturn(mockOperation);
    
    XCTestExpectation *expectation = [self expectationWithDescription:@"getFolders"];
    
    [self.module getFolders:^(id result) {
        XCTAssertTrue([result isKindOfClass:[NSArray class]]);
        [expectation fulfill];
    } rejecter:^(NSString *code, NSString *message, NSError *error) {
        XCTFail(@"Should not reject");
    }];
    
    [self waitForExpectationsWithTimeout:1 handler:nil];
}

@end 