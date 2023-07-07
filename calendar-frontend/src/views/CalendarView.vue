<template>
  <v-row>
    <v-col cols="12">
      <v-toolbar flat>
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
          <v-btn @click="showEventDialog = true"> Ajouter un évènement </v-btn>
          <v-date-picker v-model="picker" locale="fr-fr" no-title> </v-date-picker>
        </v-col>
        <v-col>
          <v-sheet height="600">
            <v-calendar
              ref="calendar"
              :type="type"
              :value="selectedDate"
              :events="events"
              @click:time="displayNewEvent"
              locale="fr-fr"
            ></v-calendar>
            <v-menu
              v-model="showEventDialog"
              offset-x
              :close-on-content-click="false">
              <v-card min-width="400px">
                <v-card-title>
                  Nouvel évènement
                </v-card-title>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      label="Titre"
                      v-model="eventDialog.summary"
                    />
                    <DateTimePicker label="Début" :date="selectedDate"/>
                    <DateTimePicker label="Fin" :date="selectedDate"/>
                    <v-text-field
                      label="Description"
                      v-model="eventDialog.description"
                    />
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    text
                    color="primary"
                    @click="showEventDialog = false"
                  >
                      Annuler
                  </v-btn>
                  <v-btn
                      text
                      color="primary"
                      @click="createEvent"
                  >
                      OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue"
import axios from "axios";
import DateTimePicker from "../components/DateTimePicker.vue";

declare interface CalendarEvent {
  name: string,
  start: Date,
  end: Date,
  color: string,
  timed: boolean
}

export default Vue.extend({
  name: "CalendarView",
  components: {DateTimePicker},
  data: () => ({
    showEventDialog: false,
    type: "week",
    selectedDate: new Date(),
    events: [] as CalendarEvent[],
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
    eventDialog: {
      startDate: new Date(),
      endDate: new Date(),
      summary: "",
      description: "" 
    },
    selectedSlot: {
      date: (new Date()).toISOString().substr(0, 10),
      hour: 0,
      minutes: 0
    }
  }),
  mounted: function () {
    (this.$refs.calendar as Vue & { scrollToTime: (time: string) => void }).scrollToTime("08:00");
    this.fetchEvents();
  },
  computed: {
    userName() {
      return (
        this.$store.state.user.firstName + " " + this.$store.state.user.lastName
      );
    },
  },
  methods: {
    selectedMonth() {
      const month = this.selectedDate.getMonth();
      return this.monthNames[month] + " " + this.selectedDate.getFullYear();
    },
    logOut() {
      this.$store.commit("user/resetState");
      this.$router.push({ path: "/" });
    },
    displayNewEvent(selectedSlot: any) {
      console.log("TIME : ", selectedSlot)
      this.selectedSlot = selectedSlot;
      let date = new Date(selectedSlot.date);
      const startDate = new Date(date.setHours(selectedSlot.hour, selectedSlot.minutes < 30 ? 0 : 30, 0));
      const endDate = new Date(date.setHours(date.getHours() + 1))
      const newEvent = {
        name: "",
        color: "primary",
        start: startDate,
        end: endDate,
        timed: true,
      }
      this.events.push(newEvent);
      this.openEventDialog();
    },
    openEventDialog() {
      this.showEventDialog = true;
    },
    async fetchEvents() {
      try {
        const result = await axios.get("http://localhost:3000/events")
        console.log(result);
        this.events = result.data; 
      } catch (error) {
        console.log("ERROR : ", error);
      }
    },
    async createEvent() {
      try {
        const result = await axios.post("http://localhost:3000/events", this.eventDialog);
        const newEvent = result.data;
        this.events.push({
          name: newEvent.summary,
          start: newEvent.start,
          end: newEvent.end,
          color: "primary",
          timed: true
        });
        this.showEventDialog = false;
      } catch (error) {
        console.log("ERROR : ", error);
      }
    }
  },
  watch: {
    picker(newValue, olValue) {
      this.selectedDate = new Date(newValue);
    },
  },
});
</script>
