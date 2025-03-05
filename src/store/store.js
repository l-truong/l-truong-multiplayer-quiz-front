import { reactive } from 'vue';
import config from '@/config/gameConfig';

const categoriesState = reactive([]);
const questionsState = reactive([]);
const statsState = reactive([]);
const timestampState = reactive({ value: 0 });
const answersState = reactive([]);
const categoriesParametersState = {
  choosenNbQuestions: config.categoriesParameters.defaultNbQuestions,
  choosenCategory: [],
  choosenTimer: config.categoriesParameters.defaultTimer,
};
const pageSinglePlayerStepState = reactive({ value: 0 });
const pageMultiPlayerStepState = reactive({ value: 0 });

const setCategories = (categories) => {
  categoriesState.length = 0;
  categoriesState.push(...categories);
};

const setQuestions = (questions) => {
  questionsState.length = 0;
  questionsState.push(...questions);
};

const setStats = (stats) => {
  statsState.length = 0;
  statsState.push(...stats);
};

const setTimer = (timestamp) => {
  timestampState.value = timestamp;
};

const setAnswers = (answers) => {
  answersState.length = 0;
  answersState.push(...answers);
};

const setCategoriesParameters = (choosenNbQuestions, choosenCategory, choosenTimer) => {
  categoriesParametersState.choosenNbQuestions = choosenNbQuestions;
  categoriesParametersState.choosenCategory = choosenCategory;
  categoriesParametersState.choosenTimer = choosenTimer;
};

const setSinglePlayerPageStep = (pageSinglePlayerStep) => {
  pageSinglePlayerStepState.value = pageSinglePlayerStep;
};

const setMultiPlayerPageStep = (pageMultiPlayerStep) => {
  pageMultiPlayerStepState.value = pageMultiPlayerStep;
};

export {
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
};