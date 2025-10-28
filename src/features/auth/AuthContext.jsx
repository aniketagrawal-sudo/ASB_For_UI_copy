import React, { useContext } from 'react';

export const AuthContext = React.createContext({});

export const useAuthContext = () => {
  return useContext(AuthContext);
};
