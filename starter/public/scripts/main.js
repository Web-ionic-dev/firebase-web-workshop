'use strict'

/* ==== Set up ==== */

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
      window.alert('You have not configured and imported the Firebase SDK. ')
    }
}

/* ==== Authentication ==== */

/** Sign in with Google. */
function signInWithGoogle() {
    // TODO 1: Sign in Firebase with credential from the Google user.
}

/** Sign out. */
function signOut() {
    // TODO 2: Sign out of Firebase.
}

/** Initiate firebase auth. */
function initFirebaseAuth() {
    // TODO 3: Initialize Firebase to track the auth state changed.
}

/** To check if the user signed in or not. */
function isUserSignedIn() {
    // TODO 4: Check if the user signed in with current user object (if the current user object is not null, then the user has signed in).
}

/** Get a user ID. */
function getUserId() {
    // TODO 5: Get a user ID.
}

/** Get a username. */
function getUserName() {
    // TODO 6: Get a username.
}

/** Get a user profile picture. */
function getProfilePicUrl() {
    // TODO 7: Get a profile picture.
}

/** Sign up a new user with email, password, and user information. */ 
function signUp(email, password, name) {
    // TODO 8: Get a profile picture.
}

/** Update user display name. */ 
function updateUserDisplayName(name) {
    // TODO 9: Update user display name.
}

/** Sign in with email & password. */ 
function signIn(email, password) {
    // TODO 10: Sign in with email & password.
}

/* Firestore */

function getEvents(filter = 'all') {

}

function subscribeEvent(eventId) {

}

function getMyEvents() {

}

function registerForEvent(eventId) {
    
}

function unregisterForEvent(eventId) {
    
}

/* Cloud Messaging */

function requestNotificationsPermissions() {
    
}

function saveMessagingDeviceToken() {
    
}
  

/* UI */

// Sign In / Sign Up

function initializeAuthUI() {

    // Add actions to elements
    $('#sign-out').click(signOut)
    $('#swapToSignUp').click(swapToSignUpMode)
    $('#swapToSignIn').click(swapToSignUpMode)
    $('#signInInputEmail, #signInInputPassword, #signUpInputEmail, #signUpInputPassword, #signUpInputName').change(hideAuthError) 

    $('#signin-form').submit(function(){
        const email = $('#signInInputEmail').val()
        const password = $('#signInInputPassword').val()
        if (email && password) {
            signIn(email, password)
        } else {
            displayAuthError('Please enter all the required information')
        }
        event.preventDefault()
    }) 

    $('#signup-form').submit(function(){
        const email = $('#signUpInputEmail').val() 
        const password = $('#signUpInputPassword').val() 
        const name = $('#signUpInputName').val() 
        if (email && password && name) {
            signUp(email, password, name) 
        } else {
            displayAuthError('Please enter all the required information')
        }
        event.preventDefault()
    }) 

    $('#signInWithGoogle').click(function(){
        hideAuthError()
        signInWithGoogle()
    }) 
}

function swapToSignInMode() {
    $('#signin-form').show()
    $('#signup-form').hide()
    $('.modal-title').text('Sign In')
    $('#error-message').hide()
}

function swapToSignUpMode() {
    $('#signin-form').hide()
    $('#signup-form').show()
    $('.modal-title').text('Sign Up')
    $('#error-message').hide()
}

function displayAuthError(err) {
    var errorMessageDiv = $('#error-message')
    errorMessageDiv.text(err)
    errorMessageDiv.show()
}

function hideAuthError() {
    if ($('#error-message').is(':visible')) {
        $('#error-message').hide()
    }
}

function authStateObserver(user) {
    if (user) {
        $('#sign-in').hide()
        $('#my-event').show()
        $('#sign-out').show()
    } else {
        $('#sign-in').show()
        $('#my-event').hide()
        $('#sign-out').hide()
    }
    getMyEvents()
    $('#username').text(getUserName())
    $('#authModal').modal('hide') 
}

// Events

// Template for events.
const EVENT_TEMPLATE =
'<div class="col-sm-4 mt-3">'+
    '<div class="card">'+
        '<img class="image card-img-top" src="">'+
        '<div class="card-body">'+
            '<h5><a href="#" class="name card-title" data-toggle="modal" data-target="#eventDetailModal">d</a></h5>'+
            '<h6 class="date card-subtitle mb-2 text-muted">s</h6>'+
            '<p class="description card-text">s</p>'+
        '</div>'+
    '</div>'+
'</div>' 

function displayEventCard(id, name, timestamp, description, imageUrl) {

    // use existing or create an event card element
    var div = $('#event[data-item-id='+id+']') 
    if (div.length === 0) {
        div = createEventCard(id, name, timestamp, description, imageUrl) 
    } 

    // set up data
    div.find('.image').attr('src',  imageUrl ? imageUrl : '/images/temp.png') 
    div.find('.name').text(name) 
    div.find('.date').text(convertedDate(timestamp)) 
    div.find('.description').text(description) 
}

var unsubscribeEventCard 
function createEventCard(id) {

    // add event id to div element
    const div = $(EVENT_TEMPLATE) 
    div.attr('data-item-id', id) 

    // Add action to card title
    const cardTitleLabel = div.find('.card-title') 
    cardTitleLabel.attr('data-id', id) 
    cardTitleLabel.click(function() {
        const eventId = $(this).data().id 
        console.log("See detail for:" + eventId) 
        unsubscribeEventCard = subscribeEvent(eventId)
    }) 

    // append event to the event list
    $('#events').append(div) 
    return div 
}

function removeAllEventCards() {
    // remove all cards from the list (if any)
    $('div#events').children().each(function(i) {
        this.remove()
    })
}

const EVENT_DETAIL_TEMPLATE = 
'<div class="modal-content">'+
    '<div class="modal-header">'+
        '<h5 class="modal-title name"></h5>'+
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
            '<span aria-hidden="true">&times;</span>'+
        '</button>'+
    '</div>'+
    '<div class="modal-body">'+
        '<img class="image img-fluid w-100 mb-3" src="images/temp.png">'+
        '<h6 class="date mb-2 text-muted"></h6>'+
        '<p class="description"></p>'+
        '<h6 class="attendee-title mb-2">Attendees</h6>'+
        '<div class="attendee-list"></div>'+
    '</div>'+
    '<div class="modal-footer">'+
        '<span id="detail-error-message"></span>'+
        '<button type="button" class="register-button btn btn-primary" style="display: none">Register</button>'+
        '<button type="button" class="unregister-button btn btn-outline-secondary" style="display: none">Unregister</button>'+
    '</div>'+
'</div>'

function setupEventDetailModal () {
    $('#eventDetailModal').off('hidden.bs.modal')
    $('#eventDetailModal').on('hidden.bs.modal', function (e) {
        if (unsubscribeEventCard) {
            $('#eventDetailModal .modal-content').remove()
            unsubscribeEventCard() 
        }
    })
}

function createEventDetail(id) {
    const content = $(EVENT_DETAIL_TEMPLATE)
    content.attr('data-item-id', id)
    $('#eventDetailModal .modal-dialog').append(content) 
    setupEventDetailModal()
}

function displayEventDetail(id, name, timestamp, description, imageUrl, attendees, isRegistered) {

    var div = $('.modal-content[data-item-id='+id+']') 
    if (div.length === 0) {
        createEventDetail(id)
    }

    $('#eventDetailModal .name').text(name) 
    $('#eventDetailModal .image').attr('src',  imageUrl ? imageUrl : '/images/temp.png') 
    $('#eventDetailModal .date').text(convertedDate(timestamp)) 
    $('#eventDetailModal .description').text(description) 

    displayAttendees(attendees)

    // set up register button
    $('#eventDetailModal .register-button').attr('data-id', id) 
    $('#eventDetailModal .unregister-button').attr('data-id', id) 

    $('#eventDetailModal .register-button').off('click') 
    $('#eventDetailModal .register-button').on('click', function() {
        if (checkIfUserSignInWithMessage()) {
            registerForEvent(id) 
        }
    })

    $('#eventDetailModal .unregister-button').off('click') 
    $('#eventDetailModal .unregister-button').on('click', function() {
        if (checkIfUserSignInWithMessage()) {
            unregisterForEvent(id) 
        }
    })

    handleRegisterButton(isRegistered)
}

function handleRegisterButton(isRegistered) {
    if (isRegistered) {
        // hide register button (if already registered)
        $('#eventDetailModal .unregister-button').show() 
        $('#eventDetailModal .register-button').hide() 

    } else {
        // add action for register button
        $('#eventDetailModal .register-button').show() 
        $('#eventDetailModal .unregister-button').hide()    
    }
}

const ATTENDEE_TEMPLATE = '<img src="" class="img-thumbnail rounded float-left">'

function displayAttendees(attendees) {

    // attendees
    $('#eventDetailModal .attendee-title').text('Attendees (' + attendees.length + ')') 

    // remove all attendee from the list (if any)
    $('#eventDetailModal .attendee-list').children().each(function(i) {
        this.remove() 
    })

    // display attendee profile pic (if needed)
    if (attendees.length > 0) {
        attendees.forEach(attendee => {
            displayAttendeeProfilePic(attendee.profilePicUrl)
        }) 
    }
}

function displayAttendeeProfilePic(imageUrl) {

    const img = $(ATTENDEE_TEMPLATE) 
    img.attr('src', imageUrl) 
    $('.modal-body .attendee-list').append(img)
}

function checkIfUserSignInWithMessage() {
    if (isUserSignedIn()) {
        return true
    }
    $('#detail-error-message').text('You must sign in first!')
    return false
}

// Template for my events.
const MY_EVENT_TEMPLATE =
'<div class="media mb-3">'+
    '<img src="/images/temp.png" class="image mr-3" style="width: 180px">'+
    '<div class="media-body">'+
        '<h5 class="card-title"><a href="#" class="name" data-toggle="modal" data-target="#eventDetailModal"></a></h5>'+
        '<h6 class="date mb-2 text-muted"></h6>'+
        '<p class="description"></p>'+
    '</div>'+
'</div>' 

function displayMyEventItem(id, name, timestamp, description, imageUrl) {
    // use existing or create an event card element
    var div = $('#my-events[data-item-id='+id+']') 
    if (div.length === 0) {
        div = createMyEventItem(id) 
    } 

    // set up data
    div.find('.image').attr('src', imageUrl ? imageUrl : '/images/temp.png') 
    div.find('.name').text(name) 
    div.find('.date').text(convertedDate(timestamp)) 
    div.find('.description').text(description) 
}

function createMyEventItem(id) {

    // add event id to div element
    const div = $(MY_EVENT_TEMPLATE) 
    div.attr('data-item-id', id) 

    // Add action to card title
    const cardTitleLabel = div.find('.card-title') 
    cardTitleLabel.attr('data-id', id) 
    cardTitleLabel.click(function() {
        const eventId = $(this).data().id 
        console.log("See detail for:" + eventId) 
        unsubscribeEventCard = subscribeEvent(eventId)
    }) 

    // append event to the event list
    $('#my-events').append(div) 
    return div 
}

function removeAllMyEventItems() {
    // remove all events from the list (if any)
    $('div#my-events').children().each(function(i) {
        this.remove()
    })
}

function convertedDate(timestamp) {
    let date = timestamp.toDate()
    return moment(date).format('DD/MM/YYYY・hh:mm a')
}

// Dropdown

function addActionsForDropdownMenu() {
    $('#typeDropdownMenu').change(handleForDropdownChanged)
}

function handleForDropdownChanged() {
    const type = $('#typeDropdownMenu').val() 
    getEvents(type) 
}

function loadIncludes(callback) {
    var deferreds = [] 
    // Create a deferred for all includes
    $("[data-load]").each(function() {
        const d = new $.Deferred() 
        deferreds.push(d) 
        $(this).load($(this).data("load"), function() {
            d.resolve() 
        }) 
    }) 
    // Callback when all deferreds are done
    $.when.apply(null, deferreds).done(callback) 
}

/* Main */

$(document).ready(function() {
    loadIncludes(function() {

        // set up UI
        initializeAuthUI() 
        addActionsForDropdownMenu()

        // Firebase
        initFirebaseAuth()

        // TODO: load events

        // TODO: request notification permission
    })
})