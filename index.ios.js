///**
// * Sample React Native App
// * https://github.com/facebook/react-native
// * @flow
// */
//
//import React, { Component } from 'react';
//import {
//    AppRegistry,
//    StyleSheet,
//    Text,
//    View, TextInput, AsyncStorage, TouchableHighlight
//} from 'react-native';
//
//
//
//var STORAGE_KEY = '@firstTime';
//var SQLite = require('react-native-sqlite-storage');
//SQLite.DEBUG(true);
//SQLite.enablePromise(true);
//SQLite.enablePromise(false);
//
//var database_name = "Test.db";
//var database_version = "1.0";
//var database_displayname = "SQLite Test Database";
//var database_size = 200000;
//var db;
//
//
//
//class SelfApp extends Component {
//
//    constructor(props){
//        super(props)
//        this.state = {
//            name: "Mosed",
//            error: "",
//            title: "Test Title",
//            body: "Kingship is the best. Perfection is impossible",
//            showInput: false
//        }
//    }
//
//
//    componentDidMount() {
//        this._loadInitialState().done();
//        this.openDatabase();
//    }
//
//    async _loadInitialState() {
//        try {
//            var value = await AsyncStorage.getItem(STORAGE_KEY);
//            if (value !== null){
//                alert('Recovered selection from disk: ' + value);
//            } else {
//                this.setState({showInput: true});
//            }
//        } catch (error) {
//            alert('AsyncStorage error: ' + error.message);
//        }
//    }
//
//

//
//    onPress(){
//        this.saveEntry();
//        //var name = this.state.name;
//        //
//        //if (name.length() > 0) this.setState({shownInput: false})
//    }
//
//
//    saveEntry(){
//        db.transaction((tx) => {
//            tx.executeSql('INSERT INTO entries (title, text) VALUES ("Test Title", "The less you care, the happier you will hbe");', [], (tx, results) => {
//                console.log("Query completed");
//
//                // Get rows with Web SQL Database spec compliance.
//
//                var len = results.rows.length;
//                for (let i = 0; i < len; i++) {
//                    let row = results.rows.item(i);
//                    console.log(`Employee name: ${row.name}, Dept Name: ${row.deptName}`);
//                }
//
//                // Alternatively, you can use the non-standard raw method.
//
//                /*
//                 let rows = results.rows.raw(); // shallow copy of rows Array
//
//                 rows.map(row => console.log(`Employee name: ${row.name}, Dept Name: ${row.deptName}`));
//                 */
//            });
//        });
//    }
//
//    openDatabase(){
//        db = SQLite.openDatabase({name : "db", createFromLocation : 1}, () =>{
//            console.log("Database OPENED");
//        }, (err) => {
//            console.log("SQL Error: " + err);
//        });
//    }
//}

//AppRegistry.registerComponent('SelfApp', () => SelfApp);

/**
 * Sample React Native App with SQLite
 * Demo the react-native-sqlite-storage
 *
 *
 */
'use strict';

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text, ListView, Dimensions,
    View, TextInput, AsyncStorage, Platform, StatusBar, TouchableOpacity, Image

} from 'react-native';

var SQLite = require('react-native-sqlite-storage');
SQLite.DEBUG(true);
SQLite.enablePromise(true);
SQLite.enablePromise(false);

var {width: windowWidth, height:windowHeight} = Dimensions.get('window');
var NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 64 : 54;


var database_name = "SelfApp.db";
var database_version = "1.0";
var database_displayname = "SQLite Test Database";
var database_size = 200000;
var db;

var SQLiteDemo = React.createClass({
    getInitialState(){
        return {
            progress: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),

            name: "Mosed",
            error: "",
            title: "Test Title",
            body: "Kingship is the best. Perfection is impossible",
            showInput: false
        };
    },

    componentWillUnmount(){
        this.closeDatabase();
    },


    componentDidMount(){
        if (Platform.OS === "ios") StatusBar.setBarStyle('light-content', true);
        this.state.progress = ["Starting SQLite Demo"];
        this.setState(this.state);
        this.init();
        //this.deleteDatabase();
    },


    init(){
        this.state.progress.push("Opening database ...");
        this.setState(this.state);
        db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB);
        this.populateDatabase(db);
    },

    populateDatabase(db){
        var that = this;
        that.state.progress.push("Database integrity check");
        that.setState(that.state);
        db.executeSql('SELECT 1 FROM Version LIMIT 1', [],
            function () {
                that.state.progress.push("Database is ready...");
                that.setState(that.state);
            },
            function (error) {
                console.log("received version error:", error);
                that.state.progress.push("Database not yet ready ... populating data");
                that.setState(that.state);
                db.transaction(that.populateDB, that.errorCB, function () {
                    that.state.progress.push("Database populated ...");
                    that.setState(that.state);
                });
            });
    },

    populateDB(tx) {
        this.state.progress.push("Executing DROP stmts");
        this.setState(this.state);

        tx.executeSql('DROP TABLE IF EXISTS entries;');
        tx.executeSql('DROP TABLE IF EXISTS pushes;');

        this.state.progress.push("Executing CREATE stmts");
        this.setState(this.state);

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
    },

    saveEntry(){
        db.transaction((tx) => {
            tx.executeSql('INSERT INTO entries (title, text, active) VALUES ("Test Title", "The less you care, the happier you will hbe", 1);', [], (tx, results) => {
                alert("Insert completed");
            });
        });

    },



    queryEmployees(tx) {
        console.log("Executing sql...");
        tx.executeSql('SELECT a.name, b.name as deptName FROM Employees a, Departments b WHERE a.department = b.department_id and a.department=?', [3],
            this.queryEmployeesSuccess,this.errorCB);
        //tx.executeSql('SELECT a.name, from TEST', [],() => {},this.errorCB);
    },

    queryEmployeesSuccess(tx,results) {
        this.state.progress.push("Query completed");
        this.setState(this.state);
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            this.state.progress.push(`Empl Name: ${row.name}, Dept Name: ${row.deptName}`);
        }
        this.setState(this.state);
    },

    deleteDatabase(){
        this.state.progress = ["Deleting database"];
        this.setState(this.state);
        SQLite.deleteDatabase(database_name, this.deleteCB, this.errorCB);
    },

    closeDatabase(){
        var that = this;
        if (db) {
            console.log("Closing database ...");
            that.state.progress.push("Closing database");
            that.setState(that.state);
            db.close(that.closeCB,that.errorCB);
        } else {
            that.state.progress.push("Database was not OPENED");
            that.setState(that.state);
        }
    },


    renderProgressEntry(entry){
        return (<View style={listStyles.li}>
            <View>
                <Text style={listStyles.title}>{entry}</Text>
            </View>
        </View>)
    },

    render(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return (


            <View style={[styles.container, {flex:1}]}>

                <View style={{height: NAVBAR_HEIGHT, padding:6, flexDirection: "row", paddingTop: 20}}>
                    <View style={{height: 44, width: 54}}/>
                    <View style={{height: 44, flex:1, alignItems: "center", justifyContent: "center"}}>
                        <Text style={{color:"#A7A9AA", fontSize: 14, fontWeight: "600", textAlign: "center"}}>
                            TODAY'S MOTIVITATION
                        </Text>
                    </View>
                    <View style={{height: 44, width: 54}}/>
                </View>

                <View style={{paddingLeft:15, paddingRight:15, flex: 1}}>

                    <View style={{flex: 1, borderRadius: 8, backgroundColor: "#3A3A3A", padding: 22, paddingTop: 0, alignItems: "center", justifyContent: "center"}}>

                        <Text style={{color:"#FAFAFA", fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 5, marginTop: -60}}>
                            17 AUGUST 2016
                        </Text>

                        <Text style={{color:"#828385", fontSize: 16, fontWeight: "600", textAlign: "center"}}>
                            Achieving Success
                        </Text>

                        <View style={{borderWidth: 2, borderColor: "#FAFAFA", backgroundColor: "#fff", height:2, width: 60, borderRadius: 2, margin: 20}}/>
                        <Text style={{color:"#C1C1C1", fontSize: 18, lineHeight:22, fontWeight: "500", textAlign: "center"}}>
                            You have to be smart in your training, you have to think it through and plan it, but you also have to chalk your hands, grab the bar and lift it.
                            That's where so many people go wrong.
                        </Text>

                    </View>


                </View>

                <View style={{height: NAVBAR_HEIGHT, padding:15, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                    <TouchableOpacity style={[styles.navBtn]}
                                      onPress={this.props.leftPress}>
                        <Image source={require("./images/List2.png")} style={{width: 29, height: 29}}/>
                    </TouchableOpacity>
                    <View style={{height: 44, flex:1, alignItems: "center"}}>
                        <TouchableOpacity style={[styles.navBtn]} onPress={this.props.leftPress}>
                            <Image source={require("./images/Add-Filled.png")} style={{width: 35, height: 35}}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[styles.navBtn]} onPress={this.props.leftPress}>
                        <Image source={require("./images/Settings.png")} style={{width: 23, height: 23}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    },
//
//<ListView
//    dataSource={ds.cloneWithRows(this.state.progress)}
//    renderRow={this.renderProgressEntry}
//    style={listStyles.liContainer}/>

    //Output Messages
    errorCB(err) {
        console.log("error: ",err);
        this.state.progress.push("Error: "+ (err.message || err));
        this.setState(this.state);
        return false;
    },

    successCB() {
        console.log("SQL executed ...");
    },

    openCB() {
        this.state.progress.push("Database OPEN");
        this.setState(this.state);
    },

    closeCB() {
        this.state.progress.push("Database CLOSED");
        this.setState(this.state);
    },

    deleteCB() {
        console.log("Database DELETED");
        this.state.progress.push("Database DELETED");
        this.setState(this.state);
    },



});


const styles = require('./styles');

AppRegistry.registerComponent('SelfApp', () => SQLiteDemo);