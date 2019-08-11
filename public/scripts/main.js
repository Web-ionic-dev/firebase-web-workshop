'use strict';

/* Set up */

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
      window.alert('You have not configured and imported the Firebase SDK. ');
    }
}

/* Authentication */

function initFirebaseAuth() {
    firebase.auth().onAuthStateChanged(authStateObserver);
}

function signup(email, password, name) {}

function signIn(email, password) {}

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}

function signOut() {
    firebase.auth().signOut();
}

function isUserSignIn() {
    return firebase.auth().currentUser;
}

function getUserName() {
    return firebase.auth().currentUser.displayName;
}

function getProfilePicUrl() {
    return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

/* Firestore */

function loadAllEvents() {
    displayEventCard('1', 'Firebase Web Workshop', Date().toString(), 'ggg', 'images/temp.png', true);
    displayEventCard('2', 'Firebase Web Workshop', Date().toString(), 'ggg', 'images/temp.png', false);
    displayEventCard('3', 'Firebase Web Workshop', Date().toString(), 'ggg', 'images/temp.png', true);
    displayEventCard('4', 'Firebase Web Workshop', Date().toString(), 'ggg', 'images/temp.png', true);
}

function loadMyEvents() {}

/* Cloud Messaging */

function requestNotificationsPermissions() {}

function saveMessagingDeviceToken() {}

/* UI */

// Sign In / Sign Up

function initializeAuthUI() {

    // Add actions to elements
    $('#sign-out').click(signOut);

    $('#swapToSignUp').click(function(){
        swapToSignUpMode()
    });

    $('#swapToSignIn').click(function(){
        swapToSignInMode()
    });

    $('#signin-form').submit(function(){
        alert("Handler for .submit() signin called.");
        event.preventDefault();
    });

    $('#signup-form').submit(function(){
        alert("Handler for .submit() signup called.");
        event.preventDefault();
    });

    $('#signInWithGoogle').click(function(){
        signInWithGoogle()
    });

}

function authStateObserver(user) {
    if (user) {
        $('#sign-in').hide();
        $('#my-event').show();
        $('#sign-out').show();
    } else {
        $('#sign-in').show();
        $('#my-event').hide();
        $('#sign-out').hide();
    }
}

function swapToSignInMode() {
    $('#signin-form').show();
    $('#signup-form').hide();
    $('.modal-title').text('Sign In');
}

function swapToSignUpMode() {
    $('#signin-form').hide();
    $('#signup-form').show();
    $('.modal-title').text('Sign Up');
}

// Events

// Template for events.
const EVENT_TEMPLATE =
'<div class="col-sm-4 mt-3">'+
    '<div class="card">'+
        '<img class="image card-img-top" src="">'+
        '<div class="card-body">'+
            '<h5 class="name card-title">d</h5>'+
            '<h6 class="date card-subtitle mb-2 text-muted">s</h6>'+
            '<p class="description card-text">s</p>'+
            '<a href="#" class="register-button btn btn-primary btn-sm">Register</a>'+
        '</div>'+
    '</div>'+
'</div>';

function displayEventCard(id, name, timestamp, description, imageUrl, isRegistered) {

    // use existing or create an event card element
    var div = $('div[data-item-id='+id+']');
    if (div.length === 0) {
        div = createEventCard(id);
    } 

    // set up data
    div.find('.image').attr('src', imageUrl);
    div.find('.name').text(name);
    div.find('.date').text(Date().toString());
    div.find('.description').text(description);

    const registerButton = div.find('.register-button');

    // check if registered
    if (isRegistered) {
        registerButton.text("Registered!");
        registerButton.removeClass('btn-primary');
        registerButton.addClass('btn-outline-secondary');
    } else {
        registerButton.text("Register");
        registerButton.removeClass('btn-outline-secondary');
        registerButton.addClass('btn-primary');
    }
}

function createEventCard(id) {

    // add event id to div element
    const div = $(EVENT_TEMPLATE);
    div.attr('data-item-id', id);

    // Add action to register button
    const registerButton = div.find('.register-button');
    registerButton.attr('data-id', id);
    registerButton.click(function() {
        const eventId = $(this).data().id;
        console.log("Register/Unregister for:" + eventId);
    });

    // append event to the event list
    $('#events').append(div);
    return div;
}

function loadIncludes(callback) {
    var deferreds = [];
    // Create a deferred for all includes
    $("[data-load]").each(function() {
        const d = new $.Deferred();
        deferreds.push(d);
        $(this).load($(this).data("load"), function() {
            d.resolve();
        });
    });
    // Callback when all deferreds are done
    $.when.apply(null, deferreds).done(callback);
}

/* Main */

$(document).ready(function() {
    loadIncludes(function() {
        // initialize Firebase
        initializeAuthUI();
        initFirebaseAuth();
    })
});

// TODO: checkSetup();

// TODO: Initialize Firebase
loadAllEvents();

