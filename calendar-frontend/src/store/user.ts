import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    firstName: "",
    lastName: "",
  }),
  mutations: {
    setUser(state: any, user: any) {
      // déclarer les types
      state.firstName = user.firstName;
      state.lastName = user.lastName;
    },
    setAccessToken(state: any, accessToken: any) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
    },
    resetState(state: any) {
      state.firstName = "";
      state.lastName = "";
      delete axios.defaults.headers.common["Authorization"];
    },
  },
};
