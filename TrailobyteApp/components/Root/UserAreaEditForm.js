import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, KeyboardAvoidingView, View, ActivityIndicator, TouchableOpacity, Image, Dimensions } from 'react-native';

import UserInput from './UserInput';

import passwordImg from '../../images/password.png';
import emailImg from '../../images/email.png';
import homeImg from '../../images/home.png';
import mobileImg from '../../images/mobile.png';
import phoneImg from '../../images/phone.png';
import eyeImg from '../../images/eye_black.png';

export default class UserAreaEditForm extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            showPass: true,
            press: false,
            username: '',
            email: '',
            password: '',
            confirmation: '',
            telephone: '',
            mobilePhone: '',
            address: '',
        };
        
        this.showPass = this.showPass.bind(this);
    }
    
    showPass() {
        this.state.press === false
            ? this.setState({showPass: false, press: true})
            : this.setState({showPass: true, press: false});
    }
    
    render() {
        return (
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
                <UserInput
                    source={emailImg}
                    placeholder={this.props.email}
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({email: text})}
                />
                <UserInput
                    source={phoneImg}
                    placeholder={this.props.telephone}
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({telephone: text})}
                />
                <UserInput
                    source={mobileImg}
                    placeholder={this.props.mobilePhone}
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({mobilePhone: text})}
                />
                <UserInput
                    source={homeImg}
                    placeholder={this.props.address}
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({address: text})}
                />
                <UserInput
                    source={passwordImg}
                    secureTextEntry={this.state.showPass}
                    placeholder="Password"
                    returnKeyType={'done'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({password: text})}
                />
                <UserInput
                    source={passwordImg}
                    secureTextEntry={this.state.showPass}
                    placeholder="Confirmar"
                    returnKeyType={'done'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({confirmation: text})}
                />
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.btnEye}
                    onPress={this.showPass}>
                    <Image source={eyeImg} style={styles.iconEye} />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }
}

UserAreaEditForm.propTypes = {
    email: PropTypes.string,
    telephone: PropTypes.string,
    mobilePhone: PropTypes.string,
    address: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        flex: 0,
        top: 100,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    btnEye: {
        flex: 0,
        top: -80,
        left: 150,
        
    },
    iconEye: {
        width: 25,
        height: 25,
        tintColor: 'rgba(0,0,0,0.4)',
    },
});
