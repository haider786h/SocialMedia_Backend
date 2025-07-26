    const express = require('express');
    const router = express.Router();
    const friendController = require('../Controller/FriendRequest');
    const authenticate = require('../Middleware/auth');

    //  Send a friend request
    router.post('/send', authenticate, friendController.sendRequest);

    // receive request 
    router.get('/received', authenticate, friendController.getReceivedRequests);

    //  Accept a friend request
    router.post('/accept/:requestId', authenticate, friendController.acceptRequest);

    //  Get All Friends
    router.get('/list', authenticate, friendController.getAllFriends);

    // Unfriend
    router.delete('/unfriend/:friendId', authenticate, friendController.unfriend); 

    // Cancel
    router.post('/cancel', authenticate, friendController.cancelRequest);

    // search
    router.get('/search', authenticate, friendController.searchUsers);

    module.exports = router;
