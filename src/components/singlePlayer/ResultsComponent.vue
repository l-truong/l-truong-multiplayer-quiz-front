<template>
  <div class='d-flex flex-row game'>
    <div class='game-col1 p-3 mobileHide'>
    </div>
    <div class='d-flex flex-column justify-content-between game-col2 p-3 border-start mobileHeight'>
      <div class='d-flex flex-row justify-content-between pb-3'>
        <div class='display-3'>{{ $t('singlePlayer.results.title') }}</div>
        <div class='d-flex flex-column justify-content-center'>
          <div class='display-5'>{{ $t('singlePlayer.results.score') }} {{ correctAnswersCount }} / {{ questions.length }}</div>
        </div>
      </div>

      <div 
        class='flex-grow-1 overflow-auto mb-3'
        :class='{ "pe-3": scrollBackToTop }'
        ref='scrollableDiv'
        @scroll='handleScroll($refs.scrollableDiv)'
      >
        <div v-for='(question, questionIndex) in questions' :key='questionIndex' class=' pb-2'>
          <div>{{ questionIndex + 1 }}. {{ question.questionText }}</div>
          <div class='fst-italic'>{{ question.explanation }}</div>
          <div class='d-flex flex-row justify-content-between gap-3'>
            <div v-for='(option, optionIndex) in question.options' :key='optionIndex' class='text-center'
              :style='{ color: getOptionColor(option, question.correctAnswer, answers[questionIndex]) }'> 
                <template v-if='option == answers[questionIndex]'><span class='fw-bold'>[ {{ option }} ]</span></template>
                <template v-else><span>{{ option }}</span></template>
            </div>
          </div> 
          <i :class='[ "fa-solid", question.correctAnswer === answers[questionIndex] ? "fa-check" : 
          answers[questionIndex] !== null && answers[questionIndex] !== undefined ? "fa-xmark" : "fa-minus" ]'></i>
        </div>
      </div>

      <div class='d-flex flex-row justify-content-end gap-2'>
        <button
          v-if='scrollBackToTop'
          class='btn btn-secondary'
          @click='scrollToTop($refs.scrollableDiv)'
        >
          <i class='fa-solid fa-chevron-up'></i>
        </button> 
        <button
          type='button'
          class='btn btn-secondary'
          @click='goToSinglePlayerHome'
        >
          <i class='fa-solid fa-house'></i> {{ $t('singlePlayer.results.home') }}
        </button>
        <button 
          type='button'
          class='btn btn-primary'
          @click='goToSinglePlayerParameters'
        >
          <i class='fa-solid fa-arrow-rotate-right'></i> {{ $t('singlePlayer.results.tryAgain') }}
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import { navigationMixin } from '@/mixins/navigationMixin.js';
import { resultsMixin } from '@/mixins/resultsMixin.js';
import { scrollMixin } from '@/mixins/scrollMixin.js';

export default {
    name: 'ResultsCompnent',
    mixins: [navigationMixin, resultsMixin, scrollMixin],
    data() {
      return {
        questions: [],
        answers: []
      }
    },
    created() {
      this.checkBadValuesForRedirection();
      this.questions = this.$questions;
      this.answers = this.$answers;
    },
    methods: {
      checkBadValuesForRedirection() {
        if (this.$questions == undefined || this.$questions == null || !this.$questions || this.$questions.length == 0 || 
        !this.$answers == undefined || this.$answers == null || !this.$answers || this.$answers.length == 0) { 
          this.goToSinglePlayerHome();
        }
      }
    },
    computed: {
      correctAnswersCount() {
        return this.questions.reduce((count, question, index) => {
          if (this.answers[index] === question.correctAnswer) {
            count++;
          }
          return count;
        }, 0);
      }
    }
};
</script>