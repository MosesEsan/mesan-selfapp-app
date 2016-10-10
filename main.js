'use strict';

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text, ListView, Dimensions,
    View, TextInput, AsyncStorage, Platform, StatusBar, TouchableOpacity, Image, AlertIOS

} from 'react-native';

import { Router, Scene, Actions } from 'react-native-router-flux';


var STORAGE_KEY = '@firstTime';

var {width: windowWidth, height:windowHeight} = Dimensions.get('window');
var NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 64 : 54;

var moment = require('moment');

var ActivityIndicator = require('./CustomActivityIndicator2')

var SQLiteDemo = React.createClass({
    getInitialState(){
        return {
            error: "",
            data: null,
            loading: true
        };
    },

    componentWillMount() {
    },

    componentDidMount(){
        this._loadInitialState().done();
        this.getMotivation();
    },

    componentWillReceiveProps(newProps){
        if (newProps.reload) this.getMotivation();
    },

    async _loadInitialState() {
        try {
            var value = await AsyncStorage.getItem(STORAGE_KEY);
            if (value === null) {
                Actions.welcome();
            }
        } catch (error) {
            alert('AsyncStorage error: ' + error.message);
        }
    },

    getMotivation(){
        var _this = this;
        this.props.db.transaction((tx) => {
            console.log("Executing sql...");
            tx.executeSql('SELECT entries.text, entries.title from pushes ' +
                'LEFT JOIN entries ON pushes.entry_id = entries.id WHERE pushes.pushed_at = '+moment().startOf('day')+' LIMIT 1', [],
                (tx, results) => {
                    var len = results.rows.length;

                    if (len > 0){
                        _this.setState({data: results.rows.item(0), loading: false});
                    }else{
                        tx.executeSql('SELECT * from entries WHERE active = 1 ORDER BY RANDOM() LIMIT 1', [],
                            (tx, results) => {
                                var len = results.rows.length;
                                if (len > 0){
                                    tx.executeSql('INSERT INTO pushes (entry_id, pushed_at) VALUES ('+results.rows.item(0).id+', '+moment().startOf('day')+');', [], (tx, results) => {
                                        //alert("Push Added Successfully!");
                                    });
                                    _this.setState({data: results.rows.item(0), loading: false});
                                }else{
                                    _this.setState({data: null, loading: false});
                                }
                            }, this.errorCB);
                    }
                }, this.errorCB);
        });
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
            that.setState(that.state);
            db.close(that.closeCB,that.errorCB);
        } else {
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
        var date = moment().format('Do MMMM YYYY');
        date = date.toUpperCase();

        return (


            <View style={[styles.container, {flex:1}]}>

                <View style={{height: NAVBAR_HEIGHT, padding:6, flexDirection: "row", paddingTop: 20}}>
                    <View style={{height: 44, width: 54}}/>
                    <View style={{height: 44, flex:1, alignItems: "center", justifyContent: "center"}}>
                        <Text style={{color:"#A7A9AA", fontSize: 15, fontWeight: "600", textAlign: "center"}}>
                            TODAY'S MOTIVITATION
                        </Text>
                    </View>
                    <View style={{height: 44, width: 54}}/>
                </View>

                <View style={{paddingLeft:15, paddingRight:15, flex: 1}}>

                    <View style={{flex: 1, borderRadius: 8, backgroundColor: "#3A3A3A", padding: 22, paddingTop: 0, alignItems: "center", justifyContent: "center"}}>

                        {
                            (this.state.loading) ?
                                <ActivityIndicator/>

                                :

                        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>

                            <Text style={{color:"#FAFAFA", fontSize: 19, fontWeight: "700", textAlign: "center", marginBottom: 6, marginTop: -60}}>
                                {date}
                            </Text>
                            {
                                (this.state.data !== null) ?
                                    <Text style={{color:"#828385", fontSize: 18, fontWeight: "600", textAlign: "center"}}>
                                        {this.state.data.title}
                                    </Text>
                                    :
                                    null
                            }
                            <View style={{borderWidth: 2, borderColor: "#FAFAFA", backgroundColor: "#fff", height:2, width: 60, borderRadius: 2, margin: 20}}/>

                            {
                                (this.state.data !== null) ?
                                    <Text style={{color:"#C1C1C1", fontSize: 18, lineHeight:22, fontWeight: "500", textAlign: "center"}}>
                                        {this.state.data.text}
                                    </Text>
                                    :
                                    <Text style={{color:"#C1C1C1", fontSize: 18, lineHeight:22, fontWeight: "500", textAlign: "center"}}>
                                        No Data Available
                                    </Text>
                            }
                        </View>


                        }
                    </View>


                </View>

                <View style={{height: NAVBAR_HEIGHT, padding:15, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                    <TouchableOpacity style={[styles.navBtn]}
                                      onPress={Actions.entries}>
                        <Image source={require("./images/List2.png")} style={{width: 27, height: 27}}/>
                    </TouchableOpacity>
                    <View style={{height: 44, flex:1, alignItems: "center"}}>
                        <TouchableOpacity style={[styles.navBtn]} onPress={Actions.new}>
                            <Image source={require("./images/Add-Filled.png")} style={{width: 39, height: 39}}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[styles.navBtn]} onPress={Actions.settings}>
                        <Image source={require("./images/Settings.png")} style={{width: 23, height: 23}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    },


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


module.exports = SQLiteDemo;


