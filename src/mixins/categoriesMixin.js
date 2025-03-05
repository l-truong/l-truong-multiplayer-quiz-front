import { questionsService } from '@/services/questionsService';

export const categoriesMixin = {
  methods: {
    async getQuestions() {
      if (this.choosenCategory.length > 0) {
        try {
          let randomQuestions = await questionsService.getRandomQuestions(
            this.choosenNbQuestions,
            this.choosenCategory
          );
          return randomQuestions;
        } catch (error) {
          console.error('There was an error loading categories.');
          return [];
        }
      }
      return [];
    },
    convertMinutesToMinSec(timer) {
      const min = Math.floor(timer);
      const sec = Math.round((timer - min) * 60);
      if (sec === 0) {
        return `${min} ${this.$t('multiPlayer.categories.minutes')}`;
      } else {
        return `${min} ${this.$t('multiPlayer.categories.minutes')} ${sec} ${this.$t('multiPlayer.categories.secondes')}`;
      }
    }
  },
  computed: {
    sumOccurrencesByCategory() {
      return this.$stats.reduce((sum, stat) => {
        if (this.choosenCategory.includes(stat.categoryId)) {
          return sum + stat.occurence;
        }
        return sum;
      }, 0);
    },
    sumAllOccurrences() {
      return this.$stats.reduce((sum, stat) => sum + stat.occurence, 0);
    },
    timer() {
      return (this.choosenNbQuestions * this.choosenTimer) / 60;
    }
  },
  watch: {
    categories: {
      handler() {
        this.choosenCategory = this.categories.map(category => category.categoryId);        
      },
      deep: true
    }
  }
};
