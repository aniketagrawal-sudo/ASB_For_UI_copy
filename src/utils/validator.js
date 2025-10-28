export const validateKeyCloakRealm = () => {
  const url = import.meta.env.VITE_KEYCLOAK_SERVER_URL;
  const realm = import.meta.env.VITE_KEYCLOAK_REALM;
  const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
  if (!url || !realm || !clientId) {
    return false;
  }
  return true;
};
