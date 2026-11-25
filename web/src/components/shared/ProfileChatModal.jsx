import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';

export default function ProfileChatModal({
  profile,
  open,
  onClose,
  messageText,
  onMessageTextChange,
  onSend,
  connected = false,
  priorLetterRequest = false,
  composerDisabled = false,
  sendingMessage,
}) {
  if (!profile) return null;

  let helperText = null;
  if (composerDisabled) {
    helperText = 'Demo profiles cannot receive letters on the live app.';
  } else if (connected) {
    helperText = 'You are connected. Letters you send appear under Letters → Open.';
  } else if (priorLetterRequest) {
    helperText =
      'You already sent a letter request. You can send another, or use Adopt/AYMM? on their profile and have them accept under Letters → Connections.';
  } else {
    helperText =
      'This sends a letter request to their Requests inbox. Full chat unlocks after you connect (Adopt/AYMM? and they accept).';
  }

  return (
    <Modal open={open} title={`Letter to ${profile.display_name}`} onClose={onClose}>
      <p className="aymm-muted profile-chat-modal__helper">{helperText}</p>
      <div className="page-shell__grid profile-chat-modal__form">
        <TextField
          label="Message"
          name="message"
          value={messageText}
          onChange={(event) => onMessageTextChange?.(event.target.value)}
          placeholder="Write your letter..."
          disabled={composerDisabled}
        />
        <Button
          onClick={onSend}
          disabled={composerDisabled || sendingMessage || !messageText?.trim()}
        >
          Send letter
        </Button>
      </div>
    </Modal>
  );
}