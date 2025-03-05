<template>
  <div class='d-flex flex-column flex-grow-1'>
    <div class='flex-grow-1 overflow-auto border mb-3 chatbox' ref='chatbox'>
      <div v-for='(message, index) in chatMessages' :key='index'>
        <div class='p-2' v-html='message'>
        </div>
      </div>
    </div>

    <div class='input-group'>
      <input
        type='text'
        class='form-control'
        v-model='newMessage'
        :maxlength='config.categoriesParameters.chatMessagesMaxLength'
        :placeholder='$t("multiPlayer.chat.messagePlaceholder")'
        :disabled='!roomId'
        @keyup.enter='sendMessage'
      />
      <button
        class='btn btn-primary'
        @click='sendMessage'
        :disabled='!newMessage.trim() || !roomId'
      >
        <i class='fa-solid fa-paper-plane'></i>
      </button>
    </div>

    <div class='d-flex justify-content-end text-muted'>
      <div>{{ newMessage.length }} / {{ config.categoriesParameters.chatMessagesMaxLength }}</div>
    </div>
  </div>
</template>

<script>
import config from '@/config/gameConfig';

export default {
  name: 'ChatComponent',
  props: {
    socket: Object,
    roomId: String,
  },
  data() {
    return {
      config: config,
      language: '',
      chatHistory: [],
      chatMessages: [],
      newMessage: ''
    }
  },
  created() {
    this.language = this.$i18n.locale;

    this.socket.on('roomEntered', () => {
      this.newMessage = '';
    });
    this.socket.on('chatUpdate', (chatHistory) => {
      this.chatHistory = chatHistory;
      this.chatMessages = this.chatHistory.map(item => {
        if (typeof item === 'object') {
          return item[this.language] || Object.keys(item)[0];
        }
        return item;
      });

      this.scrollToBottom();
    });
  },
  beforeUnmount() {
    this.socket.off('roomEntered');
    this.socket.off('chatUpdate');
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== '') {
        this.socket.emit('sendMessage', this.roomId, this.newMessage);
        this.newMessage = '';
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatbox = this.$refs.chatbox;
        chatbox.scrollTop = chatbox.scrollHeight; 
      });
    }
  },
  watch: {
    '$i18n.locale'(newVal, oldValue) {
      if (newVal !== oldValue) {
        this.language = newVal;
        this.chatMessages = this.chatHistory.map(item => {
          if (typeof item === 'object') {
            return item[this.language] || Object.keys(item)[0];
          }
          return item;
        });
      }
    }
  }
};
</script>