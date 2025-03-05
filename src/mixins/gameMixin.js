export const gameMixin = {
  methods: {
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    getNameByCategoryId(categoryId) {
      const item = this.categories.find(entry => entry.categoryId === categoryId);
      return item ? item.name : this.$t('singlePlayer.categories.unknownCategory');
    }
  },
  computed: {
    randomizedOptions() {
      return this.shuffleArray([...this.currentQuestion.options]);
    }
  }
};