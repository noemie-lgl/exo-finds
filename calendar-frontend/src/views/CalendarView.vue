<template>
  <v-row>
    <v-col cols="12">
      <v-toolbar flat>
        <!--<v-toolbar-title>
          <v-icon>
            mdi-weather-sunny
          </v-icon>
          {{ "Bonjour " + userName }}
        </v-toolbar-title>-->
        <v-spacer></v-spacer>
        <v-toolbar-title>
          {{ selectedMonth() }}
        </v-toolbar-title>
        <v-spacer> </v-spacer>
        <v-menu>
          <template v-slot:activator="{ on }">
            <v-btn text color="primary" v-on="on">
              Voir les événements d'autres utilisateurs
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in allUsers"
              :key="item.id"
              :value="item.id"
              @click="selectUser(item)"
            >
              <v-list-item-title>{{
                item.firstName + " " + item.lastName
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn @click="logOut"> Déconnexion </v-btn>
      </v-toolbar>
      <v-row>
        <v-col cols="2" class="text-center">
          <v-alert v-if="selectedUser.firstName" type="info" color="secondary">
            Vous voyez les événements de
            {{ selectedUser.firstName + " " + selectedUser.lastName }}
          </v-alert>
          <v-btn @click="showEventMenu = true" color="primary"> Ajouter un événement </v-btn>
          <v-date-picker v-model="picker" locale="fr-fr" no-title>
          </v-date-picker>
        </v-col>
        <v-col>
          <v-sheet height="800" style="margin: 5px">
            <v-calendar
              ref="calendar"
              :type="type"
              :value="selectedDate"
              :events="events"
              @click:time="handleEvent"
              @click:event="openEventDialog"
              locale="fr-fr"
            ></v-calendar>
            <v-menu
              v-model="showEventMenu"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
            >
              <v-card min-width="200px">
                <v-card-title> Nouvel événement </v-card-title>
                <v-card-text>
                  <v-form>
                    <v-text-field label="Titre" v-model="eventMenu.summary" />
                    <DateTimePicker
                      label="Début"
                      :dateWithTime="currentEvent.start"
                      @date-time-updated="updateNewEventStart"
                    />
                    <DateTimePicker
                      label="Fin"
                      :dateWithTime="currentEvent.end"
                      @date-time-updated="updateNewEventEnd"
                    />
                    <v-text-field
                      label="Description"
                      v-model="eventMenu.description"
                    />
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="closeEventMenu">
                    Annuler
                  </v-btn>
                  <v-btn color="primary" @click="createEvent"> Enregister </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
            <EventDialog
              :showEventDialog="showEventDialog"
              :selectedEvent="currentEvent"
              @close-event-dialog="showEventDialog = false"
              @event-deleted="fetchEvents"
            ></EventDialog>
          </v-sheet>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import DateTimePicker from "../components/DateTimePicker.vue";
import EventDialog from "../components/EventDialog.vue";
import type { CalendarEvent, User, DayTimeObject } from "../models/commons";

export default Vue.extend({
  name: "CalendarView",
  components: { DateTimePicker, EventDialog },
  data: () => ({
    showEventMenu: false,
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
    eventMenu: {
      startDate: new Date(),
      endDate: new Date(),
      summary: "",
      description: "",
    },
    selectedSlot: {
      date: new Date().toISOString().substr(0, 10),
      hour: 0,
      minute: 0,
    },
    nbOfEventsInDB: 0,
    selectedElement: null as EventTarget | null,
    currentEvent: {
      id: "",
      name: "",
      start: new Date(),
      end: new Date(),
      color: "primary",
      timed: true,
    },
    showEventDialog: false,
    allUsers: [] as User[],
    selectedUser: {} as User,
  }),
  mounted: function () {
    (
      this.$refs.calendar as Vue & { scrollToTime: (time: string) => void }
    ).scrollToTime("08:00");
    this.fetchEvents();
    this.fetchUsers();
  },
  computed: {
    userName() {
      return window.localStorage.getItem("username");
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
    handleEvent(selectedSlot: DayTimeObject) {
      console.log("HANDLE EVENT : ", selectedSlot);
      // the user clicked oustide the Event Menu while it was open
      if (this.showEventMenu) {
        if (this.nbOfEventsInDB < this.events.length) {
          this.events.pop();
          this.currentEvent = {
            id: "",
            name: "",
            start: new Date(),
            end: new Date(),
            color: "primary",
            timed: true,
          };
        }
        this.showEventMenu = false;
        this.selectedElement = null;
        return;
      }

      // the user selected an existing event
      if (
        selectedSlot.nativeEvent?.target &&
        selectedSlot.nativeEvent?.target instanceof HTMLElement &&
        Array.from(selectedSlot.nativeEvent?.target.classList).find(
          (item: string) => item.startsWith("v-event")
        )
      ) {
        return;

        // the user selected an intervall to create a new event
      } else {
        this.selectedElement = selectedSlot.nativeEvent.target;
        if (this.nbOfEventsInDB < this.events.length) {
          this.events.pop();
          this.currentEvent = {
            id: "",
            name: "",
            start: new Date(),
            end: new Date(),
            color: "primary",
            timed: true,
          };
        }
        this.selectedSlot = selectedSlot;
        let date = new Date(selectedSlot.date);
        const startDate = new Date(
          date.setHours(selectedSlot.hour, selectedSlot.minute < 30 ? 0 : 30, 0)
        );
        const endDate = new Date(date.setHours(date.getHours() + 1));
        const currentEvent = {
          id: "",
          name: "",
          color: "primary",
          start: startDate,
          end: endDate,
          timed: true,
        };
        this.events.push(currentEvent);
        this.currentEvent = currentEvent;
        this.openEventMenu();
      }
    },
    openEventMenu() {
      this.showEventMenu = true;
    },
    async fetchEvents() {
      try {
        const result = await axios.get("http://localhost:3000/events");
        this.events = result.data.map((event: any) => {
          return {
            id: event.id,
            name: event.summary,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
            color: "primary",
            timed: true,
          };
        });
        this.nbOfEventsInDB = this.events.length;
      } catch (error) {
        console.error(error);
      }
    },
    async createEvent() {
      try {
        this.eventMenu.startDate = this.currentEvent.start;
        this.eventMenu.endDate = this.currentEvent.end;
        const result = await axios.post(
          "http://localhost:3000/events",
          this.eventMenu
        );
        const currentEvent = result.data;
        if (this.nbOfEventsInDB < this.events.length) {
          this.events.pop(); // remove fake event to display // marche que si on a pas cliqué sur le bouton créer un événement
        }
        this.events.push({
          id: currentEvent.id,
          name: currentEvent.summary,
          start: new Date(currentEvent.startDate),
          end: new Date(currentEvent.endDate),
          color: "primary",
          timed: true,
        });
        this.nbOfEventsInDB += 1;
        this.showEventMenu = false;
        this.selectedElement = null;
        this.eventMenu = {
          startDate: new Date(),
          endDate: new Date(),
          summary: "",
          description: "",
        };
      } catch (error) {
        console.error(error);
      }
    },
    onClickOutside() {
      console.log("onClickOutside");
      this.showEventMenu = false;
      this.selectedElement = null;
      this.eventMenu = {
        startDate: new Date(),
        endDate: new Date(),
        summary: "",
        description: "",
      };
      if (this.nbOfEventsInDB < this.events.length) {
        this.events.pop();
      }
      console.log("EVENTS : ", this.events);
    },
    closeEventMenu() {
      this.showEventMenu = false;
      this.eventMenu = {
        startDate: new Date(),
        endDate: new Date(),
        summary: "",
        description: "",
      };
      if (this.nbOfEventsInDB < this.events.length) {
        this.events.pop();
      }
    },
    updateNewEventStart(date: Date) {
      this.currentEvent.start = date;
    },
    updateNewEventEnd(date: Date) {
      this.currentEvent.end = date;
    },
    openEventDialog(selectedEvent: any) {
      console.log("event in dialog : ", event);
      this.currentEvent = selectedEvent.event;
      this.showEventDialog = true;
    },
    async fetchUsers() {
      try {
        const result = await axios.get("http://localhost:3000/users");
        this.allUsers = result.data;
      } catch (error) {
        console.error(error);
      }
    },
    selectUser(user: User) {
      this.selectedUser = user;
      this.fetchEventsForUser(user.id);
    },
    async fetchEventsForUser(userId: string) {
      try {
        const result = await axios.get(
          "http://localhost:3000/events?userId=" + userId
        );
        this.events = result.data.map((event: any) => {
          return {
            id: event.id,
            name: event.summary,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
            color: "secondary",
            timed: true,
          };
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
  watch: {
    picker(newValue, olValue) {
      this.selectedDate = new Date(newValue);
    },
  },
});
</script>
