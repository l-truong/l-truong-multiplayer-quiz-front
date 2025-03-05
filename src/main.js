import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import i18n from '@/i18n';
import {
  categoriesState,
  questionsState,
  statsState,
  timestampState,
  answersState,
  categoriesParametersState,
  pageSinglePlayerStepState,
  pageMultiPlayerStepState,
  setCategories,
  setQuestions,
  setStats,
  setTimer,
  setAnswers,
  setCategoriesParameters,
  setSinglePlayerPageStep,
  setMultiPlayerPageStep,
} from '@/store/store';
import '@/assets/styles/_reset.css';
import '@/assets/styles/_normalize.scss';
import '@/assets/styles/bootstrap.min.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.css';
import '@/assets/styles/main.scss';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import config from '@/config/gameConfig';

const app = createApp(App);
app.use(router);
app.use(i18n);
app.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: config.toast.maxToasts,
  newestOnTop: config.toast.newestOnTop,
});

app.config.globalProperties.$categories = categoriesState;
app.config.globalProperties.$questions = questionsState;
app.config.globalProperties.$stats = statsState;
app.config.globalProperties.$timestamp = timestampState;
app.config.globalProperties.$answers = answersState;
app.config.globalProperties.$categoriesParameters = categoriesParametersState;
app.config.globalProperties.$pageSinglePlayerStep = pageSinglePlayerStepState;
app.config.globalProperties.$pageMultiPlayerStep = pageMultiPlayerStepState;

app.config.globalProperties.$setCategories = setCategories;
app.config.globalProperties.$setQuestions = setQuestions;
app.config.globalProperties.$setStats = setStats;
app.config.globalProperties.$setTimer = setTimer;
app.config.globalProperties.$setAnswers = setAnswers;
app.config.globalProperties.$setCategoriesParameters = setCategoriesParameters;
app.config.globalProperties.$setSinglePlayerPageStep = setSinglePlayerPageStep;
app.config.globalProperties.$setMultiPlayerPageStep = setMultiPlayerPageStep;

app.mount('#app');