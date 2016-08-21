/**
 * Created by mosesesan on 8/18/16.
 */

import React, { Component } from 'react';
import { StatusBar, Platform, View, Dimensions,
    UIManager, TextInput,Text,
    TouchableOpacity, Image, ListView,
    DatePickerIOS, Switch, AsyncStorage, PushNotificationIOS, NativeModules
} from 'react-native';

import {Actions } from 'react-native-router-flux';
var CustomActionSheet = require('react-native-custom-action-sheet');
var PushNotification = require('react-native-push-notification');

var {width: windowWidth, height:windowHeight} = Dimensions.get('window');
var NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 64 : 54;

var moment = require('moment');

const styles = require('./styles');
import NavBarView from './nav-bar.js'



export default class Settings extends Component {

    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            date: new Date(),
            //timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
            modalVisible: false,
            notifications: {morning: [false, null], midday: [false, null], evening: [false, null]}
        };
    }

    componentWillReceiveProps(newProps) {
        //if (Platform.OS === "ios") StatusBar.setBarStyle('light-content', true);
    }

    componentDidMount() {
        //PushNotificationIOS.cancelAllLocalNotifications();
        this._loadInitialState().done();
    }


    componentWillUnmount() {

    }


    async _loadInitialState() {
        var _this = this;
        try {
            let keys = ['morning', 'midday', 'evening'];
            await AsyncStorage.multiGet(keys, (err, stores) => {
                var notifications = {};

                stores.map((result, i, store) => {
                    // get at each store's key/value so you can work with it
                    let key = store[i][0];
                    let value = store[i][1];

                    notifications[key] = JSON.parse(value);
                });

                _this.setState({notifications: notifications})
            });
        } catch (error) {
            alert('AsyncStorage error: ' + error.message);
        }
    }



    //timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}



    render() {
        return (
            <View style={{flex:1, backgroundColor: "#2C2D30"}}>
                <NavBarView title={"Settings"}/>
                <View style={{}}>



                    <View style={{}}>


                        <View style={{flexDirection: "row",  alignItems: "center", paddingTop: 15, paddingBottom: 15, borderBottomWidth:1, borderBottomColor: "rgba(209,213,212, .1)"}}>
                            <TouchableOpacity style={{ flex: 1}}
                                 onPress={() => {(!this.state.notifications.morning[0]) ?  null : this.showDateModal("morning")}}>
                                <Text style={{paddingLeft: 10, fontStyle: "normal", color:"#fff", fontSize: 17, fontWeight: "500"}}>
                                    Morning
                                </Text>
                                <Text style={{fontStyle: "normal", color:"#A3A5A4", fontSize: 14, fontWeight: "500", paddingLeft: 10, paddingTop: 3, paddingBottom:5, flex:1}}>
                                    {(!this.state.notifications.morning[0]) ?  "Notification Off" : this.state.notifications.morning[1]+" - Tap to change" }
                                </Text>
                            </TouchableOpacity>
                            <Switch style={{width: 60,justifyContent: "flex-end"}}
                                onValueChange={(value) => this.turnOnNotification("morning", value)}
                                value={this.state.notifications.morning[0]} />
                        </View>


                        <View style={{flexDirection: "row",  alignItems: "center", paddingTop: 15, paddingBottom: 15, borderBottomWidth:1, borderBottomColor: "rgba(209,213,212, .1)"}}>
                            <TouchableOpacity style={{ flex: 1}}
                                              onPress={() => {(!this.state.notifications.midday[0]) ?  null : this.showDateModal("midday")}}>
                                <Text style={{paddingLeft: 10, fontStyle: "normal", color:"#fff", fontSize: 17, fontWeight: "500"}}>
                                    Midday
                                </Text>
                                <Text style={{fontStyle: "normal", color:"#A3A5A4", fontSize: 14, fontWeight: "500", paddingLeft: 10, paddingTop: 3, paddingBottom:5, flex:1}}>
                                    {(!this.state.notifications.midday[0]) ?  "Notification Off" : this.state.notifications.midday[1]+" - Tap to change" }
                                </Text>
                            </TouchableOpacity>
                            <Switch style={{width: 60,justifyContent: "flex-end"}}
                                onValueChange={(value) => this.turnOnNotification("midday", value)}
                                value={this.state.notifications.midday[0]} />
                        </View>

                        <View style={{flexDirection: "row",  alignItems: "center", paddingTop: 15, paddingBottom: 15, borderBottomWidth:1, borderBottomColor: "rgba(209,213,212, .1)"}}>
                            <TouchableOpacity style={{ flex: 1}}
                                              onPress={() => {(!this.state.notifications.evening[0]) ?  null : this.showDateModal("evening")}}>
                                <Text style={{paddingLeft: 10, fontStyle: "normal", color:"#fff", fontSize: 17, fontWeight: "500"}}>
                                    Evening
                                </Text>
                                <Text style={{fontStyle: "normal", color:"#A3A5A4", fontSize: 14, fontWeight: "500", paddingLeft: 10, paddingTop: 3, paddingBottom:5, flex:1}}>
                                    {(!this.state.notifications.evening[0]) ?  "Notification Off" : this.state.notifications.evening[1]+" - Tap to change" }
                                </Text>
                            </TouchableOpacity>
                            <Switch style={{width: 60,justifyContent: "flex-end"}}
                                onValueChange={(value) => this.turnOnNotification("evening", value)}
                                value={this.state.notifications.evening[0]} />
                        </View>




                    </View>
                    <View>
                        <CustomActionSheet buttonText="Done"
                                           modalVisible={this.state.modalVisible}
                                           onCancel={() => this.closeDateModal()}>
                            <View style={styles.datePickerContainer}>
                                <DatePickerIOS
                                    style={{ backgroundColor: "#EEEEEE"}}
                                    date={this.state.date}
                                    mode="time"
                                    onDateChange={this.onDateChange.bind(this)}
                                    minuteInterval={10}
                                    />
                            </View>
                        </CustomActionSheet>
                    </View>

                </View>
            </View>
        );
    }

    turnOnNotification(key, val){
        let notifications = this.state.notifications;
        var notificationInfo = notifications[key];
        notificationInfo[0] =  val;
        notifications[key] = notificationInfo;

        this.setState({notifications: notifications, current: key})

        if (val){
            if (notificationInfo[1] !== null){
                //schedule a new notification for that time of the day currently set
                this.scheduleNotification(notificationInfo[1], key);
            }
        //Open DatePicker
            this.setState({modalVisible: val})
        }else{
            AsyncStorage.setItem(key, JSON.stringify(this.state.notifications[key]), (err) => {
                if (err === null){
                    NativeModules.CustomPushNotifications.cancelLocalNotification(key, (status) =>{
                        console.log(status)
                    })
                }
            });
        }
    }

    showDateModal(key){
        this.setState({current: key})
        this.setState({modalVisible: true});
    }

    closeDateModal(key){
        this.setState({modalVisible: false})
    }

    onDateChange(date) {
        var _this = this;
        let formattedDate = moment(date).format('h:mm a');


        let key = this.state.current;

        let notifications = this.state.notifications;
        var notificationInfo = notifications[key];
        notificationInfo[1] =  formattedDate;
        notifications[key] = notificationInfo;

        this.setState({date: date, notifications: notifications});


        AsyncStorage.setItem(key, JSON.stringify(notificationInfo), (error) => {
            if (!error){
                //schedule a new notification for that time of the day
                _this.scheduleNotification(date, key);
            }
        });
    }

    scheduleNotification(fireDate, timeOfDay){
        var message = "Today's Motivation is now available.";
        var now = new Date();
        if (fireDate < now) {
            // selected date is in the past
            fireDate =
                moment(fireDate).add(1, 'days');
        }

        NativeModules.CustomPushNotifications.scheduleLocalNotification({
            fireDate : fireDate,
            alertBody : message,
            userInfo : {key: timeOfDay}
        }, timeOfDay, (status) =>{
            alert(status)
        })
    }

}

