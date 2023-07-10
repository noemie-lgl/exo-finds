import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    firstName: "",
    lastName: "",
  }),
  mutations: {
    setUser(state: any, username: string) {
      // déclarer les types
      state.username = username;
      window.localStorage.setItem("username", username);
    },
    setAccessToken(state: any, accessToken: any) {
      window.localStorage.setItem("acces_token", accessToken);
      axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
    },
    resetState(state: any) {
      state.username = "";
      delete axios.defaults.headers.common["Authorization"];
      window.localStorage.removeItem("acces_token");
      window.localStorage.removeItem("username");
    },
  },
};
