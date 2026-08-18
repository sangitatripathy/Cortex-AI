import React from "react";
import { MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

const Nav = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  return (
    <>
      {selectedConversation && (
        <div className="h-[52.8px] flex items-center px-5 justify-between border-b border-white/60 bg-[#0d0f14] gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <MessageSquare size={13} className="text-indigo-400" />
          </div>
          <div className="text-[14px] font-semibold text-slate-100 tracking-tight">
            {selectedConversation?.title || "New Chat"}
          </div>
          <div className="text-[10px] font-medium text-slate-600 bg-white/4 border border-white/6 px-2 py-0.5 rounded-full">
            {messages?.length} Messages
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
