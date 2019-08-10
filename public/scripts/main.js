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

// Template for events.
const EVENT_TEMPLATE =
'<div class="col-sm-4 mt-3">'+
    '<div class="card">'+
        '<img id="image" class="card-img-top" src="">'+
        '<div class="card-body">'+
            '<h5 id="name" class="card-title">d</h5>'+
            '<h6 id="date" class="card-subtitle mb-2 text-muted">s</h6>'+
            '<p id="description" class="card-text">s</p>'+
            '<a id="register-button" href="#" class="btn btn-primary btn-sm">Register</a>'+
        '</div>'+
    '</div>'+
'</div>'

function displayEventCard(id, name, timestamp, description, imageUrl, isRegistered) {
    
    // create or use existing event div element
    const div = document.getElementById(id) || createEventCard(id)

    // set up data
    div.querySelector('#image').src = imageUrl;
    div.querySelector('#name').textContent = name;
    div.querySelector('#date').textContent = Date().toString();
    div.querySelector('#description').textContent = description;

    const registerButton = div.querySelector('#register-button');
    registerButton.setAttribute('data-id', id);

    // check if registered
    if (isRegistered) {
        registerButton.textContent = "Registered!";
        registerButton.classList.remove('btn-primary');
        registerButton.classList.add('btn-outline-secondary');
    }

    // Add action to register button
    registerButton.addEventListener('click', function(e) {
        const eventId = $(this).data().id;
        console.log("Register/Unregister for:" + eventId)
    });
    
}

function createEventCard(id) {
    // create event div element
    const container = document.createElement('div');
    container.innerHTML = EVENT_TEMPLATE;

    // add event id to div element
    const div = container.firstChild;
    div.setAttribute('id', id);

    // append event to the event list
    eventListElement.append(div)

    return div
}

/* Main */

// TODO: checkSetup();

// Shortcuts to DOM Elements
const eventListElement = document.getElementById('events');

// Add actions to DOM Elements

// TODO: Initialize Firebase
loadAllEvents();
