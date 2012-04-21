// DB Collections ////////////////////////////////////////////////////////

ChatMessages = new Meteor.Collection("chat_messages");
Meteor.subscribe('chat_messages');


// Session variables /////////////////////////////////////////////////////

// User name
Session.set('user_name', 'Visitor'+Math.floor(Math.random()*1000));

// Started writing a message?
Session.set('cur_message_id', null);


// Templates /////////////////////////////////////////////////////////////

Template.chat.chat_messages = function() {
    return ChatMessages.find({}, {$sort: {date_added: 1}});
};

Template.chat_user_name.user_name = function() {
    return Session.get('user_name');
}

// Events ////////////////////////////////////////////////////////////////

Template.chat.events = {
    'keyup .composer-input' : function (evt) {
        var el = $(evt.target);

        // Enter (submit)
        if(evt.which === 13 && Session.get('cur_message_id')) {
            Session.set('cur_message_id', null);
            el.val('');
        }
        
        // Other characters
        else if(Session.get('cur_message_id')) {
            ChatMessages.update(Session.get('cur_message_id'), {$set: {text: el.val()}});
        } else {
            var message_id = ChatMessages.insert({
                author: Session.get('user_name'),
                text: el.val(),
                date_added: new Date(),
            });
            Session.set('cur_message_id', message_id);
        }
    },
};

Template.chat_user_name.events = {
    'keyup input, click button': function(evt) {
        var form = $(evt.target).parent();
        var el = $('input', el);

        console.log(evt);

        if(evt.type === 'click' || (evt.type === 'keyup' && evt.which === 13)) { // Enter
            ChatMessages.find({author: Session.get('user_name')}).forEach(function(message) {
                ChatMessages.update(message._id, {$set: {author: el.val()}});
            });
            Session.set('user_name', el.val());
        }
    }
}

