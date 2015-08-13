import React from 'react';
import Renderer from '../lock/renderer';
import { subscribe, getState } from '../store/index';
import Auth0Lock from '../lock/auth0_lock';
// import crashedSpec from '../crashed/mode_spec';
import passwordlessEmailSpec from '../passwordless-email/mode_spec';
import passwordlessSMSSpec from '../passwordless-sms/mode_spec';
import Control, { store } from './control';

// Auth0Lock.plugins.register(crashedSpec);
Auth0Lock.plugins.register(passwordlessEmailSpec);
Auth0Lock.plugins.register(passwordlessSMSSpec);

// TODO temp for DEV only
global.window.Auth0LockPasswordless = Auth0Lock;

import styles from '../../css/index.css';
import transitions from '../../css/transitions.css';
import overwrites from '../../css/overwrites.css';

const renderer = new Renderer();
subscribe("main", () => renderer.render(getState(), Auth0Lock.plugins.renderFns()));

import webAPI from '../lock/web_api';
const WebAPI = webAPI.constructor;

webAPI.constructor.prototype.constructor = function() {};

WebAPI.prototype.setupClient = function() {};

WebAPI.prototype.signIn = function(lockID, options, cb) {
  const state = store.deref();
  const args = state.getIn(["signIn", "response"]) == "success" ?
    [null] :
    [{description: "Wrong email or verification code.", error: "invalid_user_password"}];
  setTimeout(() => cb(...args), state.get("latency"));
};

WebAPI.prototype.signOut = function() {};

WebAPI.prototype.startPasswordless = function(lockID, options, cb) {
  const state = store.deref();
  const args = state.getIn(["startPasswordless", "response"]) == "success" ? [null] : [{}];
  setTimeout(() => cb(...args), state.get("latency"));
};

React.render(React.createElement(Control), document.getElementById("control-container"));
