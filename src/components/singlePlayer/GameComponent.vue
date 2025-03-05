<template>
  <div class='d-flex flex-row game' v-if='questions.length > 0'>
    <div class='game-col1 p-3'>
      <div class='display-4 pb-2'>{{ $t('singlePlayer.game.title') }} {{ index + 1 }} / {{ questions.length }}</div>
      <div class='progress mb-3'>
        <div class='progress-bar' role='progressbar' 
            :style='{ width: ((index / questions.length) * 100) + "%" }' 
            aria-valuenow='0' 
            aria-valuemin='0' 
            aria-valuemax='100'>
        </div>
      </div>
      <div class='display-5 pb-2'>{{ getNameByCategoryId(questions[index].categoryId) }}</div>
      <div class='d-flex justify-content-center align-items-center'>
        <div class='d-flex justify-content-center align-items-center position-relative countdown'>
          <div class='circle bg-secondary rounded-circle background-circle'></div>
          <div
            class='circle bg-primary rounded-circle progress-circle'
            :style='{ background: `conic-gradient(var(--primary-color) ${calculatePercentage}%, var(--background-color) ${calculatePercentage}% 100%)` }'
          ></div>
          <div class='d-flex justify-content-center align-items-center text-center circle-text display-5'>
            {{ timeLeft }}
          </div>
        </div>
      </div>
    </div>
    
    <div class='d-flex flex-column justify-content-between game-col2 p-3 border-start'>
      <div>
        <div class='text-center display-4 pb-3'>{{ currentQuestion.questionText }}</div>
        <div class='row'>           
          <div class='d-flex justify-content-center align-items-center text-center pb-2'>
            <div class='pb-3 image-container'>
              <img class='image' :src='currentQuestion.imageUrl' :alt='"question " + currentQuestionIndex + " image"'>
            </div>
          </div>               
          <div v-for='(option, optionIndex) in randomizedOptions' :key='optionIndex' class='col-12 col-md-6 mb-2'>
            <button
              type='button'              
              :id='`option-${optionIndex}`'
              class='btn btn-primary h-100 w-100 p-3 '
              :value='option'
              @click='goNextQuestion(option)'
            >
              <div class='display-6'>{{ option }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { navigationMixin } from '../../mixins/navigationMixin';
import { gameMixin } from '@/mixins/gameMixin';

export default {
  name: 'GameComponent',
  mixins: [navigationMixin, gameMixin],
  data() {
    return { 
      timestamp: 0,
      timeLeft: 0,
      timer: null,

      questions: [],
      categories: [],
      index: 0,
      selectedAnswersList: []
    }
  },
  created() {
    this.checkBadValuesForRedirection();

    this.questions = this.$questions;
    this.categories = this.$categories;
    this.timestamp = this.$timestamp;
    this.timeLeft = this.timestamp.value;
  },
  mounted() {
    this.startTimer();
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    checkBadValuesForRedirection() {
      if (this.$questions == undefined || this.$questions == null || !this.$questions || this.$questions.length == 0 || 
      !this.$categories == undefined || this.$categories == null || !this.$categories || this.$categories.length == 0 ||
      !this.$timestamp) {
        this.goToSinglePlayerHome();
      }
    },
    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeLeft > 1) {
          this.timeLeft--;
        } else {
          this.goNextQuestion(null);
        }
      }, 1000);
    },
    goNextQuestion(option) {
      this.timeLeft = this.timestamp.value;
      this.selectedAnswersList.push(option);
      
      if (this.index == this.questions.length - 1) {
        clearInterval(this.timer);
        this.$setAnswers(this.selectedAnswersList);
        this.goToSinglePlayerResults();
      } else {
        this.index++;
      }
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.index];
    },
    calculatePercentage() {
      return ((this.timeLeft * 100) / this.timestamp.value);
    },
  }
};
</script>