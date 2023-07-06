<template>
  <v-row>
    <v-col cols="12">
      <v-toolbar flat>
        <!--<v-btn>
                    Aujourd'hui
                </v-btn>
                <v-icon>
                    mdi-chevron-left
                </v-icon>
                <v-icon>
                    mdi-chevron-right
                </v-icon>-->
        <v-toolbar-title>
          {{ "Bonjour " + userName }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title>
          {{ selectedMonth() }}
        </v-toolbar-title>
        <v-spacer> </v-spacer>
        <v-btn @click="logOut"> Déconnexion </v-btn>
      </v-toolbar>
      <v-row>
        <v-col cols="2">
          <v-btn> Ajouter un évènement </v-btn>
          <v-date-picker v-model="picker" locale="fr-fr"> </v-date-picker>
        </v-col>
        <v-col>
          <v-sheet>
            <v-calendar
              ref="calendar"
              :type="type"
              :value="selectedDate"
              locale="fr-fr"
            ></v-calendar>
          </v-sheet>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import axios from "axios";

export default {
  name: "CalendarView",
  components: {},
  data: () => ({
    menuOpen: true,
    type: "week",
    selectedDate: new Date(),
    picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    monthNames: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
  }),
  computed: {
    userName() {
      return (
        this.$store.state.user.firstName + " " + this.$store.state.user.lastName
      );
    },
  },
  methods: {
    toggleDrawer() {
      this.menuOpen = !this.menuOpen;
    },
    selectedMonth() {
      const month = this.selectedDate.getMonth();
      return this.monthNames[month] + " " + this.selectedDate.getFullYear();
    },
    logOut() {
      // empty user from store
      // remove access token from anywhere
      // go back to first page
    },
  },
  watch: {
    picker(newValue, olValue) {
      this.selectedDate = new Date(newValue);
    },
  },
};
</script>
