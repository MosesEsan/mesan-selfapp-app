/**
 * Created by mosesesan on 6/9/16.
 */
'use strict';

import React, { Component } from 'react';
import {Image, View, Platform, StyleSheet, ActivityIndicator, Dimensions, Text} from 'react-native';

var ProgressBar = require('ProgressBarAndroid');

var {width: windowWidth, height:windowHeight} = Dimensions.get('window');
var NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 64 : 54;
var styles = StyleSheet.create({
    loading:{
        flexDirection: 'row'
    },
    loadingImg:{
        width: 20,
        height: 20,
        marginRight: 6,
        backgroundColor: 'transparent',
    },


    iosActivity:{
        height: 40,
        width: 40
    }
});

var CustomActivityIndicator = React.createClass({
    render: function(){

        var indicator;

        if (Platform.OS === 'ios'){
            indicator = <ActivityIndicator animating={true} size="small" style={styles.iosActivity} color={"gray"}/>
        }else{
            indicator = <ProgressBar styleAttr={"Small"} color={"gray"} style={{padding: 10, marginTop: 15}}/>
        }
        return (

        <View style={{height:windowHeight - NAVBAR_HEIGHT - NAVBAR_HEIGHT, justifyContent: "center", alignItems: "center" }}>
            <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                {indicator}
            </View>
        </View>


        )
    }
});




module.exports = CustomActivityIndicator;

