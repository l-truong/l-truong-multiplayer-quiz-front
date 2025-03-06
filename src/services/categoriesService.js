import axios from '@/axios';

export const categoriesService = {
  async getCategories(language = '') {
    const endpoint = language ? `/categories/${language}` : '/categories';
    try {
      const res = await axios.get(endpoint);
      return res.data;
    } catch (err) {
      console.error('error:', err);
      return false;
    }
  },
  async getEnglishCategories() {
    return await this.getCategories('eng');
  },  
  async getFrenchCategories() {
    return await this.getCategories('fr');
  },  
  async getCategoryById(id) {
    try {
      const res = await axios.get(`/categories/${id}`);
      return res.data;
    } catch (err) {
      console.error('Error:', err);
      return false;
    }
  }  
};
