<template>
  <div class='multiplayer h-100 w-100'> 
    <LobbyComponent
      v-if='!roomCreated' 
        :socket='socket' 
        @roomCreation='roomCreation' />
    <div v-else class='d-flex flex-row game'>
      <div class='d-flex flex-column game-col1 p-3'>
        <PlayersListComponent 
          v-if='step == 1 || step == 3' 
          :socket='socket' 
          :roomId='roomId' />
        <QuestionsInformationsComponent 
          v-else-if='step == 2' 
          :socket='socket' 
          :roomId='roomId' />
        <br /><br />
        <ChatComponent 
          :socket='socket' 
          :roomId='roomId' />
      </div>
      <div class='d-flex flex-column justify-content-between game-col2 p-3 border-start'>
        <CategoriesComponent 
          v-if='step == 1' 
          :socket='socket' 
          :roomId='roomId' 
          :admin='isAdmin'
          @newAdmin='handleNewAdmin'
          @goToMultiPlayerHome='goToHome' 
          @goToMultiPlayerQuiz='goToStep(2)' />
        <GameComponent 
          v-if='step == 2' 
          :socket='socket' 
          :roomId='roomId'
          :admin='isAdmin'
          @newAdmin='handleNewAdmin'
          @goToMultiPlayerResults='goToStep(3)' />
        <ResultsComponent 
          v-if='step == 3' 
          :socket='socket' 
          :roomId='roomId' 
          :admin='isAdmin'
          @newAdmin='handleNewAdmin'
          @goToMultiPlayerHome='goToHome' 
          @goToMultiPlayerParameters='goToStep(1)' />
      </div>
    </div>
    <ToastManagementComponent :socket='socket' />
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import config from '@/config/gameConfig';
import { navigationMixin } from '@/mixins/navigationMixin';
import LobbyComponent from '@/components/multiPlayer/LobbyComponent.vue';
import PlayersListComponent from '@/components/multiPlayer/leftSide/PlayersListComponent.vue';
import ChatComponent from '@/components/multiPlayer/leftSide/ChatComponent.vue';
import QuestionsInformationsComponent from '@/components/multiPlayer/leftSide/QuestionsInformationsComponent.vue';
import CategoriesComponent from '@/components/multiPlayer/rightSide/CategoriesComponent.vue';
import GameComponent from '@/components/multiPlayer/rightSide/GameComponent.vue';
import ResultsComponent from '@/components/multiPlayer/rightSide/ResultsComponent.vue';
import ToastManagementComponent from '@/components/multiPlayer/ToastManagementComponent.vue';

export default {
  name: 'MultiPlayerView',
  components: {
    LobbyComponent,
    PlayersListComponent,
    QuestionsInformationsComponent,
    ChatComponent,
    CategoriesComponent,
    GameComponent,
    ResultsComponent,
    ToastManagementComponent
  },
  mixins: [navigationMixin],
  data() {
    return {
      step: 0,
      roomId: '',
      roomCreated: false,
      socket: io(config.socket.baseUrl, {
        transports: ['websocket'],
      }),
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    this.socket.emit('disconnectManually');
  },
  methods: {
    roomCreation(data) {
      this.roomId = data.roomId;
      this.isAdmin = data.isAdmin;
      this.roomCreated = true;
      this.goToStep(1);
    }, 
    goToStep(step) {
      this.step = step;
      this.$setMultiPlayerPageStep(this.step);
    },
    goToHome() {
      this.roomCreated = false;
      this.goToStep(0);
      this.socket.emit('disconnectManually');
    },
    handleBeforeUnload() {
      this.socket.emit('disconnectManually');
    },
    handleNewAdmin(isAdmin) {
      this.isAdmin = isAdmin;
    }
  },
  watch: {
    step(newStep) {
      if (newStep === 0) {
        this.socket.emit('disconnectManually');
      }
    },
  },
};
</script>