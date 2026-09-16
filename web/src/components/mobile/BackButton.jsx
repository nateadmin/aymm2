import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ to, label = 'Back' }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="screen-back"
      onClick={() => {
        if (to) {
          navigate(to);
          return;
        }
        navigate(-1);
      }}
    >
      <ChevronLeft size={18} strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}
