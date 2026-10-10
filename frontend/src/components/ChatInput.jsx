import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
  MicOff,
  Paperclip,
  Presentation,
  Send,
  X,
  Zap
} from 'lucide-react';
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import sendMessage from '../features/sendMessage';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setArtifacts, setIsLoading, setMessages } from '../redux/messageSlice';
import { createConversation } from '../features/createConversation';
import { addConversation, setConvTitle, setSelectedConversation } from '../redux/conversationSlice';
import { updateConversation } from '../features/updateConversation';

const ChatInput = forwardRef(function ChatInput(props, ref) {
  const [value, setValue] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('Auto');
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { isLoading } = useSelector((state) => state.message);
  const [selectedFile, setSelectedFile] = useState(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);
  const dispatch = useDispatch();

  // Expose imperative setPrompt for suggestion cards
  useImperativeHandle(ref, () => ({
    setPrompt: (text) => {
      setValue(text);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }));

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let index = event.resultIndex; index < event.results.length; index++) {
        transcript += event.results[index][0].transcript;
      }
      setValue(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // Auto-focus on mount or conversation change
  useEffect(() => {
    textareaRef.current?.focus();
  }, [selectedConversation?._id]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const generateTitle = (text) => {
    if (!text) return 'New Chat';
    const cleaned = text.replace(/^[#>\s*`-]+/, '').trim();
    const words = cleaned.split(/\s+/).slice(0, 6).join(' ');
    return words.length > 32 ? words.slice(0, 32) + '...' : words;
  };

  const handleSendMessage = async () => {
    const trimmed = value.trim();
    if ((!trimmed && !selectedFile) || isLoading) return;

    dispatch(setIsLoading(true));
    let conversation = selectedConversation;

    if (!conversation) {
      dispatch(setMessages([]));
      const conv = await createConversation();
      dispatch(setSelectedConversation(conv));
      dispatch(addConversation(conv));
      conversation = conv;
    }

    if (conversation.title === 'New Chat' && trimmed) {
      const generated = generateTitle(trimmed);
      await updateConversation({ id: conversation?._id, title: generated });
      dispatch(setConvTitle({ conversationId: conversation?._id, title: generated }));
    }

    const formData = new FormData();
    formData.append('prompt', trimmed);
    formData.append('conversationId', conversation?._id);
    formData.append('agent', selectedAgent.toLowerCase());
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    dispatch(addMessage({ role: 'user', content: trimmed }));
    setValue('');
    setSelectedFile(null);

    try {
      const data = await sendMessage(formData);
      if (data) {
        dispatch(setArtifacts(data.artifacts || []));
        dispatch(addMessage({ role: 'assistant', content: data?.answer, images: data?.images }));
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      dispatch(
        addMessage({
          role: 'assistant',
          content: 'Error communicating with AI service. Please try again.'
        })
      );
    } finally {
      dispatch(setIsLoading(false));
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const agents = [
    { id: 'auto', icon: Zap, label: 'Auto' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'coding', icon: Code2, label: 'Coding' },
    { id: 'pdf', icon: FileText, label: 'PDF' },
    { id: 'ppt', icon: Presentation, label: 'PPT' },
    { id: 'vision', icon: ImageIcon, label: 'Vision' },
    { id: 'search', icon: Globe, label: 'Search' }
  ];

  const canSubmit = (value.trim().length > 0 || selectedFile !== null) && !isLoading;

  return (
    <div className="w-full px-3 md:px-6 py-4 bg-transparent z-10 shrink-0">
      <div className="max-w-4xl mx-auto flex flex-col gap-2.5 bg-[#0b0e17]/90 border border-white/[0.09] rounded-2xl px-4 pt-3.5 pb-3 shadow-2xl backdrop-blur-2xl focus-within:border-indigo-500/50 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.22)] transition-all duration-200">
        {/* Capability Selectors */}
        <div className="flex w-full gap-1.5 pb-1 overflow-x-auto [scrollbar-width:none]">
          {agents.map((agent) => {
            const isActive = selectedAgent === agent.label;
            const Icon = agent.icon;
            return (
              <button
                key={agent.label}
                type="button"
                onClick={() => setSelectedAgent(agent.label)}
                className={`shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 select-none ${
                  isActive
                    ? 'bg-linear-to-r from-indigo-500 to-violet-600 text-white border-white/20 shadow-[0_1px_10px_rgba(99,102,241,0.4)]'
                    : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-slate-200'
                }`}
              >
                <Icon size={12} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{agent.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected File Badge */}
        {selectedFile && (
          <div className="my-1">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 shadow-sm">
              {selectedFile?.type === 'application/pdf' ? (
                <FileText size={16} className="text-red-400" />
              ) : selectedFile.type?.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="preview"
                  className="h-8 w-8 rounded-lg object-cover"
                />
              ) : (
                <FileText size={16} className="text-indigo-400" />
              )}

              <div className="min-w-0">
                <p className="text-xs text-white max-w-[200px] truncate font-medium">
                  {selectedFile?.name}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {Math.ceil(selectedFile.size / 1024)} KB
                </p>
              </div>

              <button
                type="button"
                className="ml-2 text-slate-500 hover:text-white transition cursor-pointer"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileRef.current) fileRef.current.value = '';
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Multiline Composer Textarea */}
        <textarea
          ref={textareaRef}
          placeholder="Ask MultioraAI anything... (Press Enter to send, Shift+Enter for new line)"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          value={value}
          disabled={isLoading}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-100 placeholder:text-slate-500 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50 min-h-[46px] max-h-40 font-sans"
          rows={2}
        />

        {/* Bottom Bar: Attachment, Voice, Send */}
        <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
          <div className="flex items-center gap-1.5">
            <input
              type="file"
              accept=".pdf,image/*"
              hidden
              ref={fileRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                }
              }}
            />

            <button
              type="button"
              title="Attach File (PDF, Image)"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <Paperclip size={16} />
            </button>

            <button
              type="button"
              onClick={toggleMic}
              title={listening ? 'Stop recording' : 'Speech input'}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition cursor-pointer relative ${
                listening
                  ? 'bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {listening && (
                <span className="animate-ping absolute inset-0 rounded-lg bg-red-400 opacity-75" />
              )}
              {listening ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-xl border-none transition-all duration-200 ${
              canSubmit
                ? 'bg-linear-to-r from-indigo-500 to-violet-600 hover:opacity-95 text-white cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-95'
                : 'bg-white/[0.04] text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
});

export default ChatInput;
