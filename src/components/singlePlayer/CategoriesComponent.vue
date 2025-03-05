<template>
  <div class='d-flex flex-row game'>
    <div class='game-col1 p-3 mobileHide'>
    </div>
    <div class='d-flex flex-column justify-content-between game-col2 p-3 border-start mobileHeight'>
      <div class='pb-'>
        <div class='d-flex flex-row justify-content-between pb-3'>
          <div class='display-3'>{{ $t('singlePlayer.categories.title') }}</div>
          <div class='d-flex flex-column justify-content-center align-items-end'>
            <div class='display-5 text-end'>{{ sumOccurrencesByCategory }} / {{ sumAllOccurrences }} {{ $t('singlePlayer.categories.questionRange') }}</div>
            <div class='display-6 text-end'>{{ convertMinutesToMinSec(timer) }}</div>
          </div>
        </div>
        
        <div class='pb-3'>
          <div class='display-4'>{{ $t('singlePlayer.categories.numberOfQuestions') }}</div>
          <div>
            <input 
              type='range'
              id='choosenNbQuestions'
              name='choosenNbQuestions'
              class='form-range' 
              v-model='choosenNbQuestions'
              :min='config.categoriesParameters.questionsRange.min'
              :max='config.categoriesParameters.questionsRange.max'
              :step='config.categoriesParameters.questionsRange.step'
            />
            <div>{{ choosenNbQuestions }} {{ $t('singlePlayer.categories.questionRange') }}</div>
          </div>
        </div>

        <div class='pb-3'>
          <div class='display-4'>{{ $t('singlePlayer.categories.categories') }}</div>
          <div>
            <div 
              v-for='category in $categories' 
              :key='category._id' 
              class='form-check'
            >
              <label>
                <input 
                  type='checkbox'
                  class='form-check-input'
                  v-model='choosenCategory'
                  :value='category.categoryId'
                />
                <div>{{ category.name }}</div>
              </label>
            </div>
          </div>
        </div>

        <div class='pb-3'>
          <div class='display-4'>{{ $t('singlePlayer.categories.timer') }}</div>
          <div>
            <input
              type='range'
              class='form-range'
              v-model='choosenTimer'
              id='choosenTimer'
              name='choosenTimer'
              :min='config.categoriesParameters.timerRange.min'
              :max='config.categoriesParameters.timerRange.max'
              :step='config.categoriesParameters.timerRange.step'
            />
            <div>{{ choosenTimer }} {{ $t('singlePlayer.categories.timesValue') }}</div>
          </div>
        </div>
      </div>

      <div class='d-flex flex-row justify-content-between'>
        <button 
          type='button'
          class='btn btn-secondary'
          @click='goToSinglePlayerHome'
        >
          <i class='fa-solid fa-caret-left'></i> {{ $t('singlePlayer.categories.return') }}
        </button>
        <button 
          type='button'
          class='btn btn-primary'
          v-if='choosenCategory.length > 0 && sumOccurrencesByCategory >= choosenNbQuestions' 
          @click='startQuiz'
        >
          {{ $t('singlePlayer.categories.start') }} <i class='fa-solid fa-caret-right'></i>
        </button> 
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config/gameConfig';
import { navigationMixin } from '@/mixins/navigationMixin.js';
import { categoriesMixin } from '@/mixins/categoriesMixin.js';

export default {
  name: 'CategoriesComponent',
  mixins: [navigationMixin, categoriesMixin],
  data() {
    return {
      config: config,
      router: null, 
      stats: [],
      choosenNbQuestions: null,
      choosenTimer: null,
      categories: [],
      choosenCategory: []
    };
  }, 
  created() {
    this.checkBadValuesForRedirection();
    this.categories = this.$categories;
    this.stats = this.$stats;
    this.choosenNbQuestions = this.$categoriesParameters.choosenNbQuestions;
    this.choosenCategory = this.$categoriesParameters.choosenCategory;
    this.choosenTimer = this.$categoriesParameters.choosenTimer;
  },
  mounted() {
    this.choosenCategory = this.categories.map(category => category.categoryId);
  },
  methods: {
    checkBadValuesForRedirection() {
      if (this.$categories == undefined || this.$categories == null || !this.$categories || this.$categories.length == 0 || 
      !this.$stats == undefined || this.$stats == null || !this.$stats || this.$stats.length == 0 ||
      !this.$categoriesParameters) {
        this.goToSinglePlayerHome();
      }
    },
    async startQuiz() {
      let questions = await this.getQuestions();
      this.$setQuestions(questions);
      this.$setTimer(this.choosenTimer);
      this.$setCategoriesParameters(this.choosenNbQuestions, this.choosenCategory, this.choosenTimer);
      this.goToSinglePlayerQuiz()
    }
  }
};
</script>