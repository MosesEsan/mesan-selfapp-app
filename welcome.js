/**
 * Created by mosesesan on 8/19/16.
 */

import React, { Component } from 'react';
import {
    Text, Platform,
    View, Dimensions,
    TextInput,TouchableHighlight,
    LayoutAnimation, UIManager,
    Alert, StatusBar, AsyncStorage
} from 'react-native';

import { Router, Scene, Actions} from 'react-native-router-flux';

var {width: windowWidth, height:windowHeight} = Dimensions.get('window');
var _this;

var STORAGE_KEY = '@firstTime';


export default class Password extends Component {

    constructor(props){
        super(props)
        this.state = {
            name: "",
            error:  ""
        }
    }

    componentDidMount() {
    }

    render() {
        _this = this;
        return (
            <View style={{position: "relative"}}>
                <View style={[styles.loginContainer]}>
                    <View style={[styles.login]}>
                        <View style={[styles.header]}>
                            <Text style={styles.headerText2}>Welcome</Text>
                            <Text style={styles.subText}>Enter your name to continue</Text>
                        </View>


                        <View style={[styles.loginWrapper]}>

                            <View style={[styles.textInputContainer, (this.state.verification) ? styles.hiddenTextInputContainer : null]}>
                                <View style={[styles.textInputWrapper]}>
                                    <TextInput style={[styles.textInput]}
                                               value={this.state.name}
                                               placeholder={"Name"}
                                               onChangeText={(text) => _this.setState({name: text})}
                                               autoFocus ={false}/>
                                </View>
                                <Text style={{color: "#d3222b", fontSize: 11}}>
                                    {_this.state.error}
                                </Text>

                            </View>
                            <TouchableHighlight onPress={this.saveName}
                                                underlayColor={"rgba(129, 29, 55, .8)"}
                                                style={[styles.logInButton, {width: windowWidth - 50, borderRadius: 2, marginTop: 15}]}>
                                <Text style={[styles.buttonText]}>CONTINUE</Text>
                            </TouchableHighlight>
                        </View>
                    </View>

                </View>
            </View>
        );
    }


    saveName(){

        var name = _this.state.name;
        var errCount = 0;

        if(name.length === 0) {
            _this.setState({error: "Your email is required!"});
            errCount++;
        }else {
            _this.setState({error: ""});

            let multi_set_pairs   = [
                [STORAGE_KEY, "true"],
                ['morning', JSON.stringify([false, null])],
                ['midday', JSON.stringify([false, null])],
                ['evening', JSON.stringify([false, null])]
            ]

            AsyncStorage.multiSet(multi_set_pairs, (err) => {
                if (!err){
                    Actions.pop({refresh: {reload: true} })
                }
            })
        }
    }
}


const styles = require('./login');
