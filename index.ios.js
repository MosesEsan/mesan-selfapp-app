import React, { Component } from 'react';
import { PanResponder, AppRegistry, Platform, StatusBar, AppState, PushNotificationIOS, AlertIOS, AsyncStorage, NativeModules} from 'react-native';

import { Router, Scene, Actions } from 'react-native-router-flux';

import Main from './main.js'
import NewEntry from './new-entry.js'
import Entries from './entries.js'
import Settings from './settings.js'
import Welcome from './welcome.js'

var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var PushNotification = require('react-native-push-notification');

var SQLite = require('react-native-sqlite-storage');
SQLite.DEBUG(true);
SQLite.enablePromise(true);
SQLite.enablePromise(false);


var database_name = "SelfApp.db";
var database_version = "1.0";
var database_displayname = "SQLite Test Database";
var database_size = 200000;
var db, me;

const navigationBarStyle = {
    backgroundColor: '#CB1B22',
    overflow: "hidden",
    position: "absolute",
    top: 0, left: 0, right: 0
};

const titleStyle = {
    color: "#FFFFFF",
    fontWeight:"500",
    fontSize: 17, textAlign:"center",
};

class SelfApp extends Component {
    constructor(props){
        super(props)
        this.state = {
            db:null,
            demo: true
        }
    }

    componentDidMount(){
        me = this;
        if (Platform.OS === "ios") StatusBar.setBarStyle('light-content', true);
        this.init();

        PushNotification.configure({
            onNotification: function(notification) {
                AlertIOS.alert(
                    notification.title,
                    notification.message,
                    [{
                        text: 'Dismiss',
                        onPress: null,
                    }]
                );
            }
        });

        //AppState.addEventListener('change', this._handleAppStateChange);

        //this.checkCurrent();
    }

    componentWillUnmount(){
        this.closeDatabase();
    }

    init(){
        //alert("Opening database ...");
        db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB);
        this.setState({db: db});
        this.populateDatabase(db);

    }


    populateDatabase(db){
        var that = this;
        //alert("Database integrity check");
        //that.setState(that.state);
        db.executeSql('SELECT 1 FROM Version LIMIT 1', [],
            function () {
                //alert("Database is ready...");

                //that.setState(that.state);
            },
            function (error) {
                console.log("received version error:", error);
                //alert("Database not yet ready ... populating data");
                //that.setState(that.state);
                db.transaction(that.populateDB, that.errorCB, function () {
                    //alert("Database populated ...");
                    //that.setState(that.state);


                    //if (this.state.demo){
                    //    alert("Sample entries have been added for demo purpose.");
                    //
                    //    var data = ["Freedom", "​You have two paths in love and life. \n1)Live Your Dreams.  \n \n 2)Live other people's dreams."];
                    //    var data1 = ["Success", "​You will fail many times but who is counting"];
                    //
                    //    db.transaction((tx) => {
                    //        tx.executeSql('INSERT INTO entries (title, text, active) VALUES ("'+data[0]+'", "'+data[1]+'", 1);', [], (tx, results) => {});
                    //        tx.executeSql('INSERT INTO entries (title, text, active) VALUES ("'+data1[0]+'", "'+data1[1]+'", 1);', [], (tx, results) => {});
                    //    });
                    //
                    //}
                });
            });
    }

    populateDB(tx) {
        //alert("Executing DROP stmts");

        tx.executeSql('DROP TABLE IF EXISTS entries;');
        tx.executeSql('DROP TABLE IF EXISTS pushes;');

        //alert("Executing CREATE stmts");

        tx.executeSql('CREATE TABLE IF NOT EXISTS Version( '
            + 'version_id INTEGER PRIMARY KEY NOT NULL); ', [], this.successCB, this.errorCB);

        tx.executeSql('CREATE TABLE IF NOT EXISTS entries( '
            + 'id INTEGER PRIMARY KEY NOT NULL, '
            + 'title VARCHAR(255) NOT NULL, '
            + 'text TEXT NOT NULL, '
            + 'created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,'
            + 'modified_at date,'
            + 'active INT(1) NOT NULL); ', [], this.successCB, this.errorCB);

        tx.executeSql('CREATE TABLE IF NOT EXISTS pushes( '
            + 'id INTEGER PRIMARY KEY NOT NULL, '
            + 'entry_id int(11) NOT NULL, '
            + 'pushed_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,'
            + 'FOREIGN KEY ( entry_id ) REFERENCES entries ( id ));', []);

        //alert("Executing INSERT stmts");


        var data = ["Freedom", "​You have two paths in love and life. \n1)Live Your Dreams.  \n \n 2)Live other people's dreams."];
        var data1 = ["Success", "​You will fail many times but who is counting"];


        if (me.state.demo) {
            tx.executeSql('INSERT INTO entries (title, text, active) VALUES ("' + data[0] + '", "' + data[1] + '", 1);', []);
            tx.executeSql('INSERT INTO entries (title, text, active) VALUES ("' + data1[0] + '", "' + data1[1] + '", 1);', []);
        }

        console.log("all config SQL done");
    }


    _handleAppStateChange(currentAppState) {

        if (currentAppState === "active"){

            PushNotificationIOS.getScheduledLocalNotifications(function(result){
                //alert("back");
                //alert(result);
            })
        }else{
            //console.log("out "+currentAppState)
        }
    }

    checkCurrent(){
        var _this = this;
        PushNotificationIOS.getScheduledLocalNotifications(function(result){
            //if there are no scheduled notificatios
            if (result.length < 1){
                //check if the user has notificatons turned on in settings
                try {
                    let keys = ['morning', 'midday', 'evening'];
                    AsyncStorage.multiGet(keys, (err, stores) => {
                        stores.map((result, i, store) => {
                            // get at each store's key/value so you can work with it
                            let key = store[i][0];
                            let value = store[i][1];

                            //if there is a notification object for that time of the day
                            if (value !== null){
                                let notiObj = JSON.parse(value);
                                var status = notiObj[0]; //get the status

                                //if set to true, set a new notification for that time of the day
                                if (status) {
                                    if (notiObj[1] !== null){
                                        //schedule a new notification for that time of the day
                                        _this.scheduleNotification(notiObj[1], key);
                                    }
                                }
                            }
                        });
                    });
                } catch (error) {
                    alert('AsyncStorage error: ' + error.message);
                }
            }else{
                //if there are scheduled notificatios
                //check that all the required notifications have been set up
            }
        })
    }

    scheduleNotification(fireDate, timeOfDay){
        var message = "Today's Motivation is now available.";

        var now = new Date();
        if (fireDate < now) {
            // selected date is in the past
            fireDate =
                moment(fireDate).add(1, 'days').calendar();
        }

        NativeModules.CustomPushNotifications.scheduleLocalNotification({
            fireDate : fireDate,
            alertBody : message,
            userInfo : {key: timeOfDay}
        }, (status) =>{
            console.log(status)
        })
    }


    render() {
        var _panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (e, gestureState) => {},
            onMoveShouldSetPanResponderCapture: (e, gestureState) => {},
            onStartShouldSetPanResponder: (e, gestureState) => {},
            onStartShouldSetPanResponderCapture: (e, gestureState) => {},
            onPanResponderReject: (e, gestureState) => {},
            onPanResponderGrant: (e, gestureState) => {},
            onPanResponderStart: (e, gestureState) => {},
            onPanResponderEnd: (e, gestureState) => {},
            onPanResponderRelease: (e, gestureState) => {},
            onPanResponderMove: (e, gestureState) => {},
            onPanResponderTerminate: (e, gestureState) => {},
            onPanResponderTerminationRequest: (e, gestureState) => {},
            onShouldBlockNativeResponder: (e, gestureState) => {},
        });

        return (
            <Router>
                <Scene key="root" backgroundColor={"#2B2B2B"} navigationBarStyle={navigationBarStyle} titleStyle={titleStyle} backButtonImage={require('./images/back.png')}>
                    <Scene key="main" component={Main} title="Main" initial={true} hideNavBar={true}  db={db}/>
                    <Scene key="new" hideNavBar={true} direction="vertical" schema="modal"  title="New Entry"  panHandlers={_panResponder.panHandlers}>
                        <Scene key="addModal" component={NewEntry} title="Add New" initial={true} db={db}/>
                    </Scene>
                    <Scene key="entries" hideNavBar={true} direction="vertical" schema="modal"  title="Entries"  panHandlers={_panResponder.panHandlers}>
                        <Scene key="entriesModal" component={Entries} title="Add New" initial={true} db={db}/>
                    </Scene>
                    <Scene key="settings" hideNavBar={true} direction="vertical" schema="modal"  title="Entries"  panHandlers={_panResponder.panHandlers} >
                        <Scene key="settingsModal" component={Settings} title="Settings" initial={true}/>
                    </Scene>
                    <Scene key="welcome" hideNavBar={true} direction="vertical" schema="modal"  title="Welcome"  panHandlers={_panResponder.panHandlers} >
                        <Scene key="welcomeModal" component={Welcome} title="Settings" initial={true}/>
                    </Scene>
                </Scene>
            </Router>
        )

    }
}

AppRegistry.registerComponent('SelfApp', () => SelfApp);
