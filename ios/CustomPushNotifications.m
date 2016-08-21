//
//  CustomPushNotifications.m
//  SelfApp
//
//  Created by Moses Esan on 8/20/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "CustomPushNotifications.h"

#import "RCTPushNotificationManager.h"

#import "RCTBridge.h"
#import "RCTConvert.h"
#import "RCTEventDispatcher.h"
#import "RCTUtils.h"

@implementation CustomPushNotifications

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(scheduleLocalNotification:(NSDictionary *)details
                  key:(NSString *)key
                  callback:(RCTResponseSenderBlock)callback)
{
  
  NSLog(@"Setting");
  
  NSDictionary *pushNotification = [self checkIfNotificationExist:key];
  
  if ([[pushNotification objectForKey:@"status"] isEqualToString:@"YES"]){

    //Cancel the notification
    [RCTSharedApplication() cancelLocalNotification:[pushNotification objectForKey:@"pushObj"]];
  }
  
  
  //Create a new notification
  UILocalNotification *notification = [UILocalNotification new];
  notification.fireDate = details[@"fireDate"];
  notification.alertBody = [RCTConvert NSString:details[@"alertBody"]];
  notification.alertAction = [RCTConvert NSString:details[@"alertAction"]];
  notification.soundName = [RCTConvert NSString:details[@"soundName"]] ?: UILocalNotificationDefaultSoundName;
  notification.userInfo = [RCTConvert NSDictionary:details[@"userInfo"]];
  notification.category = [RCTConvert NSString:details[@"category"]];
  if (details[@"applicationIconBadgeNumber"]) {
    notification.applicationIconBadgeNumber = [RCTConvert NSInteger:details[@"applicationIconBadgeNumber"]];
  }
  if (details[@"repeatInterval"]) {
    notification.repeatInterval = NSCalendarUnitDay;
  }
  
  [RCTSharedApplication() scheduleLocalNotification:notification];
}

RCT_EXPORT_METHOD(cancelLocalNotification:(NSString *)key
                  callback:(RCTResponseSenderBlock)callback)
{
  NSDictionary *pushNotification = [self checkIfNotificationExist:key];
  
  if ([[pushNotification objectForKey:@"status"] isEqualToString:@"YES"]){
//     CANCEL THE Notification
    [RCTSharedApplication() cancelLocalNotification:[pushNotification objectForKey:@"pushObj"]];
  }
}

-(NSDictionary *)checkIfNotificationExist:(NSString *)key{
  UIApplication *app = [UIApplication sharedApplication];
  NSArray *eventArray = [app scheduledLocalNotifications];

  NSString *val = @"NO";
  UILocalNotification* pushObj = [UILocalNotification new];
  
  for (int i=0; i<[eventArray count]; i++)
  {
    UILocalNotification* oneEvent = [eventArray objectAtIndex:i];
    NSDictionary *userInfoCurrent = oneEvent.userInfo;
    
    NSString *uid=[NSString stringWithFormat:@"%@",[userInfoCurrent valueForKey:@"key"]];
    if ([uid isEqualToString:key]){
      val = @"YES";
      pushObj = oneEvent;
      break;
    }
  }
  
  NSDictionary *d = @{
                      @"status": val,
                      @"pushObj": pushObj
                      };
  
  return d;
}

@end
