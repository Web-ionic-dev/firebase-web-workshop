'use strict';

/* Set up */

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
      window.alert('You have not configured and imported the Firebase SDK. ');
    }
}

/* Authentication */

function initFirebaseAuth() {}

function signIn() {}

function signOut() {}

function isUserSignIn() {}

function getUserName() {}

function getProfilePicUrl() {}

/* Firestore */

function loadAllEvents() {}

function loadMyEvents() {}

/* Cloud Messaging */

function requestNotificationsPermissions() {}

function saveMessagingDeviceToken() {}

/* UI */

/* Main */

// TODO: checkSetup();

// Shortcuts to DOM Elements
var eventListElement = document.getElementById('events');

// Add actions to DOM Elements

// TODO: Initialize Firebase
