import Conversation from "../models/conversation.model.js";
import Message from "../models/messsage.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        message: "x-user-id header is required",
      });
    }

    const conversation = await Conversation.create({
      userId,
    });

    return res.status(201).json(conversation);
  } catch (error) {
    return res.status(500).json({
      message: `Create conversation error: ${error.message}`,
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        message: "x-user-id header is required",
      });
    }

    const conversations = await Conversation.find({
      userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({
      message: `Get conversation error: ${error.message}`,
    });
  }
};

export const updateConversations = async (req, res) => {
  try {
    const { id, title } = req.body;
    const conversations = await Conversation.findByIdAndUpdate(
      id,
      {
        title,
      },
      { new: true },
    );

    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({
      message: `Update conversation error: ${error.message}`,
    });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content, images,artifacts } = req.body;

    if (!conversationId || !role || !content) {
      return res.status(400).json({
        message: "conversationId, role and content are required",
      });
    }

    const message = await Message.create({
      conversationId,
      role,
      content,
      images,
      artifacts
    });

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({
      message: `Error while saving message: ${error.message}`,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({
        message: "conversationId is required",
      });
    }

    const messages = await Message.find({
      conversationId,
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({
      message: `Get message error: ${error.message}`,
    });
  }
};
