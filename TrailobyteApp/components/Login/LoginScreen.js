import React from "react";
import PropTypes from 'prop-types';
import Logo from './Logo';
import UserForm from './UserForm';
import Wallpaper from './Wallpaper';
import LoginButton from './LoginButton';
import SignupSection from './SignupSection';

export default class LoginScreen extends React.Component {
    render() {
        return (
            <Wallpaper>
                <Logo />
                <UserForm />
                <LoginButton />
                <SignupSection />
            </Wallpaper>
        );
    }
}
