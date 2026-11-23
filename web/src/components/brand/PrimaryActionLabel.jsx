import AymmQuestion from './AymmQuestion';

export const AYMM_QUESTION_LABEL = 'AYMM?';
export const AYMF_QUESTION_LABEL = 'AYMF?';

export default function PrimaryActionLabel({ label }) {
  if (label === AYMF_QUESTION_LABEL) {
    return <AymmQuestion variant="button" brand="aymf" />;
  }
  if (label === AYMM_QUESTION_LABEL) {
    return <AymmQuestion variant="button" />;
  }
  return label;
}
