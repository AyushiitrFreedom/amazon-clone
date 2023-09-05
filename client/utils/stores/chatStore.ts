import { create } from 'zustand';


import chatType from '../types/chatType';

const chatStore = (set: any) => ({
    chats: [],
    addChat: (chat: chatType) => {
        set((state: any) => ({
            chats: [chat, ...state.chats],
        }))
    },

})

const useChatStore = create();


export default useChatStore;