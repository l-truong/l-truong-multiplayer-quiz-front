import axios from '@/axios';

export const questionsService = {
  async getQuestions(language = '', categories = []) {
    try {
      let endpoint = language ? `/questions/${language}` : '/questions';
      const params = categories.length > 0 ? { categories: categories } : {};
      const res = await axios.get(endpoint, { params });
      return res.data;
    } catch (err) {
      console.error('error:', err);
      return false;
    }
  },  
  async getEnglishQuestions(categories = []) {
    return await this.getQuestions('eng', categories);
  },  
  async getFrenchQuestions(categories = []) {
    return await this.getQuestions('fr', categories);
  },  
  async getRandomQuestions(count, categories = []) {
    if (!count || count <= 0 || isNaN(count)) {
      console.error('Error: Invalid count value. Please provide a positive number.');
      return false;
    }  
    try {
      const params = categories.length > 0 ? { params: { categories: categories } } : {};
      const res = await axios.get(`/questions/random/${count}`, params);
      return res.data;
    } catch (err) {
      console.error('Error:', err);
      return false;
    }
  },  
  async getQuestionById(id) {
    try {
      const res = await axios.get(`/questions/${id}`);
      return res.data;
    } catch (err) {
      console.error('Error:', err);
      return false;
    }
  },  
  async getStatsQuestions(language = '') {
    try {
      const endpoint = language ? `/questions/stats/${language}` : '/questions/stats';
      const res = await axios.get(endpoint);
      return res.data;
    } catch (err) {
      console.error('error:', err);
      return false;
    }
  }  
};
