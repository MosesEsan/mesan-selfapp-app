/**
 * Created by mosesesan on 8/17/16.
 */
'use strict';

import React, {StyleSheet, Dimensions, Platform} from 'react-native';


var {width: windowWidth, height:windowHeight} = Dimensions.get('window');

//alert(windowHeight)
const BLACK = "#333333";

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2B2B2B',
    },

    navBtn:{
        //position: "absolute",
        //top: 0,
        width: 54,
        height: 44,
        //flexDirection: "row", overflow:"hidden",
        justifyContent: "center",
        alignItems: 'center',
        borderWidth: 1, borderColor: "red"
    },



















    verifyContainer: {
        backgroundColor: '#FFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    logoContainer:{
        width: windowWidth,
        //flex: 1,
        height:((windowHeight/2) / 2),
        justifyContent: 'center',
        alignItems: 'center'
        //backgroundColor: 'yellow',
        //backgroundColor: '#3b7abb',
    },
    smallLogoContainer:{
        height:64,
    },
    logo:{
        height: 50,
        width: windowWidth - 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoText:{
        color: "white",
        fontSize: 30,
        textAlign: "center"
    },
    logoImage:{
        //color: "white",
        //fontSize: 30,
        //textAlign: "center"
        //borderWidth:1, borderColor: "green",
    },
    infoBox:{
        backgroundColor: "#FFF"
    },
    headerText:{
        fontFamily: 'Bariol', fontSize: 17, color: BLACK, fontWeight: "500"
    },
    smallHeaderText:{
        fontFamily: 'Bariol', fontSize: 15, color: BLACK, fontWeight: "500"
    },
    buttonsContainer:{
        height: 72,
        borderTopWidth: 1,
        borderColor: "rgb(231, 239, 241)",
        flexDirection: "row",
        paddingLeft: 20, paddingRight: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonsContainer2:{
        height: 105,
        flexDirection: "column"
    },

    wrapper:{
        //borderWidth:1, borderColor: "green",
        //backgroundColor: 'purple',

        flex: 1,
        position:"relative"
    },
//Login

    login:{
        //height: (windowHeight/2) + ((windowHeight/2) / 2),
        //width: windowWidth,
        //borderWidth:1, borderColor: "purple",
        position: "absolute",
        top: 0, right: 0,
        left: 0, bottom: 0,
        backgroundColor: '#3b7abb',
    },

    loginWrapper:{
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop:30,
        height: windowHeight - 210 + 7,
        position: "relative"
    },
    loginWrapperExtended:{
        height: windowHeight - 210 + 7 + (((windowHeight/2) / 2) - 64),
    },
    textInputContainer:{
        //borderWidth:1, borderColor: "purple",
    },

    hiddenTextInputContainer:{
        marginTop: -500
    },

    textInputWrapper:{
        marginBottom: 2,
        borderBottomWidth: 1,
        borderColor: "rgb(249, 184, 156)"
    },

    textInput:{
        height: 45,
        flex:1,
        fontSize: 15,
        color: "#fff",
        textAlign: "left"
    },
    logInButton:{
        height: (windowHeight*7.80) /100,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:  "#1a3385",
        marginTop: 20,
        width: React.Dimensions.get('window').width - 50,
    },
    resendButton:{
        position: "absolute", bottom: 0
    },
    buttonText:{
        textAlign: 'center',
        color: "rgb(249, 184, 156)",
        fontSize: 15    ,
        fontWeight: "600"
    },

    forgotPasswordText: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 9
    },
    //Bottom Section
    bottom:{
        height: 60,
        width: windowWidth,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row"
    },
    hiddenBottom:{
        height: 0
    },
    bottomText:{
        color: "rgb(249, 184, 156)",
        fontSize: 14,
    },


    //Verify Section

    verifyWrapper:{
        position: "absolute",
        top: 20, left: 25, right:25

    },

    verifyHeaderText:{
        textAlign: 'center',
        color: "rgb(207,120,120)",
        fontSize: 17    ,
        fontWeight: "500",

    },
    verifySubText:{
        textAlign: 'center',
        fontSize: 15,
        marginTop: 10
    },

    //Forgot Paswword

    forgotWrapper:{
        marginTop: 20,
        borderColor: "#e4e6e8",
        //borderBottomWidth: 1,
        //borderColor: "rgb(249, 184, 156)",
        borderWidth:1,
        //borderColor: "purple",
    },

    forgotInput:{
        height: 45,
        flex:1,
        fontSize: 15,
        textAlign: "left",
        padding: 5
    },

    forgotButton:{
        height: 44,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:  "#1a3385",
        marginTop: 20,
    },
});


module.exports = styles;