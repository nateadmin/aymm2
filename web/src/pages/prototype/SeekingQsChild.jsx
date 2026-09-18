import { useNavigate } from 'react-router-dom';
import PrototypeQuestionScreen from '@/components/prototype/PrototypeQuestionScreen';
import { SEEKING_QS_CHILD } from '@/lib/prototypeContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function SeekingQsChild() {
  const navigate = useNavigate();
  const content = SEEKING_QS_CHILD;

  return (
    <PrototypeQuestionScreen
      title={content.title}
      subtitle={content.subtitle}
      groups={content.groups}
      backTo={withPreviewQuery('/Prototype/home')}
      onContinue={() => navigate(withPreviewQuery('/Prototype/home'))}
    />
  );
}
