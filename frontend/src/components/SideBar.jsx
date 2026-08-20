import React, { useState, useEffect } from "react";
import {
  PanelLeft,
  PenSquare,
  Plus,
  MessageSquare,
  User,
  Coins,
  LogOut,
} from "lucide-react";
import { getConversations } from "../api/getConversation.js";
import { useDispatch, useSelector } from "react-redux";
import {
  setConversation,
  addConversation,
  selectConversation,
} from "../redux/conversationSlice.js";
import { setUserData } from "../redux/userSlice.js";
import { createConversation } from "../api/createConversation.js";
import logOut from "../api/logOut.js";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const getConv = async () => {
      const data = await getConversations();
      dispatch(setConversation(data));
    };
    getConv();
  }, [userData?._id]);

  const handleCreateConversation = async () => {
    const data = await createConversation();
    dispatch(addConversation(data));
  };

  if (collapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center w-14 h-screen bg-[#0d0f14] border-r border-white/6 py-4 gap-1 shrink-0">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-900 hover:text-slate-200 hover:bg-white/6 transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"
          onClick={() => setCollapsed(!collapsed)}
        >
          <PanelLeft />
        </button>
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/6 transition-colors duration-150 bg-transparent border-none cursor-pointer"
          onClick={() => dispatch(selectConversation(null))}
        >
          <Plus size={17} />
        </button>

        <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-5">
          {conversations.map((conversation) => {
            const isActive = selectedConversation?._id == conversation._id;
            return (
              <div
                onClick={() => dispatch(selectConversation(conversation))}
                className={`flex items-center gap-2.5 px-3 py-2.5 mb-0.5 rounded-[10px] cursor-pointer ${isActive ? "bg-indigo-500/10 border-indigo-500/[0.18]" : "bg-transparent border-transparent"} transition-colors duration-150 border`}
                key={conversation._id}
              >
                <div
                  className={`flex items-center justify-center shrink-0 w-5 h-5 rounded-lg transition-colors duration-150 ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/6 text-slate-500"}`}
                >
                  <MessageSquare size={13} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative shrink-0">
          {userData?.avatar && !imageError ?
            <img
              className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
              src={userData?.avatar}
              alt={"image"}
              onError={() => setImageError(true)}
            />
          : <div className="w-9 h-9 rounded-[10px] bg-white/6 flex items-center justify-center">
              <User size={15} className="text-slate-400" />
            </div>
          }
        </div>
      </div>
    );
  }

  return (
    <div className="fixed lg:static inset-y-0 left-0 z-50 w-[270px] h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06]">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.6]">
          <div
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          >
            <PanelLeft />
          </div>
          <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
            CortexAI
          </span>
          <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide">
            free
          </span>
          <button
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
            onClick={() => dispatch(selectConversation(null))}
          >
            <PenSquare size={14} />
          </button>
        </div>

        <div
          className="px-4 pt-4 pb-1"
          onClick={() => dispatch(selectConversation(null))}
        >
          <button className="flex items-center justify-center gap-2 w-full text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150">
            <Plus size={15} />
            New Chat
          </button>
        </div>

        {conversations.length == 0 ?
          <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
            No recent conversations.
          </div>
        : <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
            Recents
          </div>
        }
        <div className="flex-1 overflow-y-auto px-2.5 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {conversations.map((conversation) => {
            const isActive = selectedConversation?._id == conversation._id;
            return (
              <div
                onClick={() => dispatch(selectConversation(conversation))}
                className={`flex items-center gap-2.5 px-3 py-2.5 mb-0.5 rounded-[10px] cursor-pointer ${isActive ? "bg-indigo-500/10 border-indigo-500/[0.18]" : "bg-transparent border-transparent"} transition-colors duration-150 border`}
                key={conversation._id}
              >
                <div
                  className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150 ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/[0.06] text-slate-500"}`}
                >
                  <MessageSquare size={13} />
                </div>
                <span
                  className={`text-[13px] font-medium truncate ${isActive ? "text-slate-100" : "text-slate-300"}`}
                >
                  {conversation.title || "New Chat"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mx-2.5 h-px bg-white/60" />
        <div className="px-3.5 py-3.5">
          {userData ?
            <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors duration-150">
              <div className="relative shrink-0">
                {userData?.avatar && !imageError ?
                  <img
                    className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
                    src={userData?.avatar}
                    alt={"image"}
                    onError={() => setImageError(true)}
                  />
                : <div className="w-9 h-9 rounded-[10px] bg-white/6 flex items-center justify-center">
                    <User size={15} className="text-slate-400" />
                  </div>
                }
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold text-slate-100 truncate">
                  {userData?.name || "user"}
                </p>
                <p className="text-[11px] text-slate-600 mt-px">
                  {"Free Plan"}
                </p>
              </div>

              <div className="flex gap-1">
                <button className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 hover:bg-white/8 hover:text-slate-400 transition-all duration-150">
                  <Coins size={16} />
                </button>
                <button
                  className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/6 hover:text-slate-400 transition-all duration-150"
                  onClick={() => {
                    logOut();
                    dispatch(setUserData(null));
                  }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          : <button>Login</button>}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
