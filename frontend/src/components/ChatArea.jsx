import { useEffect, useRef } from 'react';
import Nav from './Nav';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useDispatch, useSelector } from 'react-redux';
import getMessages from '../features/getMessages';
import { setArtifacts, setMessages } from '../redux/messageSlice';

function ChatArea() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();
  const chatInputRef = useRef(null);

  useEffect(() => {
    const getMesg = async () => {
      if (selectedConversation?._id) {
        const data = await getMessages(selectedConversation._id);
        dispatch(setMessages(data || []));
        const latestArtifactMessage = [...(data || [])]
          .reverse()
          .find((msg) => msg.artifacts && msg.artifacts.length > 0);
        dispatch(setArtifacts(latestArtifactMessage?.artifacts || []));
      }
    };

    getMesg();
  }, [selectedConversation?._id, dispatch]);

  const handleSelectPrompt = (text) => {
    chatInputRef.current?.setPrompt(text);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
      <Nav />
      <MessageList onSelectPrompt={handleSelectPrompt} />
      <ChatInput ref={chatInputRef} />
    </div>
  );
}

export default ChatArea;
