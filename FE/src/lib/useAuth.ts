import { useContext } from 'react';
import JobContext from '../context/JobContext';

export const useAuth = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useAuth must be used within a JobProvider');
  }
  return { auth: context.auth, profile: context.profile };
};