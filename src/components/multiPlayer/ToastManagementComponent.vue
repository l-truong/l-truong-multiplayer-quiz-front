<template>
  <div></div>
</template>

<script>
import config from '@/config/gameConfig';
import { useToast } from 'vue-toastification';
import { scrollMixin } from '@/mixins/scrollMixin.js';

export default {
  name: 'ToastManagementComponent',
  mixins: [scrollMixin],
  props: {
    socket: Object,
  },
  data() {
    return {
     language: ''
    }
  },
  created() {
    this.language = this.$i18n.locale;
    
    const toast = useToast();
    this.socket.on('roomMessage', (message) => {
      const roomMessage = message.message[this.language];
      if (roomMessage) {
        toast(roomMessage, {
          position: this.isSmallScreen ? 'top-center' : 'top-right',
          timeout: config.toast.timeout
        });
      } else {
        toast(message.message.eng, {
          position: this.isSmallScreen ? 'top-center' : 'top-right',
          timeout: config.toast.timeout
        });
      }
    });
    this.socket.on('roomMessageSuccess', (success) => {
      const roomMessageInfo = success.message[this.language];
      if (roomMessageInfo) {
        toast.success(roomMessageInfo, {
          position: this.isSmallScreen ? 'top-center' : 'top-right',
          timeout: config.toast.timeout
        });
      } else {
        toast.success(success.message.eng, {
          position: this.isSmallScreen ? 'top-center' : 'top-right',
          timeout: config.toast.timeout
        });
      }
    });
    this.socket.on('roomMessageInfo', (info) => {
      const roomMessageInfo = info.message[this.language];
      if (roomMessageInfo) {
        toast.info(roomMessageInfo, {
          position: this.isSmallScreen ? 'top-center' : 'top-right',
          timeout: config.toast.timeout
        });
      } else {
        toast.info(info.message.eng, {
          position: this.isSmallScreen ? 'top-center' : 'top-right',
          timeout: config.toast.timeout
        });
      }
    });
    this.socket.on('roomMessageWarning', (warning) => {
      const roomMessageWarning = warning.message[this.language];
      if (roomMessageWarning) {
        toast.warning(roomMessageWarning, {
          position: this.isSmallScreen ? 'top-center' : 'top-right',
          timeout: config.toast.timeout
        });
      } else {
        toast.warning(warning.message.eng, {
          position: this.isSmallScreen ? 'top-center' : 'top-right',
          timeout: config.toast.timeout
        });
      }
    });
    this.socket.on('roomMessageError', (error) => {
      const roomMessageError = error.message[this.language];
      if (roomMessageError) {
        toast.error(roomMessageError, {
          position: this.isSmallScreen ? 'top-center' : 'top-right',
          timeout: config.toast.timeout
        });
      } else {
        toast.error(error.message.eng, {
          position: this.isSmallScreen ? 'top-center' : 'top-right',
          timeout: config.toast.timeout
        });
      }
    });
  },
  beforeUnmount() {
    this.socket.off('roomMessageSucess');
    this.socket.off('roomMessageInfo');
    this.socket.off('roomMessageWarning');
    this.socket.off('roomMessageError');
  },
  watch: {
    '$i18n.locale'(newVal, oldValue) {
      if (newVal !== oldValue) {
        this.language = newVal;
      }
    }
  }
};
</script>