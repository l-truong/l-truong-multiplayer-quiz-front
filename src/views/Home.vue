<template> 
  <div class='home w-100'> 
    <div class='d-flex justify-content-center align-items-center row'>
      <div class='col-6 col-sm-3 card text-center' @click='goToSinglePlayer()'>
        <div class='d-flex flex-column justify-content-center align-items-center card-body'>
          <div class='card-title display-6'><i class='fa-solid fa-user'></i></div>
          <div class='card-text display-6'>{{ $t('home.singlePlayer') }} </div>
        </div>
      </div>

      <div class='col-6 col-sm-3 card text-center' @click='goToMultiPlayer()'>
        <div class='d-flex flex-column justify-content-center align-items-center card-body'>
          <div class='card-title display-6'><i class='fa-solid fa-users'></i></div>
          <div class='card-text display-6'>{{ $t('home.multiPlayer') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { navigationMixin } from '../mixins/navigationMixin';

export default {
  name: 'HomeView',
  mixins: [navigationMixin],
  data() {
    return {
    };
  },
  created() {
    this.$setSinglePlayerPageStep(0);
    this.$setMultiPlayerPageStep(0);
  },
  mounted() {},
  beforeUnmount() {},
  methods: {}
};
</script>