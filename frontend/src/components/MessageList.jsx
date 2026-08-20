import React from 'react';
import { useSelector } from 'react-redux';
import MessageBubble from './MessageBubble';

const MessageList = () => {
  const { selectedConversation } = useSelector(state => state.conversation)
  const { messages } = useSelector(state => state.message)
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-none [&::-webkit-scrollbar]:hidden">
      {messages?.length == 0 || !selectedConversation ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[20px] font-semibold text-slate-200 tracking-tight">CortexAI</h1>
            <p className="text-[15px] font-semibold text-slate-400 tracking-tight">How can i help you ?</p>
            <p className="text-[13px] text-slate-600 leading-relaxed max-w-65">Ask me anything - code, ideas, explanation or just a quick question.</p>
          </div>
        </div>
      ):<div>
        {messages?.map((msg,i) =>(
          <div className='space-y-5' key={i}>
            <MessageBubble role={msg?.role} content={msg?.content} images={msg.images || []}/>
          </div>
        ))}
        </div>}
    </div>
  )
}

export default MessageList