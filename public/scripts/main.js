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

function signUp(email, password, name) {
    console.log('sign up with: ' + email + ' ' + password + ' ' + name);
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        return user.updateProfile({
            displayName: name
        })
    }).catch(function(error) {
        var errorMessage = error.message;
        displayAuthError(errorMessage);
    });
}

function signIn(email, password) {
    console.log('sign in with: ' + email + ' ' + password);
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
        console.log(user);
    }).catch(function(error) {
        var errorMessage = error.message;
        displayAuthError(errorMessage);
    });
    
}

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}

function signOut() {
    firebase.auth().signOut();
}

function getUserName() {
    return firebase.auth().currentUser.displayName;
}

function getProfilePicUrl() {
    return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

/* Firestore */

function loadAllEvents(TypeFilter = 'All') {
    // TODO: load once
    // TODO: add snapshot, if data changed, then auto update the event card

    var AllEventList = firebase.firestore().collection('Event').orderBy('EventCreateTimestamp','desc')
    
    if(TypeFilter !== 'All') {
        AllEventList = firebase.firestore().collection('Event').where('EventType','==', TypeFilter).orderBy('EventCreateTimestamp','desc')
    }

    firebase.auth().onAuthStateChanged(User => {
        var UserKey = User.uid

        var MyEventList = firebase.firestore().collection('Event').where('EventAttendeeList','array-contains', UserKey).orderBy('EventCreateTimestamp','desc')

        AllEventList.onSnapshot(EventListFromAllEvent => {
            MyEventList.onSnapshot(EventListFromAllEventMyEvent => {

                var MyEventKeyList = EventListFromAllEventMyEvent.docs.map( Doc => Doc.id) 

                var AllEventList = EventListFromAllEvent.docs.map( Doc => (
                        { EventId: Doc.id, ...Doc.data() , isRegister: MyEventKeyList.includes(Doc.id)})
                    )

                    AllEventList.map( EventDocData => { 

                        const { EventTitle, EventDescription, EventDate, EventCreateTimestamp, EventType, EventCoverImageUrl, EventAttendeeList, isRegister, EventId  } = EventDocData
            
                        displayEventCard(EventId,EventTitle,EventDate,EventDescription,EventCoverImageUrl,isRegister)
                    });
            })
        })
    })

    // displayEventCard('1', 'Firebase Web Workshop', Date().toString(), 'ggg', 'images/temp.png', true);
    // displayEventCard('2', 'Firebase Web Workshop', Date().toString(), 'ggg', 'images/temp.png', false);
    // displayEventCard('3', 'Firebase Web Workshop', Date().toString(), 'ggg', 'images/temp.png', true);
    // displayEventCard('4', 'Firebase Web Workshop', Date().toString(), 'ggg', 'images/temp.png', true);
}

function queryEvent(type, time) {
    console.log('query for type: ' + type + ' time: ' + time);
}

function loadMyEvents() {
    
    firebase.auth().onAuthStateChanged(User => {
        var UserKey = User.uid

        var MyEventList = firebase.firestore().collection('Event').where('EventAttendeeList','array-contains', UserKey).orderBy('EventCreateTimestamp','desc')

        MyEventList.onSnapshot(EventList => EventList.docs.map( EventDoc => { 
            
            const EventId = EventDoc.id
            const EventDocData = EventDoc.data()

            const { EventTitle, EventDescription, EventDate, EventCreateTimestamp, EventType, EventCoverImageUrl, EventAttendeeList } = EventDocData;

            displayMyEventItem(EventId,EventTitle,EventDate,EventDescription,EventCoverImageUrl);
        }))
    })

    displayMyEventItem('1', 'Firebase Web Workshop', Date().toString(), 'ggg', 'images/temp.png');
    displayMyEventItem('2', 'Firebase Web Workshop', Date().toString(), 'ggg', 'images/temp.png');
    displayMyEventItem('3', 'Firebase Web Workshop', Date().toString(), 'ggg', 'images/temp.png');
}

/* Cloud Messaging */

function requestNotificationsPermissions() {}

function saveMessagingDeviceToken() {}

/* UI */

// Sign In / Sign Up

function initializeAuthUI() {

    // Add actions to elements
    $('#sign-out').click(signOut);

    $('#swapToSignUp').click(function(){
        swapToSignUpMode();
    });

    $('#swapToSignIn').click(function(){
        swapToSignInMode();
    });

    $('#signin-form').submit(function(){
        console.log('sign in submmitted');
        const email = $('#signInInputEmail').val();
        const password = $('#signInInputPassword').val();
        signIn(email, password);
        event.preventDefault();

    });

    $('#signup-form').submit(function(){
        console.log('sign up submmitted');
        const email = $('#signUpInputEmail').val();
        const password = $('#signUpInputPassword').val();
        const name = $('#signUpInputName').val();
        signUp(email, password, name);
        event.preventDefault();
    });

    $('#signInWithGoogle').click(function(){
        hideAuthError();
        signInWithGoogle();
    });

    $('#signInInputEmail, #signInInputPassword, #signUpInputEmail, #signUpInputPassword, #signUpInputName').change(function() {
        hideAuthError();
    });
}

function swapToSignInMode() {
    $('#signin-form').show();
    $('#signup-form').hide();
    $('.modal-title').text('Sign In');
    $('#error-message').hide();
}

function swapToSignUpMode() {
    $('#signin-form').hide();
    $('#signup-form').show();
    $('.modal-title').text('Sign Up');
    $('#error-message').hide();
}

function displayAuthError(err) {
    var errorMessageDiv = $('#error-message');
    errorMessageDiv.text(err);
    errorMessageDiv.show();
}

function hideAuthError() {
    if ($('#error-message').is(':visible')) {
        $('#error-message').hide();
    }
}

function authStateObserver(user) {
    // console.log('authStateObserver user: ' + user);
    // console.log(JSON.stringify(user))
    if (user) {
        $('#sign-in').hide();
        $('#my-event').show();
        $('#sign-out').show();
    } else {
        $('#sign-in').show();
        $('#my-event').hide();
        $('#sign-out').hide();
    }
    $('#authModal').modal('hide');
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
}

function createEventCard(id) {

    // add event id to div element
    const div = $(EVENT_TEMPLATE);
    div.attr('data-item-id', id);

    // Add action to card title
    const cardTitleLabel = div.find('.card-title');
    cardTitleLabel.attr('data-id', id);
    cardTitleLabel.click(function() {
        const eventId = $(this).data().id;
        console.log("See detail for:" + eventId);
        const attendees = [{
            'profilePicUrl': 'images/temp.png'
        },
        {
            'profilePicUrl': 'images/temp.png'
        }]
        displayEventDetail(id, 'xxx', 'yyy', 'zzz', 'images/temp.png', attendees, true)
        // TODO: Firestore query (on snapshot) 1 specific event, then display event detail
    });

    // append event to the event list
    $('#events').append(div);
    return div;
}

// const EVENT_DETAIL_TEMPLATE = 
// '<img class="image img-fluid w-100 mb-3" src="images/temp.png">'+
// '<h6 class="date mb-2 text-muted">xxx</h6>'+
// '<p class="description">xxx</p>'+
// '<h6 class="attendee-title mb-2">Attendees (9)</h6>'+
// '<div class="attendee-list">'+
//    '<img src="images/temp.png" class="img-thumbnail rounded float-left">'+
// '</div>';

function displayEventDetail(id, name, timestamp, description, imageUrl, attendees, isRegistered) {

    $('.modal-title.name').text(name);
    $('.modal-body .image').attr('src', imageUrl);
    $('.modal-body .date').text(timestamp);
    $('.modal-body .description').text(description);

    // attendees
    $('.modal-body .attendee-title').text('Attendees (' + attendees.length + ')');

    // remove all attendee from the list (if any)
    $('.modal-body .attendee-list').children().each(function(i) {
        while(this.attributes.length > 0)
            this.removeAttribute(this.attributes[0].name);
    })

    // display attendee profile pic (if needed)
    if (attendees.length > 0) {
        attendees.forEach(attendee => {
            displayAttendeeProfilePic(attendee.profilePicUrl)
        });
    }

    // register button
    $('.register-button').attr('data-id', id);

    if (isRegistered) {
        // hide register button (if already registered)
        $('.modal-footer').hide();
    } else {
        // add action for register button
        $('.register-button').click(function() {
            const eventId = $(this).data().id;
            console.log('register for: ' + eventId);
            // TODO: Check if logged in
            // TODO: Firestore call - to write attendee data
        })
    }
}

const ATTENDEE_TEMPLATE = '<img src="" class="img-thumbnail rounded float-left">'

function displayAttendeeProfilePic(imageUrl) {

    const img = $(ATTENDEE_TEMPLATE);
    img.attr('src', imageUrl);
    $('.modal-body .attendee-list').append(img)
}

// Template for my events.
const MY_EVENT_TEMPLATE =
'<div class="media mb-3">'+
    '<img src="" class="image mr-3">'+
    '<div class="media-body">'+
        '<h5 class="name card-title"></h5>'+
        '<h6 class="date mb-2 text-muted"></h6>'+
        '<p class="description"></p>'+
    '</div>'+
'</div>';

function displayMyEventItem(id, name, timestamp, description, imageUrl) {
    // use existing or create an event card element
    var div = $('div[data-item-id='+id+']');
    if (div.length === 0) {
        div = createMyEventItem(id);
    } 

    // set up data
    div.find('.image').attr('src', imageUrl);
    div.find('.name').text(name);
    div.find('.date').text(timestamp);
    div.find('.description').text(description);
}

function createMyEventItem(id) {

    // add event id to div element
    const div = $(MY_EVENT_TEMPLATE);
    div.attr('data-item-id', id);

    // append event to the event list
    $('#my-events').append(div);
    return div;
}

// Dropdown

function addActionsForDropdownMenu() {

    // add actions for dropdowm
    $('#typeDropdownMenu').change(function() {
        handleForDropdownChanged();
    });

    $('#timeDropdownMenu').change(function() {
        handleForDropdownChanged();
    });
}

function handleForDropdownChanged() {
    const type = $('#typeDropdownMenu').val();
    const time = $('#timeDropdownMenu').val();
    loadAllEvents(type);
    // queryEvent(type, time);
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

function writeNewEvent(EventTitle, EventDescription, EventDate, EventType, EventCoverImageUrl, UserKey) {
    return firebase.firestore().collection('Event').add(
        {   
            EventTitle: EventTitle,
            EventDescription: EventDescription,
            EventDate: EventDate,
            EventType: EventType,
            EventCoverImageUrl: EventCoverImageUrl,
            EventCreateTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
            EventAttendeeList: firebase.firestore.FieldValue.arrayUnion(UserKey)
        })
}

/* Main */

$(document).ready(function() {
    loadIncludes(function() {
        // initialize Firebase
        initializeAuthUI();
        initFirebaseAuth();
        writeNewEvent('Test Title2','Test Des2', new Date(), 'all2', 'https://images.unsplash.com/photo-1566095082419-77dc02ebfe3d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3451&q=80','User2').then( res => console.log(res))
    })
});

addActionsForDropdownMenu();

// isUserSignIn()

// getUID()

// TODO: checkSetup();

loadAllEvents();

loadMyEvents();