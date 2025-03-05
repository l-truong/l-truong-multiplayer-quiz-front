<template>
  <div class='singleplayer h-100 w-100'>
    <CategoriesComponent
      v-if='step == 0'
      @goToSinglePlayerHome='goToHome'
      @goToSinglePlayerQuiz='goToStep(1)' />
    <GameComponent
      v-else-if='step == 1'
      @goToSinglePlayerHome='goToHome'
      @goToSinglePlayerResults='goToStep(2)' />
    <ResultsComponent
      v-else-if='step == 2'
      @goToSinglePlayerHome='goToHome'
      @goToSinglePlayerParameters='goToStep(0)' />
  </div>
</template>

<script>
import { navigationMixin } from '@/mixins/navigationMixin';
import CategoriesComponent from '@/components/singlePlayer/CategoriesComponent.vue';
import GameComponent from '@/components/singlePlayer/GameComponent.vue';
import ResultsComponent from '@/components/singlePlayer/ResultsComponent.vue';

export default {
  name: 'SinglePlayerView',
  components: {
    CategoriesComponent,
    GameComponent,
    ResultsComponent,
  },
  mixins: [navigationMixin],
  data() {
    return {
      step: 0,
    }
  },
  methods: {
    goToStep(step) {
      this.step = step;
      this.$setSinglePlayerPageStep(this.step);
    }
  }
};
</script>