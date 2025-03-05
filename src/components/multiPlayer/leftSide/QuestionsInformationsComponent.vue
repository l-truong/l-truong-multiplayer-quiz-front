<template>
  <div v-if='currentQuestion' class='pb-4'>
    <div class='display-4 pb-2'>{{ $t('multiPlayer.questionInformations.title') }} {{ currentQuestionIndex + 1 }} / {{ questionsLength }}</div>
    <div class='progress mb-3'>
      <div class='progress-bar' role='progressbar' 
          :style='{ width: ((currentQuestionIndex / questionsLength) * 100) + "%" }' 
          aria-valuenow='0' 
          aria-valuemin='0' 
          aria-valuemax='100'>
      </div>
    </div>
    <div class='display-5 pb-2'>{{ getNameByCategoryId(currentQuestion.categoryId) }}</div> 
    <div v-if='langIsDifferentFromAdmin' class='pb-2'>
      <div>{{ $t('multiPlayer.questionInformations.langIsDifferentFromAdmin') }}</div>
    </div>
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
</template>

<script>
import { gameMixin } from '@/mixins/gameMixin';
import { categoriesService } from '@/services/categoriesService';

export default {
  name: 'QuestionsInformationsComponent',
  mixins: [gameMixin],
  props: ['socket', 'roomId'],
  data() {
    return {
      choosenTimer: 0,
      timeLeft: 0,
      quizEnded: false,
      categories: [],
      questionsLength: 0,
      currentQuestionIndex: 0,
      currentQuestion: null,
      quizLanguage: null,
      playerAlreadyAnswered: false
    }
  },
  created() {
    this.categories = this.$categories;

    this.socket.on('newQuestion', async (data) => {
      this.choosenTimer = data.choosenTimer;
      this.timeLeft = this.choosenTimer;
      this.questionsLength = data.questionsLength;
      this.currentQuestionIndex = data.currentQuestionIndex;
      this.currentQuestion = data.currentQuestion;
      this.quizEnded = false;
      this.quizLanguage = data.quizLanguage
      this.playerAlreadyAnswered = false; 

      if (this.quizLanguage !== this.$i18n.locale) {
        this.categories = await categoriesService.getCategories(this.quizLanguage);
      }
    });
    this.socket.on('playerAlreadyAnswered', () => {
      this.playerAlreadyAnswered = true;
    });
    this.socket.on('quizEnded', () => {
      this.quizEnded = true;
      this.stopTimer();
    });
  },
  mounted() {
    this.startTimer();
  },
  beforeUnmount() {
    this.socket.off('newQuestion');
    this.socket.off('playerAlreadyAnswered');
    this.socket.off('quizEnded');
    this.stopTimer();
  },
  methods: {
    startTimer() {
      this.choosenTimer = setInterval(() => {
        if (this.timeLeft > 1) {
          this.timeLeft--;
        } else {
          if (!this.quizEnded) {
            if(this.playerAlreadyAnswered == false) {
              this.socket.emit('submitAnswer', this.roomId, null);
            }
          }
          this.stopTimer();
        }
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.choosenTimer);
      this.choosenTimer = null;
    }
  },
  computed: {
    langIsDifferentFromAdmin() {
      return this.quizLanguage !== this.$i18n.locale
    },
    calculatePercentage() {
      return ((this.timeLeft * 100) / this.choosenTimer);
    },
  }
};
</script>