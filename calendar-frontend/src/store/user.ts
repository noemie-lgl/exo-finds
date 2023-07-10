import axios from "axios";
import type { RootState } from "@/models/commons";

export default {
  namespaced: true,
  state: (): RootState => ({
    username: "",
  }),
  mutations: {
    // Store username in state and local storage
    setUser(state: RootState, username: string) {
      state.username = username;
      window.localStorage.setItem("username", username);
    },
    // Store access token in local storage + set as bearer token for all following axios requests
    setAccessToken(state: RootState, accessToken: string) {
      window.localStorage.setItem("acces_token", accessToken);
      axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
    },
    // Clear state, axios bearer token and local storage
    resetState(state: RootState) {
      state.username = "";
      delete axios.defaults.headers.common["Authorization"];
      window.localStorage.removeItem("acces_token");
      window.localStorage.removeItem("username");
    },
  },
};
