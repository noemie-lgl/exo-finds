<template>
  <v-row align="center" justify="center" style="height: 100vh">
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
            <v-text-field
              label="Mot de passe"
              v-model="user.password"
              :rules="[required]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
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

export default Vue.extend({
  name: "RegisterForm",
  data: () => ({
    user: {
      firstName: "",
      lastName: "",
      password: "",
    },
    loading: false,
    required: (value: string) => !!value || "Obligatoire.",
  }),
  methods: {
    async register() {
      this.loading = true;
      try {
        const newUser = await axios.post(
          "http://localhost:3000/users",
          this.user
        );

        const payload = {
          id: newUser.data.id,
          password: this.user.password,
        };

        const auth = await axios.post(
          "http://localhost:3000/auth/login",
          payload
        );

        this.$store.commit("user/setUser", newUser.data);
        this.$store.commit("user/setAccessToken", auth.data.access_token);
        this.$router.push({ path: "/calendar" });

        console.log("WE ARE authenticated : ", auth);
      } catch (error) {
        console.log("[RegisterForm/register] ERROR axios post : ", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
