export const ONBOARDING_PROFILE_QUESTIONS = [
  {
    field: 'question_family_meaning',
    title: 'What does family mean to you?',
    options: [
      { id: 'unconditional_love', label: 'Unconditional love' },
      { id: 'shared_traditions', label: 'Shared traditions' },
      { id: 'hard_times', label: 'Being there in hard times' },
      { id: 'all_of_the_above', label: 'All of the above' },
    ],
  },
  {
    field: 'question_stay_in_touch',
    title: 'How often do you like to stay in touch?',
    options: [
      { id: 'daily', label: 'Daily' },
      { id: 'weekly', label: 'Weekly' },
      { id: 'monthly', label: 'Monthly' },
      { id: 'whenever', label: 'Whenever feels right' },
    ],
  },
  {
    field: 'question_hoping_for',
    title: 'What are you most hoping for?',
    options: [
      { id: 'emotional_connection', label: 'Emotional connection' },
      { id: 'guidance_support', label: 'Guidance and support' },
      { id: 'belonging', label: 'Belonging and acceptance' },
      { id: 'all_of_the_above', label: 'All of the above' },
    ],
  },
];

export function labelForQuestionAnswer(field, value) {
  if (!value) return '';
  const question = ONBOARDING_PROFILE_QUESTIONS.find((item) => item.field === field);
  const match = question?.options.find((option) => option.id === value);
  return match?.label || value;
}
