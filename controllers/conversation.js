import { prisma } from "../index.js";
import { io } from "../index.js";

export async function createConversation(req, res) {
  const { parentId, driverId } = req.body;

  const existingConversation = await prisma.conversation.findMany({
    where: {
      parentId: parseInt(parentId),
      driverId: parseInt(driverId)
    }
  })

  if (existingConversation.length > 0) {
    res.status(200).json(existingConversation[0]);
    return
  }
  try {
    const createConversation = await prisma.conversation.create({
      data: {
        parentId,
        driverId
      },
    });
    res.status(200).json(createConversation)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error })
  }
}

export async function createMessages(req, res) {
  const { content, senderId, conversationId } = req.body;

  try {
    const createConversation = await prisma.message.create({
      data: { content, senderId, conversationId },
    });
    console.log(req.body.acceptedBy)
    io.to(req.body.acceptedBy).emit('message', { message: "message recieved" });
    res.status(200).json(createConversation)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error })
  }
}

export async function getMessages(req, res) {
  const { conversationId } = req.params;

  try {
    const createConversation = await prisma.message.findMany({
      where: { conversationId: parseInt(conversationId) },
    });
    res.status(200).json(createConversation)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error })
  }
}