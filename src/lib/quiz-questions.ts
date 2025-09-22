export type QuizQuestion = {
  id: string;
  type: 'radio' | 'checkbox';
  question: string;
  options: string[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'interest',
    type: 'radio',
    question: 'Which of these areas sparks your curiosity the most?',
    options: [
      'Technology and Innovation',
      'Arts and Creativity',
      'Science and Research',
      'Business and Entrepreneurship',
      'Helping and Nurturing Others',
    ],
  },
  {
    id: 'aptitude',
    type: 'radio',
    question: 'You are faced with a complex logical puzzle. How do you feel?',
    options: [
        'Excited and ready to solve it systematically.',
        'A bit intimidated, but willing to try.',
        'Prefer to work on something more creative.',
        'I would rather ask for help or collaborate.',
    ],
  },
  {
    id: 'skills',
    type: 'checkbox',
    question: 'Which of these skills do you enjoy using or want to develop? (Select up to 3)',
    options: [
      'Problem-solving and logical thinking',
      'Creative expression and design',
      'Data analysis and interpretation',
      'Communication and public speaking',
      'Leadership and team management',
      'Hands-on building and crafting',
    ],
  },
  {
    id: 'personality',
    type: 'radio',
    question: 'How do you prefer to work?',
    options: [
      'Independently, focusing on my own tasks',
      'Collaboratively in a team environment',
      'A mix of both independent and team work',
    ],
  },
];
