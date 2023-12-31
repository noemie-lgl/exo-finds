<template>
  <v-row
    align="center"
    justify="center"
    style="height: 100vh"
    class="background-image"
  >
    <v-col cols="12" lg="6" md="6">
      <v-card>
        <v-card-title> Bienvenue </v-card-title>
        <v-card-subtitle>
          Afin d'accéder à ce service, il est nécessaire de vous inscrire :
        </v-card-subtitle>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="Prénom"
                  v-model="user.firstName"
                  :rules="[required]"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Nom"
                  v-model="user.lastName"
                  :rules="[required]"
                />
              </v-col>
            </v-row>
            Vos identifiants de connexion :
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="Username"
                  v-model="user.username"
                  :error="usernameExists"
                  :rules="[required]"
                  :error-messages="customErrorMessage()"
                  @input="checkUsernameAvailability"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Mot de passe"
                  v-model="user.password"
                  :rules="[required]"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="redirectToLogin"> J'ai déjà un compte </v-btn>
          <v-btn @click="register" :loading="loading" color="primary">
            Créer mon compte
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

// This component allows a user to create an account
export default Vue.extend({
  name: "RegisterForm",
  data: function () {
    return {
      user: {
        username: "",
        firstName: "",
        lastName: "",
        password: "",
      },
      loading: false,
      required: (value: string) => !!value || "Cette information est requise",
      usernameExists: false,
    };
  },
  methods: {
    // create user in DB, authenticate them and keep access token then redirect to calendar view
    async register() {
      this.loading = true;
      try {
        const newUser = await axios.post("/users", this.user);

        const payload = {
          username: newUser.data.username,
          password: this.user.password,
        };

        const auth = await axios.post("/auth/login", payload);

        this.$store.commit("user/setUser", newUser.data.username);
        this.$store.commit("user/setAccessToken", auth.data.access_token);
        this.$router.push({ path: "/calendar" });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    // check if the username added in the form already exists in the DB
    async checkUsernameAvailability() {
      try {
        const response = await axios.get(
          `/users/username-exists?username=${this.user.username}`
        );
        if (response.data.id) this.usernameExists = true;
        else this.usernameExists = false;
      } catch (error) {
        console.error(error);
      }
    },
    // display custom error message when the username already exist in DB
    customErrorMessage() {
      if (this.usernameExists) {
        return ["Ce nom d'utilisateur est déjà pris"];
      }
    },
    // the user already has an account
    redirectToLogin() {
      this.$router.push({ path: "/login" });
    },
  },
});
</script>
