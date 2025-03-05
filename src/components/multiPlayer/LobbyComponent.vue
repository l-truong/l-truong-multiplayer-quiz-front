<template>
  <div class='d-flex justify-content-center align-items-center lobby'> 
    <div class='col-10 col-lg-4 p-3'>
      <div>
        <div class='display-3 pb-3'>{{ $t('multiPlayer.lobby.welcomeMessage') }}</div>
        <form>
          <div class='pb-3'>
            <label for='username' class='form-label'>
              {{ $t('multiPlayer.lobby.username') }}
            </label>
            <div>
              <input
                type='text'
                id='name'
                v-model='username'
                :maxlength='config.lobbyParameters.usernameMaxLength'
                :placeholder='$t("multiPlayer.lobby.usernamePlaceholder")'
                :class='{"is-invalid": usernameError}'
                class='form-control'
              />
              <div v-if='usernameError' class='invalid-feedback'>
                {{ this.$t('multiPlayer.lobby.requiredField') }}
              </div>
              <div v-if='usernameHasSpecialCharacters' class='invalid-feedback'>
                {{ this.$t('multiPlayer.lobby.usernameHasSpecialCharacters') }}
              </div>
            </div>
          </div>

          <div class='pb-3'>
            <div>
              <label for='room' class='form-label'>
                {{ $t('multiPlayer.lobby.room') }}
              </label>
              <select 
                id='room'
                name='room'
                class='form-select'
                v-model='room'
              >
                <option :value='ROOM_VALUE.JOIN_ROOM'>
                  {{ $t('multiPlayer.lobby.join') }}
                </option>
                <option :value='ROOM_VALUE.CREATE_ROOM'>
                  {{ $t('multiPlayer.lobby.create') }}
                </option>
              </select>
            </div>
            <div v-if='room == ROOM_VALUE.JOIN_ROOM'>
              <label for='roomId' class='form-label'>
                {{ $t('multiPlayer.lobby.roomId') }}
              </label>
              <div>
                <input
                  type='text'
                  id='roomId'
                  :maxlength='config.lobbyParameters.roomIdMaxLength'
                  class='form-control'
                  v-model='roomId'
                  :placeholder='$t("multiPlayer.lobby.roomIdPlaceholder")'
                  :class='{"is-invalid": roomError}'
                />
                <div v-if='roomError' class='invalid-feedback'>
                  {{ this.$t('multiPlayer.lobby.requiredField') }}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class='d-flex justify-content-between'>
        <button 
          type='button'
          class='btn btn-secondary'
          @click='goToHome'
        >
          <i class='fa-solid fa-caret-left'></i> {{ $t('singlePlayer.categories.return') }}
        </button>
        <button
          v-if='room == ROOM_VALUE.CREATE_ROOM'
          type='button'
          class='btn btn-primary'
          @click='createRoom'
        >
          {{ $t('multiPlayer.lobby.createRoom') }} <i class='fa-solid fa-caret-right'></i>
        </button>
        <button
          v-if='room == ROOM_VALUE.JOIN_ROOM'
          type='button'
          class='btn btn-primary'
          @click='joinRoom'
        >
          {{ $t('multiPlayer.lobby.joinRoom') }} <i class='fa-solid fa-caret-right'></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config/gameConfig';
import { navigationMixin } from '@/mixins/navigationMixin.js';

export default {
  name: 'LobbyComponent',
  mixins: [navigationMixin],
  props: {
    socket: Object,
  },
  data() {
    return {
      config: config,
      ROOM_VALUE: {
        CREATE_ROOM: 'create',
        JOIN_ROOM: 'join',
      },
      room: '',
      roomId: '',
      roomError: '',
      username: '',
      usernameError: '',
      usernameHasSpecialCharacters: '',
    }
  },
  created() {
    this.room = this.ROOM_VALUE.JOIN_ROOM;
  },
  beforeUnmount() {
    this.socket.off('roomEntered');
  },
  methods: {
    handleRoomEvents() {
      this.socket.on('roomEntered', (data) => {
        this.roomId = data.roomId;
        this.$emit('roomCreation', {
          roomId: this.roomId,
          isAdmin: data.isAdmin,
        });
      });
    },
    createRoom() {
      if (this.validateUsername()) {
        let cleanedUsername = this.username.trim().replace(/\s+/g, ' ');
        this.socket.emit('createRoom', { 
          username: cleanedUsername
        });
        this.handleRoomEvents();
      }
    },
    joinRoom() {
      if (this.validateUsername() && this.validateRoom()) {
        let cleanedUsername = this.username.trim().replace(/\s+/g, ' ');
        this.socket.emit('joinRoom', {
          roomId: this.roomId,
          username: cleanedUsername,
        });
        this.handleRoomEvents();
      }
    },
    validateUsername() {
      const invalidCharsPattern = /[^a-zA-Z0-9-_]/;
      if (!this.username.trim()) {
        this.usernameError = true;
        return false;
      }
      if (invalidCharsPattern.test(this.username)) {
        this.usernameHasSpecialCharacters = true;
        return false;
      }

      this.usernameError = false;
      this.usernameHasSpecialCharacters = false;
      return true;
    },
    validateRoom() {
      if (!this.roomId.trim()) {
        this.roomError = true;
        return false;
      }
      this.roomError = false;
      return true;
    }
  },  
  watch: {
    username(newVal) {
      this.username = newVal.trim();
    },
    roomId(newVal) {
      this.roomId = newVal.trim();
    }
  }
};
</script>