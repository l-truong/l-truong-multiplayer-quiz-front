<template>
  <div class='bg-secondary-subtle container d-flex justify-content-center align-items-center p-0'>
    <template v-if='this.categories === null && this.stats === null'>
      <div class='d-flex justify-content-center align-items-center h-100 w-100 p-3'>
        <div class='spinner-border text-primary' role='status'></div>
      </div>
    </template>
    <template v-else-if='this.categories !== false && this.stats !== false'>
      <router-view />
    </template>
    <template v-else>
      <div class='d-flex flex-column justify-content-center align-items-center text-center h-100 w-100 p-5'>
        <div class='display-1 pb-3'><i class='fa-solid fa-person-digging'></i></div>
        <div class='display-6'>{{ $t('app.backendIssuesMessage') }}</div>
      </div>
    </template>
  </div>
  
  <div v-if='!isCategoriesPage' class='d-flex justify-content-end mt-2 mb-2 languageSelector'>
    <div class='pe-2'>
      <button v-if='isSmallScreen' class='btn btn-secondary' @click='scrollToTop'>
        <i class='fa-solid fa-chevron-up'></i>
      </button>
    </div>
    <div>
      <select v-model='$i18n.locale' @change='updateDataByLanguage' class='form-select'>
        <option v-for='language in languageOptions' :key='language' :value='language'>
          {{ $t(`app.language.${language}`) }}
        </option>
      </select>
    </div>
  </div>

  <div 
    v-if='showPopup' 
    class='position-fixed top-0 start-0 h-100 w-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50'
  >
    <div class='modal-dialog'>
      <div class='modal-content'>
        <div class='modal-header'>
          <div class='modal-title display-6'>{{ $t(`app.popup.notice`) }}</div>
          <button type='button' aria-label='Close' class='btn-close' @click='closePopup'></button>
        </div>
        <div class='modal-body'>
          <div class='pb-3'>{{ $t(`app.popup.message`) }}</div>
          <div class='d-flex align-items-center'>
            <input type='checkbox' class='form-check-input' id='dontShowAgainFor24h' v-model='dontShowAgainFor24h' />
            <div class='form-check-label ps-2' for='dontShowAgainFor24h'>
              {{ $t(`app.popup.dontShowAgain`) }}
            </div>
          </div>
        </div>
        <div class='modal-footer'>
          <button type='button' class='btn btn-primary' @click='closePopup'>{{ $t(`app.popup.gotIt`) }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config/gameConfig';
import { categoriesService } from '../src/services/categoriesService';
import { questionsService } from '../src/services/questionsService';
import { scrollMixin } from '@/mixins/scrollMixin.js';

export default {
  name: 'App',
  mixins: [scrollMixin],
  data() {
    return {
      categories: null,
      stats: null,
      showPopup: true,
      dontShowAgainFor24h: false
    };
  },
  mounted() {
    this.updateDataByLanguage();
    this.checkWindowWidth();
    window.addEventListener('resize', this.checkWindowWidth);
    this.checkPopupVisibility();
  },
  beforeMount() {
    window.removeEventListener('resize', this.checkWindowWidth);
  },
  methods: {
    async updateDataByLanguage() {
      await this.updatedCategoriesByLanguage();
      await this.updatedStatsByLanguage();
    },
    async updatedCategoriesByLanguage() {
      this.categories = await categoriesService.getCategories(this.$i18n.locale); 
      if (this.categories && this.categories !== false) {
        this.$setCategories(this.categories);
      }
    },
    async updatedStatsByLanguage() {
      this.stats = await questionsService.getStatsQuestions(this.$i18n.locale);
      if (this.stats && this.stats !== false) {
        this.$setStats(this.stats);
      }
    },
    checkPopupVisibility() {      
      const dismissedTime = localStorage.getItem(config.localStorage.sufix + config.localStorage.popupDismissedAt);
      const dontShowAgainFor24h = localStorage.getItem(config.localStorage.sufix + config.localStorage.dontShowAgainFor24h);      
      const currentTime = new Date().getTime();

      if (dontShowAgainFor24h === 'true' && dismissedTime && (currentTime - dismissedTime) < 24 * 60 * 60 * 1000) {
        this.showPopup = false;
      }
    },
    closePopup() {
      if (this.dontShowAgainFor24h) {
        localStorage.setItem(config.localStorage.sufix + config.localStorage.dontShowAgainFor24h, 'true');
        localStorage.setItem(config.localStorage.sufix + config.localStorage.popupDismissedAt, new Date().getTime().toString());
      } else {
        localStorage.removeItem(config.localStorage.sufix + config.localStorage.dontShowAgainFor24h);
        localStorage.removeItem(config.localStorage.sufix + config.localStorage.popupDismissedAt);
      }
      this.showPopup = false;
    }
  },
  computed: {
    isCategoriesPage() {
      return this.$pageSinglePlayerStep.value === 1 || this.$pageMultiPlayerStep.value === 2;
    },
    languageOptions() {
      const messages = this.$i18n.messages;
      return Object.keys(messages);
    },
  },
  watch: {
    '$i18n.locale'(newVal, oldValue) {
      if (newVal !== oldValue) {
        localStorage.setItem(config.localStorage.sufix + config.localStorage.localLanguage, newVal);
      }
    }
  }
};
</script>