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
  isLocked,
  sendingMessage,
}) {
  if (!profile) return null;

  return (
    <Modal open={open} title={`Letter to ${profile.display_name}`} onClose={onClose}>
      {isLocked ? (
        <p className="aymm-muted">
          This chat will unlock after they approve your request.
        </p>
      ) : null}
      <div className="page-shell__grid">
        <div className="aymm-panel aymm-panel--surface">Message thread placeholder</div>
        <TextField
          label="Message"
          name="message"
          value={messageText}
          onChange={(event) => onMessageTextChange?.(event.target.value)}
          placeholder="Write your letter..."
          disabled={isLocked}
        />
        <Button onClick={onSend} disabled={isLocked || sendingMessage || !messageText?.trim()}>
          Send letter
        </Button>
      </div>
    </Modal>
  );
}
