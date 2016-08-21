/**
 * Created by mosesesan on 8/19/16.
 */
import React, { Component } from 'react';
import {Platform, View, StyleSheet, Text,TouchableOpacity
} from 'react-native';

import {Actions } from 'react-native-router-flux';

var NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 64 : 54;



var styles = StyleSheet.create({
    navBtn: {
        width: 54,
        height: 44,
        justifyContent: "center",
        alignItems: 'center',
    },

});

export default class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }



    render() {
        return (
            <View style={{height: NAVBAR_HEIGHT, padding:6, flexDirection: "row", paddingTop: 20, borderBottomWidth:1, borderBottomColor: "rgba(209,213,212, .1)"}}>

                <View style={[styles.navBtn]}/>
                <View style={{height: 44, flex:1, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{color:"#F2F0F0", fontSize: 17, fontWeight: "600", textAlign: "center"}}>
                        {this.props.title}
                    </Text>
                </View>
                <TouchableOpacity style={[styles.navBtn]}
                                  onPress={Actions.pop}>
                    <Text style={{color:"#F2F0F0", fontSize: 16, fontWeight: "500", textAlign: "center"}}>
                        Close
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}
