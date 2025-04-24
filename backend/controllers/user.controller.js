import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId;

    const users = await User.find({ clerkID: { $ne: currentUserId } });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const myId = req.auth.userId;
    const { userID } = req.params;

    const messages = await Message.find({
      $or: [
        { senderID: userID, receiverID: myId },
        { senderID: myId, receiverID: userID },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
