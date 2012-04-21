// Meetings
ChatMessages = new Meteor.Collection("chat_messages");
Meteor.publish('chat_messages', function() {
    return ChatMessages.find();
});


