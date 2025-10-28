import { useSelector } from 'react-redux';

export const useAuthUser = () => {
  const auth = useSelector((state) => state.auth);

  return {
    userId: auth.user?.id || auth.user?.sub || '',
    username: auth.user?.username || auth.user?.preferred_username || '',
    isAuthenticated: !!auth.user,
    user: auth.user || {},
  };
};
