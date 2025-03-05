<template>
  <div v-if='currentQuestion'>
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
          class='btn btn-primary h-100 w-100 p-3'
          :class="{
            'btn-primary': !answered && selectedOption !== optionIndex,
            'btn-primary': answered && selectedOption === optionIndex,
            'btn-secondary': answered && selectedOption !== optionIndex,
          }"
          :value='option'
          :disabled='answered'
          @click='submitAnswer(option, optionIndex)'
        >
          <div class='display-6'>{{ option }}</div>
        </button>
      </div>
    </div>
  </div>
  <div v-else>
    {{ $t('multiPlayer.game.loadingQuestion') }}
  </div>
</template>

<script>
import { navigationMixin } from '@/mixins/navigationMixin';
import { gameMixin } from '@/mixins/gameMixin';

export default {
  name: 'GameComponent',
  props: ['socket', 'roomId', 'admin'],
  mixins: [navigationMixin, gameMixin],
  data() {
    return {
      isAdmin: false,
      currentQuestion: null,
      currentQuestionIndex: null,
      answered: false,
      selectedOption: null
    }
  },
  created() {
    this.isAdmin = this.admin;    
    this.socket.on('newAdmin', (newAdmin) => {
      this.isAdmin = newAdmin.id === this.socket.id;
      if (newAdmin.id === this.socket.id) {
        this.$emit('newAdmin', true);
      } 
    });
    this.socket.on('newQuestion', (data) => {
      this.currentQuestion = data.currentQuestion;
      this.currentQuestionIndex = data.currentQuestionIndex;
      this.answered = false;
      this.selectedOption = null;
    });
    this.socket.on('quizEnded', () => {
      this.$emit('goToResults');
      this.goToMultiPlayerResults();
    });
  },
  beforeUnmount() {
    this.socket.off('newAdmin');
    this.socket.off('newQuestion');
    this.socket.off('quizEnded');
  },
  methods: {
    submitAnswer(option, optionIndex) {
      if (this.answered) return;
      this.answered = true;
      this.selectedOption = optionIndex;
      this.socket.emit('submitAnswer', this.roomId, option);
    }
  }
};
</script>
