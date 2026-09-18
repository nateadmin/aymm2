import AymmQuestion from './AymmQuestion';

export const AYMM_QUESTION_LABEL = 'AYMM?';

export default function PrimaryActionLabel({ label }) {
  if (label === AYMM_QUESTION_LABEL || label === 'AYMF?') {
    return <AymmQuestion />;
  }
  return label;
}
