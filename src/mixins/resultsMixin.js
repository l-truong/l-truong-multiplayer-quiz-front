export const resultsMixin = {
  methods: {
    getOptionColor(option, correctAnswer, playersAnswer) { 
      const userAnswer = playersAnswer;
      const root = document.documentElement;

      switch (true) {
        case option === correctAnswer && option === userAnswer:
          return getComputedStyle(root).getPropertyValue('--right-answer-color').trim();
        case option === userAnswer:
          return getComputedStyle(root).getPropertyValue('--wrong-answer-color').trim();
        case option === correctAnswer:
          return getComputedStyle(root).getPropertyValue('--right-answer-color').trim();
        default:
          return getComputedStyle(root).getPropertyValue('--neutral-answer-color').trim();
      }
    }
  }
};