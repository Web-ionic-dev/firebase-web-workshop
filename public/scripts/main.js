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
    displayEvent('xxx', 'Firebase Web Workshop', '', 'ggg', 'images/temp.png');
    displayEvent('xxx', 'Firebase Web Workshop', '', 'ggg', 'images/temp.png');
    displayEvent('xxx', 'Firebase Web Workshop', '', 'ggg', 'images/temp.png');
    displayEvent('xxx', 'Firebase Web Workshop', '', 'ggg', 'images/temp.png');
}

function loadMyEvents() {}

/* Cloud Messaging */

function requestNotificationsPermissions() {}

function saveMessagingDeviceToken() {}

/* UI */

// Template for events.
var EVENT_TEMPLATE =
'<div class="col-sm-4 mt-3">'+
    '<div class="card">'+
        '<img id="image" class="card-img-top" src="">'+
        '<div class="card-body">'+
            '<h5 id="name" class="card-title">d</h5>'+
            '<h6 id="date" class="card-subtitle mb-2 text-muted">s</h6>'+
            '<p id="description" class="card-text">s</p>'+
            '<a href="#" class="btn btn-primary">Register</a>'+
        '</div>'+
    '</div>'+
'</div>'

function displayEvent(id, name, timestamp, description, imageUrl) {
    
    // create event div element
    const container = document.createElement('div');
    container.innerHTML = EVENT_TEMPLATE;

    // add event id to div element
    const div = container.firstChild;
    div.setAttribute('id', id);

    // set up data
    div.querySelector('#image').src = imageUrl;
    div.querySelector('#name').textContent = name;
    div.querySelector('#description').textContent = description;

    // append event to the event list
    eventListElement.append(div)
}

function loadIncludes() {
    $("[data-load]").each(function() {
        $(this).load($(this).data("load"));
    });
}

/* Main */
$(document).ready(function() {
    loadIncludes();
});

// TODO: checkSetup();

// Shortcuts to DOM Elements
var eventListElement = document.getElementById('events');

// Add actions to DOM Elements

// TODO: Initialize Firebase
loadAllEvents();