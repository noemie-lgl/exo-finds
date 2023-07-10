<template>
  <v-row
    align="center"
    justify="center"
    style="height: 100vh"
    class="background-image"
  >
    <v-col cols="12" lg="6" md="6">
      <v-card>
        <v-card-title> Je m'identifie : </v-card-title>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="Username"
                  v-model="username"
                  :rules="[required]"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Mot de passe"
                  v-model="password"
                  :rules="[required]"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="logIn" :loading="loading"> Me connecter </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  name: "LogInForm",
  data: function () {
    return {
      loading: false,
      username: "",
      password: "",
      required: (value: string) => !!value || "Cette information est requise",
    };
  },
  methods: {
    async logIn() {
      this.loading = true;
      try {
        const payload = {
          username: this.username,
          password: this.password,
        };

        const auth = await axios.post(
          "http://localhost:3000/auth/login",
          payload
        );

        this.$store.commit("user/setUser", this.username);
        this.$store.commit("user/setAccessToken", auth.data.access_token);
        this.$router.push({ path: "/calendar" });

        console.log("WE ARE authenticated : ", auth);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
