import { Send } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityScreen from '@/components/community/CommunityScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { OPEN_CONVERSATION } from '@/lib/communityContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function OpenConversation() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState('');
  const conversation = OPEN_CONVERSATION;

  return (
    <CommunityScreen showBottomNav={false} bodyClassName="community-chat-screen">
      <div className="community-chat">
        <header className="community-chat__header">
          <BackButton to={withPreviewQuery('/Community/letters-inbox')} />
          <div className="community-chat__person">
            <img src={conversation.photo} alt="" className="community-chat__avatar" />
            <div>
              <p className="community-chat__name">{conversation.name}</p>
              <p className="community-chat__meta">
                {conversation.role} · {conversation.location}
              </p>
            </div>
          </div>
        </header>

        <div className="community-chat__thread">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`community-chat-bubble${message.mine ? ' community-chat-bubble--mine' : ' community-chat-bubble--theirs'}`}
            >
              <p className="community-chat-bubble__text">{message.content}</p>
              <span className="community-chat-bubble__time">{message.time}</span>
            </div>
          ))}
        </div>

        <footer className="community-chat__composer">
          <textarea
            className="aymm-textarea community-chat__input"
            rows={3}
            placeholder="Write a letter..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <Button disabled={!draft.trim()} onClick={() => navigate(withPreviewQuery('/Community/letters-inbox'))}>
            <Send size={16} />
            Send
          </Button>
        </footer>
      </div>
    </CommunityScreen>
  );
}
