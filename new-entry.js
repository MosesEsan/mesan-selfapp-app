/**
 * Created by mosesesan on 8/18/16.
 */
import React, { Component } from 'react';
import { StatusBar, Platform, View, Dimensions,  UIManager, TextInput,Text, TouchableOpacity, Image
} from 'react-native';

import {Actions } from 'react-native-router-flux';


var {width: windowWidth, height:windowHeight} = Dimensions.get('window');
var NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 64 : 54;


const styles = require('./styles');
import NavBarView from './nav-bar.js'


var _this;

export default class New extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            title: ''
        };
    }

    componentWillReceiveProps(newProps) {
        //if (Platform.OS === "ios") StatusBar.setBarStyle('light-content', true);
    }

    componentDidMount() {
        _this= this;
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor: "#2C2D30"}}>
                <NavBarView title={"New Entry"}/>

                <View style={{borderBottomWidth:1, borderBottomColor: "rgba(209,213,212, .1)"}}>
                    <Text style={{fontStyle: "normal", color:"#A3A5A4", fontSize: 17, fontWeight: "500", padding: 15, paddingBottom: 5, paddingTop: 15}}>
                        Title
                    </Text>

                    <TextInput style={{ height: 40, color: "#fff", padding: 17, paddingTop:0,
                    fontWeight: "800", fontSize: 16}}
                               onChangeText={(text) => this.setState({title : text})}
                               value={this.state.title}
                               editable = {true}
                               returnKeyType ={"done"}
                               maxLength = {40}
                        />
                </View>
                <View style={{borderBottomWidth:1, borderBottomColor: "rgba(209,213,212, .1)"}}>
                    <Text style={{fontStyle: "normal", color:"#A3A5A4", fontSize: 17, fontWeight: "500", padding: 15, paddingBottom: 5}}>
                        Text
                    </Text>
                    <TextInput style={{height: 200, color: "#fff", padding: 17, paddingTop:0,
                     fontSize: 16, fontWeight: "800"}}
                               multiline = {true}
                               numberOfLines = {6}
                               onChangeText={(text) => this.setState({text})}
                               value={this.state.text}
                               editable = {true}
                               maxLength = {255}
                        />
                </View>


                <TouchableOpacity style={[{position: "absolute", bottom:0, left: 0, right:0,
                backgroundColor: "#64D8D4", height: 60, justifyContent: "center", alignItems: "center"}]}
                                  onPress={this.saveEntry.bind(_this)}>
                    <Text style={{color:"#F2F0F0", fontSize: 19, fontWeight: "500", textAlign: "center"}}>
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }


    saveEntry(){
        _this.props.db.transaction((tx) => {
            tx.executeSql('INSERT INTO entries (title, text, active) VALUES ("'+_this.state.title+'", "'+_this.state.text+'", 1);', [], (tx, results) => {
                alert("Entry Added Successfully!");
                _this.setState({title: "", text: ""});
                //console.log(tx)
                //console.log(results)
            });
        });

    }
}

