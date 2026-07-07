import api from '../lib/axios';
import { CAREER_NOTES_API } from '../constants';

export const careerNotesService = {
  getAll: async () => {
    return api.get(CAREER_NOTES_API);
  },

  getBySlug: async (slug: string) => {
    return api.get(`${CAREER_NOTES_API}/${slug}`);
  },
};
