
export type QuizQuestion = {
  id: string;
  type: 'radio' | 'checkbox' | 'text' | 'number';
  question: string;
  options?: string[];
  placeholder?: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'gender',
    type: 'radio',
    question: 'What is your gender?',
    options: ['Male', 'Female', 'Prefer not to say'],
  },
  {
    id: 'age',
    type: 'number',
    question: 'What is your age?',
    placeholder: 'e.g., 18',
  },
  {
    id: 'educationLevel',
    type: 'radio',
    question: 'What is your current education level?',
    options: ['Completed Class 10', 'Completed Class 12', 'Undergraduate', 'Graduate', 'Other'],
  },
  {
    id: 'location',
    type: 'text',
    question: 'Which state do you live in?',
    placeholder: 'e.g., Maharashtra',
  },
  {
    id: 'marks',
    type: 'number',
    question: 'What were your overall marks in 12th grade (in %)?',
    placeholder: 'e.g., 85',
  },
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
