import Chat from "../model/chatmodel";
import { Request, Response } from "express";
import User from "../model/userModel";
import { ChatI } from "../model/chatmodel";

class ChatController {
  static accessChat = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;
    // if (!userId) {
    //   console.log("userId send in body not params");
    //   return res.sendStatus(400);
    // }
    try {
      const isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.body.user.id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
        .populate("users", "-password")
        .populate("latestMessage");

      const populatedChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      // console.log(populatedChat,"popolu");

      if (populatedChat.length > 0) {
        res.send(populatedChat[0]);
      } else {
        const chatData = {
          chatName: "sender",
          isGroupChat: false,
          users: [req.body.user.id, userId],
        };
        try {
          const createChat = await Chat.create(chatData);
          const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
            "users",
            "-password", "name email"
          );
          res.status(200).send(fullChat);
        } catch (error) {
          res.status(400).json(error);
        }
      }
    } catch (error) {
      res.status(400).json(error);
    }
  };

  static fetchChats = async (req: Request, res: Response) => {
    try {
      var allChats:any = await Chat.find({
        users: { $elemMatch: { $eq: req.body.user.id } },
      })
        .populate("users", "name email")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      allChats = await User.populate(allChats, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      res.status(200).send(allChats);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  static createGroup = async (req: Request, res: Response) => {
    console.log(req.body,"sdssd");
    
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }
    var users = req.body.users;
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group ");
    }
    users.push(req.body.user.id);
    console.log(users);
    
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.body.user.id,
      });
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      res.status(200).json(fullGroupChat);
    } catch (error:any) {
      res.status(400).send(error.message)
    }
  };
}

export default ChatController;
