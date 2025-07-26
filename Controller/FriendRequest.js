const models = require('../Model/index');
const { Op } = require('sequelize'); 

//  Send Friend Request
exports.sendRequest = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You can't send a request to yourself." });
    }

    // Check if request already exists
    const existing = await models.friendRequest.findOne({
      where: {
        senderId,
        receiverId
      }
    });

    if (existing) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    const request = await models.friendRequest.create({ senderId, receiverId, status: 'pending' });
    res.status(201).json({ message: "Friend request sent.", request });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send friend request" });
  }
};


// Receive request 
exports.getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const requests = await models.friendRequest.findAll({
      where: {
        receiverId: userId,
        status: 'pending'
      },  
      include: [
        {
          model: models.user,
          as: 'sender',
          attributes: ['id', 'name', 'profileImage']
        }
      ]
    });

    res.json(requests);
  } catch (err) {
    console.error("Failed to fetch received friend requests:", err);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};





//  Accept Friend Request
exports.acceptRequest = async (req, res) => {
  try {
    const receiverId = req.user.userId;
    const { requestId } = req.params;

    console.log("receiverId:", receiverId);
    console.log("requestId:", requestId);

    const request = await models.friendRequest.findOne({
      where: {
        id: requestId,
        receiverId: receiverId
      }
    });

    if (!request) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    // ✅ Check if users are already friends
    const alreadyFriends = await models.friend.findOne({
      where: {
        userId1: request.senderId,
        userId2: request.receiverId
      }
    });

    if (alreadyFriends) {
      return res.status(400).json({ message: "You are already friends." });
    }

    // Accept the request
    request.status = 'accepted';
    await request.save();

    // Add to friend table (mutual)
    await models.friend.create({
      userId1: request.senderId,
      userId2: request.receiverId
    });

    res.json({ message: "Friend request accepted and friendship created." });

  } catch (err) {
    console.error(" Accept Error:", err);
    res.status(500).json({ message: "Failed to accept friend request" });
  }
};


  
  exports.getAllFriends = async (req, res) => {
    try {
      const userId = req.user.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
  
      // Get all friendships for the user
      const friendships = await models.friend.findAll({
        where: {
          [Op.or]: [
            { userId1: userId },
            { userId2: userId }
          ]
        }
      });
  
      // Get friend userIds
      const friendIds = friendships.map(friend =>
        friend.userId1 === userId ? friend.userId2 : friend.userId1
      );
  
      if (friendIds.length === 0) {
        return res.status(200).json({ friends: [] });
      }
  
      // Apply pagination on friend users
      const paginatedFriends = await models.user.findAll({
        where: {
          id: {
            [Op.in]: friendIds
          }
        },
        attributes: ['id', 'name', 'email', 'profileImage'],
        limit,
        offset
      });
  
      res.status(200).json({ friends: paginatedFriends });
      
    } catch (err) {
      console.error('Error in getAllFriends:', err);
      res.status(500).json({ message: 'Failed to get friends list' });
    }
  };
  

  // Unfriend 
  exports.unfriend = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { friendId } = req.params;
  
      const deleted = await models.friend.destroy({
        where: {
          [Op.or]: [
            { userId1: userId, userId2: friendId },
            { userId1: friendId, userId2: userId }
          ]
        }
      });
  
      if (deleted === 0) {
        return res.status(404).json({ message: "Friendship not found." });
      }
  
      res.status(200).json({ message: "Successfully unfriended." });
  
    } catch (err) {
      console.error(' Error in unfriend:', err);
      res.status(500).json({ message: 'Failed to unfriend user' });
    }
  };


  
  // Send Friend Request (with mutual auto-accept)
exports.sendRequest = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You can't send a request to yourself." });
    }

    // 1️. Check if already friends
    const existingFriend = await models.friend.findOne({
      where: {
        [Op.or]: [
          { userId1: senderId, userId2: receiverId },
          { userId1: receiverId, userId2: senderId }
        ]
      }
    });

    if (existingFriend) {
      return res.status(400).json({ message: "You are already friends." });
    }

    // 2️. Check for reverse friend request
    const reverseRequest = await models.friendRequest.findOne({
      where: {
        senderId: receiverId,
        receiverId: senderId,
        status: 'pending'
      }
    });

    if (reverseRequest) {
      // Accept mutual request and create friend
      await reverseRequest.update({ status: 'accepted' });

      await models.friend.create({
        userId1: senderId,
        userId2: receiverId
      });

      return res.status(200).json({ message: "Mutual requests detected. You're now friends!" });
    }

    // 3️. Check if a request already exists in this direction
    const existingRequest = await models.friendRequest.findOne({
      where: {
        senderId,
        receiverId,
        status: 'pending'
      }
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    // 4️. Send new request
    const request = await models.friendRequest.create({
      senderId,
      receiverId,
      status: 'pending'
    });

    res.status(201).json({ message: "Friend request sent.", request });

  } catch (err) {
    console.error(' Error sending request:', err);
    res.status(500).json({ message: "Failed to send friend request." });
  }
};



  // CANCEL Friend Request as receiver
exports.cancelRequest = async (req, res) => {
  try {
    const receiverId = req.user.userId; // Logged in user
    const { senderId } = req.body;

    if (!senderId) {
      return res.status(400).json({ message: "senderId is required." });
    }

    const request = await models.friendRequest.findOne({
      where: {
        senderId,
        receiverId,
        status: 'pending'
      }
    });

    if (!request) {
      return res.status(404).json({ message: "Pending friend request not found." });
    }

    request.status = 'cancelled';
    await request.save();

    res.status(200).json({ message: "Friend request cancelled successfully." });

  } catch (err) {
    console.error("Error cancelling friend request:", err);
    res.status(500).json({ message: "Failed to cancel friend request." });
  }
};




exports.searchUsers = async (req, res) => {
  const { query } = req.query;

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const userId = req.user.id;

    // Find users that match the name, excluding the current user
    const users = await models.user.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`
        },
        id: {
          [Op.ne]: userId
        }
      },
      attributes: ['id', 'name' , 'profileImage']
    });

    const userIds = users.map(u => u.id);
    if (userIds.length === 0) return res.json([]);

    // Check if any are already friends
    const friends = await models.friend.findAll({
      where: {
        [Op.or]: [
          { userId1: userId, userId2: { [Op.in]: userIds } },
          { userId2: userId, userId1: { [Op.in]: userIds } }
        ]
      }
    });

    // Check if friend requests are already sent
    const sentRequests = await models.friendRequest.findAll({
      where: {
        senderId: userId,
        receiverId: { [Op.in]: userIds },
        status: 'pending'
      }
    });

    // Build sets for fast lookup
    const friendSet = new Set(
      friends.map(f => (f.userId1 === userId ? f.userId2 : f.userId1))
    );

    const sentRequestSet = new Set(sentRequests.map(r => r.receiverId));

    // Return final response
    const usersWithStatus = users.map(user => {
      let status = 'none';
      if (friendSet.has(user.id)) status = 'friends';
      else if (sentRequestSet.has(user.id)) status = 'request_sent';

      return {
        id: user.id,
        name: user.name,
        profileImage: user.profileImage,
        status
      };
    });

    res.json(usersWithStatus);

  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ message: 'Failed to search users' });
  }
};

    