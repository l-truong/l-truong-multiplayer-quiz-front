<template>
  <template v-if='allPlayersFinalResult.length > 0'>
    <div class='d-flex flex-row justify-content-between pb-3'>
      <div class='display-3'>{{ $t('multiPlayer.results.title') }}</div>
    </div>

    <div class='pb-3'>
      <div class='pb-2'>
        <div class='display-5'>
          <div v-if='allPlayersFinalResult.length > 1 && allPlayersFinalResult[0].finalScore === allPlayersFinalResult[1]?.finalScore'>
            {{ $t('multiPlayer.results.tie') }}
            <span v-for='(player, index) in allPlayersFinalResult.filter(p => p.finalScore === allPlayersFinalResult[0].finalScore)' :key='player.username'>
              {{ player.username }}<span v-if='index < allPlayersFinalResult.filter(p => p.finalScore === allPlayersFinalResult[0].finalScore).length - 1'>, </span>
            </span> <i class='fa-solid fa-trophy'></i>
          </div>
          <div v-else>
            {{ $t('multiPlayer.results.gameWinner') }} {{ allPlayersFinalResult[0].username }} <i class='fa-solid fa-trophy'></i> 
          </div>
        </div>
      </div>
      <div>
        <div class='display-6'>{{ $t('multiPlayer.results.total') }}</div>      
        <table class='table table-bordered mt-3'>
          <thead>
            <tr class='table-primary'>
              <th scope='col'>{{ $t('multiPlayer.results.rank') }}</th>
              <th scope='col'>{{ $t('multiPlayer.results.name') }}</th>
              <th scope='col'>{{ $t('multiPlayer.results.score') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for='(player, index) in allPlayersFinalResult' :key='index'>
              <td class='col-2'>
                <span v-if='index === 0 || player.finalScore === allPlayersFinalResult[0].finalScore'>
                  1
                </span>
                <span v-else>
                  {{ index + 1 }}
                </span>
              </td>
              <td class='d-flex'>
                {{ player.username }} <i v-if='index === 0 || player.finalScore === allPlayersFinalResult[0].finalScore' class='fa-solid fa-crown text-primary ps-1'></i>           
              </td>
              <td class='col-2'>{{ player.finalScore }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class='pb-2'>
      <div class='display-5'>
        <div v-if='playersScore[0].score === playersScore[1]?.score'>
          {{ $t('multiPlayer.results.tie') }}
          <span v-for='(player, index) in playersScore.filter(p => p.score === playersScore[0].score)' :key='player.username'>
            {{ player.username }}<span v-if='index < playersScore.filter(p => p.score === playersScore[0].score).length - 1'>, </span>
          </span>
        </div>
        <div v-else>
          {{ $t('multiPlayer.results.roundWinner') }} {{ playersScore[0].username }} 
        </div>
      </div>    
    </div>

    <div class='d-flex justify-content-between align-items-center pb-2'>
      <div :style='step > 0 ? "visibility: visible" : "visibility: hidden"'> 
        <button type='button' class='btn btn-primary' @click='step = 0; scrollBackToTop=false'>
          <i class='fa-solid fa-chevron-left'></i><i class='fa-solid fa-chevron-left'></i>
        </button>
        <button type='button' class='btn btn-primary' @click='step--; scrollBackToTop=false'>
          <i class='fa-solid fa-chevron-left'></i>
        </button>
      </div>

      <div v-if='step != 0' class='display-5'>{{ playersScore[step-1].username }} ({{ playersScore[step-1].score }} / {{ allPlayersScores[0].questions.length }})</div>

      <div :style='step < playersScore.length ? "visibility: visible" : "visibility: hidden"'> 
        <button type='button' class='btn btn-primary' @click='step++; scrollBackToTop=false'>
          <i class='fa-solid fa-chevron-right'></i>
        </button>
        <button type='button' class='btn btn-primary' @click='step = playersScore.length; scrollBackToTop=false'>
          <i class='fa-solid fa-chevron-right'></i><i class='fa-solid fa-chevron-right'></i>
        </button>
      </div>
    </div>

    <div 
      class='flex-grow-1 overflow-auto mb-3'
      :class='{ "pe-3": scrollBackToTop }'
      ref='scrollableDiv'
      @scroll='handleScroll($refs.scrollableDiv)'
    >
      <template v-if='step == 0'>
        <div v-for='(round, indexRound) in allPlayersScores' :key='indexRound'>
          <div class='display-6'>{{ $t('multiPlayer.results.round') }} {{ round.roundIndex + 1 }}</div>        
          <table class='table table-bordered mt-3'>
            <thead>
              <tr class='table-primary'>
                <th scope='col'>{{ $t('multiPlayer.results.rank') }}</th>
                <th scope='col'>{{ $t('multiPlayer.results.name') }}</th>
                <th scope='col'>{{ $t('multiPlayer.results.score') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for='(player, index) in round.playersScore' :key='index'>
                <td class='col-2'>
                  <span v-if='index === 0 || player.score === round.playersScore[0].score'>
                    1
                  </span>
                  <span v-else>
                    {{ index + 1 }}
                  </span>
                </td>
                <td class='d-flex'>
                  {{ player.username }} <i v-if='index === 0 || player.score === round.playersScore[0].score' class='fa-solid fa-crown text-primary ps-1'></i>
                  <div v-if='player.answers.length < round.questions.length' class='ps-2'> [{{ $t('multiPlayer.results.playerLeft') }}]</div>
                </td>                
                <td class='col-2'>{{ player.score }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>
        <div v-for='(question, questionIndex) in allPlayersScores[0].questions' :key='questionIndex' class='pb-2'>
          <div>{{ question.questionText }}</div>
          <div class='fst-italic'>{{ question.explanation }}</div>
          <div class='d-flex flex-row justify-content-between gap-3'>
            <div v-for='(option, optionIndex) in question.options' :key='optionIndex' class='text-center'
              :style='{ color: getOptionColor(option, question.correctAnswer, playersScore[step-1].answers[questionIndex]) }'
            >
              <template v-if='option == playersScore[step-1].answers[questionIndex]'><span class='fw-bold'>[ {{ option }} ]</span></template>
              <template v-else><span>{{ option }}</span></template>
            </div>
          </div>
          <i :class='[ "fa-solid", question.correctAnswer === playersScore[step-1].answers[questionIndex] ? "fa-check" : 
          playersScore[step-1].answers[questionIndex] !== null && playersScore[step-1].answers[questionIndex] !== undefined ? "fa-xmark" : "fa-minus" ]'></i>
        </div>
        
        <div class='d-flex justify-content-between align-items-center bottomButtons'>
          <div :style='step > 0 ? "visibility: visible" : "visibility: hidden"'>
            <button type='button' class='btn btn-primary' @click='step = 0'>
              <i class='fa-solid fa-chevron-left'></i><i class='fa-solid fa-chevron-left'></i>
            </button>
            <button type='button' class='btn btn-primary' @click='step--'>
              <i class='fa-solid fa-chevron-left'></i>
            </button>
          </div>
          
          <div v-if='step != 0' class='display-5'>
          </div>
          
          <div :style='step < playersScore.length ? "visibility: visible" : "visibility: hidden"'> 
            <button type='button' class='btn btn-primary' @click='step++'>
              <i class='fa-solid fa-chevron-right'></i>
            </button>
            <button type='button' class='btn btn-primary' @click='step = playersScore.length'>
              <i class='fa-solid fa-chevron-right'></i><i class='fa-solid fa-chevron-right'></i>
            </button> 
          </div>
        </div>
      </template>  
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
        @click='goToMultiPlayerHome'
      >
        <i class='fa-solid fa-house'></i> {{ $t('multiPlayer.results.home') }}
      </button>
      <button 
        v-if='isAdmin==true'
        type='button'
        class='btn btn-primary'
        @click='navigateEveryPlayerToMultiPlayerSettings()'
      >
        <i class='fa-solid fa-arrow-rotate-right'></i> {{ $t('multiPlayer.results.tryAgain') }}
      </button>
    </div>
  </template>
</template>


<script>
import { navigationMixin } from '@/mixins/navigationMixin';
import { resultsMixin } from '@/mixins/resultsMixin.js';
import { scrollMixin } from '@/mixins/scrollMixin.js';

export default {
  name: 'ResultsComponent',
  props: ['socket', 'roomId', 'admin'],
  mixins: [navigationMixin, resultsMixin, scrollMixin],
  data() {
    return {
      step: 0,
      isAdmin: false,
      playersScore: [],
      allPlayersScores: [],
      allPlayersFinalResult: []
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
    this.socket.on('resultsInRoom', (data) => {
      this.allPlayersScores = data.allPlayersScores;
      this.allPlayersScores.forEach(round => {
        round.playersScore.sort((a, b) => b.score - a.score);
      });
      this.allPlayersScores.reverse();
      this.playersScore = this.allPlayersScores[0].playersScore;
      this.allPlayersFinalResult = data.allPlayersFinalResult;
      this.allPlayersFinalResult.sort((a, b) => b.finalScore - a.finalScore);
    });
    this.socket.on('navigateEveryPlayerToMultiPlayerSettings', () => {
      this.goToMultiPlayerParameters();
    });
  },
  mounted() {
    this.socket.emit('getResults', this.roomId); 
  },
  beforeUnmount() {    
    this.socket.off('newAdmin');
    this.socket.off('resultsInRoom');
    this.socket.off('navigateEveryPlayerToMultiPlayerSettings');
  },
  methods: {
    navigateEveryPlayerToMultiPlayerSettings() {
      this.socket.emit('navigateEveryPlayerToMultiPlayerSettings', this.roomId);
    }
  }
};
</script>