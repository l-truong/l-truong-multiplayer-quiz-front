export const navigationMixin = {
  methods: {
    goToHome() {
      this.$router.push({
        path: '/',
      });
    },
    goToSinglePlayer() {
      this.$router.push({
        path: '/singlePlayer',
      });
    },
    goToMultiPlayer() {
      this.$router.push({
        path: '/multiPlayer',
      });
    },

    goToSinglePlayerHome() {
      this.$emit('goToSinglePlayerHome');
    },
    goToSinglePlayerParameters() {
      this.$emit('goToSinglePlayerParameters');
    },
    goToSinglePlayerQuiz() {
      this.$emit('goToSinglePlayerQuiz');
    },
    goToSinglePlayerResults() {
      this.$emit('goToSinglePlayerResults');
    },

    goToMultiPlayerHome() {
      this.$emit('goToMultiPlayerHome');
    },
    goToMultiPlayerParameters() {
      this.$emit('goToMultiPlayerParameters');
    },
    goToMultiPlayerQuiz() {
      this.$emit('goToMultiPlayerQuiz');
    },
    goToMultiPlayerResults() {
      this.$emit('goToMultiPlayerResults');
    }
  }
};