export default {
  axios: {
    baseUrl: 'https://l-truong-multiplayer-quiz-back.onrender.com'
  },
  socket: {
    baseUrl: 'https://l-truong-multiplayer-quiz-back.onrender.com/'
  },
  localStorage: {
    sufix: 'l-truong-multiplayer-quiz-back.',
    localLanguage: 'localeLanguage',
    dontShowAgainFor24h: 'dontShowAgainFor24h',
    popupDismissedAt: 'popupDismissedAt'
  },
  toast: {
    maxToasts: 7,
    newestOnTop: false,
    timeout: 2000
  },
  scroll: {
    smallScreenHeight: 800,
    smallScreenWidth: 1100,
    minResultsScroll: 50,
  },
  lobbyParameters: {
    usernameMaxLength: 20,
    roomIdMaxLength: 20,
  },  
  categoriesParameters: {
    defaultNbQuestions: 20,  
    questionsRange: {
      min: 5,
      max: 40,
      step: 5,
    },
    defaultTimer: 15,
    timerRange: {
      min: 5,
      max: 30,
      step: 5,
    },
    chatMessagesMaxLength: 25,
  },
  otherParameters: {
    defaultLanguage: 'fr', //['eng','fr']
  }   
};