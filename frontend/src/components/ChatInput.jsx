import React, { useState, useRef } from "react";
import {
  Paperclip,
  Mic,
  Send,
  MessageSquare,
  Zap,
  Code2,
  FileText,
  Presentation,
  ImageIcon,
  Globe,
  X,
} from "lucide-react";
import sendMessage from "../api/sendMessage";
import { useSelector, useDispatch } from "react-redux";
import {
  setMessages,
  addMessage,
  setArtifacts,
  setIsLoading
} from "../redux/messageslice.js";
import { createConversation } from "../api/createConversation.js";
import {
  addConversation,
  setConversationTitle,
  selectConversation,
} from "../redux/conversationSlice";
import { updateConversation } from "../api/updateConversation";

const ChatInput = () => {
  const [value, setValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const handleSendMessage = async () => {
    dispatch(setIsLoading(true));
    let conversation = selectedConversation;

    if (!conversation) {
      const conv = await createConversation();
      dispatch(selectConversation(conv));
      dispatch(addConversation(conv));
      conversation = conv;
    }

    if (conversation.title == "New Chat") {
      const x = await updateConversation({
        id: conversation._id,
        title: value.trim(),
      });

      dispatch(
        setConversationTitle({
          conversationId: conversation._id,
          title: value.trim(),
        }),
      );
    }

    const newMessage = {
      role: "user",
      content: value.trim(),
    };

    dispatch(addMessage(newMessage));

    const formData = new FormData();
    formData.append("prompt", value.trim());
    formData.append("conversationId", conversation?._id);
    formData.append("agent", selectedAgent.toLowerCase());
    if(selectedFile){
      formData.append("file", selectedFile);
    }
    

    setValue("");

    const data = await sendMessage(formData);
    dispatch(setIsLoading(false));

    dispatch(setArtifacts(data?.artifacts || []));

    const newResponse = {
      role: "assistant",
      content: data?.answer || "Sorry, something went wrong. Please try again.",
      images: data?.images,
    };

    dispatch(addMessage(newResponse));
  };

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto",
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat",
    },
    {
      id: "coding",
      icon: Code2,
      label: "Code",
    },
    {
      id: "pdf",
      icon: FileText,
      label: "PDF",
    },
    {
      id: "ppt",
      icon: Presentation,
      label: "PPT",
    },
    {
      id: "vision",
      icon: ImageIcon,
      label: "Vision",
    },
    {
      id: "search",
      icon: Globe,
      label: "Search",
    },
  ];

  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/6 bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/3 border border-white/7 rounded-2xl px-4 pt-3.5 pb-3">
        <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
          {agents.map((agent) => {
            const isActive = selectedAgent === agent.id;
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`flex-shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all ${
                  isActive ?
                    "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                  : "bg-white/3 text-slate-400 border-white/6 hover:bg-white/7"
                }`}
              >
                <Icon
                  size={14}
                  className={isActive ? "text-white" : "text-slate-500"}
                />
                {agent.label}
              </div>
            );
          })}
        </div>

        {selectedFile && (
          <div className="my-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              {selectedFile?.type === "application/pdf" ?
                <FileText size={16} />
              : selectedFile?.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    className="h-10 w-10 rounded-xl object-cover mt-3"
                  />
                )
              }
              <div>
                <p className="text-xs text-white">{selectedFile?.name}</p>
                <p className="text-[10px] text-slate-500">
                  {Math.ceil(selectedFile?.size / 1024)} KB
                </p>
              </div>
              <button
                className="ml-2"
                onClick={() => {
                  setSelectedFile(null);
                  fileRef.current.value = "";
                }}
              >
                <X size={14} className="text-slate-500 hover:text-white" />
              </button>
            </div>
          </div>
        )}

        <textarea
          placeholder="Ask anything"
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed scrollbar-none [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          rows={2}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <input
              type="file"
              accept=".pdf,image/*"
              hidden
              ref={fileRef}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedFile(file);
                }
              }}
            />
            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer"
              onClick={() => fileRef.current.click()}
            >
              <Paperclip size={16} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer">
              <Mic size={16} />
            </button>
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={!value}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150 ${value.trim() ? "bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white" : "bg-white/6 text-slate-600 cursor-not-allowed"}`}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
