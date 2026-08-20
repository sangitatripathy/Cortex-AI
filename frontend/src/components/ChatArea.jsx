import React, { useEffect } from "react";
import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import getMessages from "../api/getMessages";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageslice";

const ChatArea = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMsg = async () => {
      if (selectedConversation) {
        if (selectedConversation.title == "New Chat") return;
        const data = await getMessages(selectedConversation?._id);
        dispatch(setMessages(data));
      }
    };
    getMsg();
  }, [selectedConversation?._id]);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatArea;
