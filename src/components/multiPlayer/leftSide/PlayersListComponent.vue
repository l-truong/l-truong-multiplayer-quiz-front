<template>
  <div class='pb-3'>
    <div class='d-flex justify-content-center pb-3'>
      <button 
        type='button'
        class='btn btn-primary'
        @click='copyToClipboard'
      >
        {{ $t('multiPlayer.playersList.copyLink') }} <i class='fa-solid fa-copy'></i>
      </button>
    </div>

    <div class='d-flex justify-content-center pb-3'>
      <div class='display-5'>{{ playersList.length }} / {{ maxPlayer }} {{ $t('multiPlayer.playersList.players') }}</div>
    </div>

    <div class='d-flex flex-column'>
      <div 
        v-for='(player) in playersList' 
        :key='player.id' 
        class='d-flex flex-row justify-content-between align-items-center pt-2 pb-2 ps-3 pe-3 mb-2'
        :class='player.isAdmin ? ["alert-primary"]: ["alert-secondary"]'>
        {{ player.username }} <i v-if='player.isAdmin' class='fa-solid fa-screwdriver-wrench'></i>
      </div>
      <div 
        v-for='(index) in (maxPlayer - playersList.length)' 
        :key='index' 
        class='d-flex alert-secondary flex-row justify-content-between align-items-center pt-2 pb-2 ps-3 pe-3 mb-2'
      >
        {{ $t('multiPlayer.playersList.waitingForOtherPlayers') }}
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification';

export default {
  name: 'PlayersListComponent',
  props: {
    socket: Object,
    roomId: String,
  },
  data() {
    return {
      maxPlayer: 0,
      playersList: [],
      chatMessages: [],
      newMessage: '',
    }
  },
  created() {
    this.socket.emit('getPlayersInRoom', this.roomId);

    this.socket.on('playersInRoom', (data) => {
      this.maxPlayer = data.maxPlayer;
      this.playersList = data.players;
    });
    this.socket.on('roomEntered', () => {
      this.newMessage = '';
    });
  },
  beforeUnmount() {
    this.socket.off('playersInRoom');
    this.socket.off('roomEntered');
  },
  methods: {
    copyToClipboard() {
      const toast = useToast();
      navigator.clipboard.writeText(this.roomId).then(() => {
        toast.success(`${this.roomId} ${this.$t('multiPlayer.playersList.copiedToClipboard')}`);
      }).catch((err) => {
        toast.error(this.$t('multiPlayer.playersList.failToCopy') + err);
      });
    }
  }
};
</script>