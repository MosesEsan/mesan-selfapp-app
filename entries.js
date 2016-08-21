/**
 * Created by mosesesan on 8/18/16.
 */
import React, { Component } from 'react';
import { StatusBar, Platform, View, Dimensions,  UIManager, TextInput,Text, TouchableOpacity, Image, ListView
} from 'react-native';

import {Actions } from 'react-native-router-flux';


var {width: windowWidth, height:windowHeight} = Dimensions.get('window');
var NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 64 : 54;


const styles = require('./styles');
import NavBarView from './nav-bar.js'


export default class Entries extends Component {

    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            text: 'Useless Placeholder',
            title: 'Achieving Success',
            dataSource: ds,
        };
    }

    componentWillReceiveProps(newProps) {
        //if (Platform.OS === "ios") StatusBar.setBarStyle('light-content', true);
    }

    componentDidMount() {
        var _this = this;
        this.props.db.transaction((tx) => {
            console.log("Executing sql...");
            tx.executeSql('SELECT * from entries', [],
                (tx, results) => {

                    var len = results.rows.length;

                    var data = [];
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        data.push(row);
                    }
                    
                    _this.setState({dataSource: this.state.dataSource.cloneWithRows(data)});
                }, this.errorCB);
        });
    }

    errorCB(err) {
        console.log("error: ",err);
        this.state.progress.push("Error: "+ (err.message || err));
        //this.setState(this.state);
        return false;
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor: "#2C2D30"}}>
                <NavBarView title={"Entries"}/>
                <View style={{}}>
                    <ListView style={{paddingLeft: 25, paddingRight: 25, height: windowHeight - NAVBAR_HEIGHT}}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        />
                </View>
            </View>
        );
    }


    renderRow(rowData, sectionID, rowID, highlightRow) {
        return (
            <View style={{borderBottomWidth:1, borderBottomColor: "rgba(209,213,212, .1)", paddingTop: 20}}>
                <Text style={{color:"#C1C1C1", fontSize: 17, lineHeight:21, fontWeight: "500", textAlign: "center"}}>
                    {rowData.text}
                </Text>
                <Text style={{color:"#828385", fontSize: 16, fontWeight: "600", textAlign: "center", marginTop: 20, marginBottom: 20}}>
                    {rowData.title}
                </Text>
            </View>
        );
    }

}


//
//<Text style={{color:"#FAFAFA", fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 5, marginTop: -60}}>
//    17 AUGUST 2016
//</Text>
