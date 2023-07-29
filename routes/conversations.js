const router = require("express").Router();
const Conversation = require("../models/Conversation");

/* New conversation */

router.post("/", async (req, res) => {

  const checking = await Conversation.findOne({
    members: [req.body.senderId, req.body.receiverId] 
  });

  if(!checking){
    const checking2 = await Conversation.findOne({
      members: [ req.body.receiverId, req.body.senderId] 
    });

    if(!checking2){
      const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
      });
    
      try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
      } catch (err) {
        res.status(500).json(err);
      }
    }else{
      res.status(200).json(checking2)
    }
  
  }else{
    res.status(200).json(checking)
  }

 
});

/* Get conversation of a user */

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* Get conversation includes two userId */

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;