<template>
  <div v-if='isAdmin' class='pb-3'>
    <div>
      <div class='d-flex flex-row justify-content-between pb-3'>
        <div class='display-3'>{{ $t('multiPlayer.categories.title') }}</div>
        <div class='d-flex flex-column justify-content-center'>
          <div class='display-5 text-end'>{{ sumOccurrencesByCategory }} / {{ sumAllOccurrences }} {{ $t('multiPlayer.categories.questionRange') }}</div>
          <div class='display-6 text-end'>{{ convertMinutesToMinSec(timer) }}</div>
        </div>
      </div>

      <div class='pb-3'>
        <div class='display-4'>{{ $t('multiPlayer.categories.numberOfQuestions') }}</div>
        <div>
          <input
            type='range'
            v-model='choosenNbQuestions'
            id='choosenNbQuestions'
            name='choosenNbQuestions'
            class='form-range' 
            :min='config.categoriesParameters.questionsRange.min'
            :max='config.categoriesParameters.questionsRange.max'
            :step='config.categoriesParameters.questionsRange.step'
          />
          <div>{{ choosenNbQuestions }} {{ $t('multiPlayer.categories.questionRange') }}</div>
        </div>
      </div>
    </div>

    <div class='pb-3'>
      <div class='display-4'>{{ $t('multiPlayer.categories.categories') }}</div>
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

    <div>
      <div class='display-4'>{{ $t('multiPlayer.categories.timer') }}</div>
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
        <div>{{ choosenTimer }} {{ $t('multiPlayer.categories.timesValue') }}</div>
      </div>
    </div>
  </div>
  <div v-else class='d-flex justify-content-center align-items-center h-100 p-3 categoriesWaiting'>
    <div class='pe-3'>{{ $t('multiPlayer.categories.waiting') }}</div>
    <div class='spinner-border text-primary' role='status'></div>
  </div>

  <div class='d-flex flex-row justify-content-between'>
    <button 
      type='button'
      class='btn btn-secondary'
      @click='goToMultiPlayerHome'
    >
      <i class='fa-solid fa-caret-left'></i> {{ $t('multiPlayer.categories.return') }}
    </button>
    <button
      type='button'
      class='btn btn-primary'
      v-if='choosenCategory.length > 0 && sumOccurrencesByCategory >= choosenNbQuestions && isAdmin'
      @click='starQuiz'
    >
      {{ $t('multiPlayer.categories.start') }} <i class='fa-solid fa-caret-right'></i>
    </button>
  </div>
</template>

<script>
import config from '@/config/gameConfig';
import { navigationMixin } from '@/mixins/navigationMixin.js';
import { categoriesMixin } from '@/mixins/categoriesMixin.js';

export default {
  name: 'CategoriesComponent',
  props: ['socket', 'roomId', 'admin'],
  mixins: [navigationMixin, categoriesMixin],
  data() {
    return {
      config: config,
      isAdmin: false,
      players: [],
      roomError: '',
      stats: [],
      choosenNbQuestions: null,
      choosenTimer: null,
      categories: [],
      choosenCategory: [],
      questions: [],
    }
  },
  created() {
    this.isAdmin = this.admin;

    if (this.isAdmin == true) {      
      this.setParameters();
    }
    this.socket.on('roomEntered', (admin) => {
      this.isAdmin = admin;
    });
    this.socket.on('newAdmin', (newAdmin) => {
      this.isAdmin = newAdmin.id === this.socket.id;               
      this.setParameters();   
      if (newAdmin.id === this.socket.id) {
        this.$emit('newAdmin', true);
      } 
    });
    this.socket.on('quizStarted', () => {
      this.goToMultiPlayerQuiz();
    });
  },
  mounted() {
    this.choosenCategory = this.categories.map(category => category.categoryId);
  },
  beforeUnmount() {
    this.socket.off('roomEntered');
    this.socket.off('newAdmin');
    this.socket.off('quizStarted');
  },
  methods: {
    setParameters() {
      this.categories = this.$categories;
      this.stats = this.$stats;
      this.choosenNbQuestions = this.$categoriesParameters.choosenNbQuestions;
      this.choosenCategory = this.$categoriesParameters.choosenCategory;
      this.choosenTimer = this.$categoriesParameters.choosenTimer;
    },
    async starQuiz() {
      this.questions = await this.getQuestions();
      const params = {
        choosenNbQuestions: this.choosenNbQuestions,
        choosenCategory: this.choosenCategory,
        choosenTimer: this.choosenTimer,
        questions: this.questions,
        quizLanguage: this.$i18n.locale
      };
      this.socket.emit('startQuiz', this.roomId, params);
    }
  }
};
</script>