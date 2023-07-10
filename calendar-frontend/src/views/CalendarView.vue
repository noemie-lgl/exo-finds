<template>
  <v-row>
    <v-col cols="12">
      <v-toolbar flat>
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
              @click="fetchEventsOfUser(item)"
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
          <v-btn
            class="add-event-btn"
            @click="openEventMenu"
            color="primary"
          >
            Ajouter un événement
          </v-btn>
          <v-date-picker
            class="calendar-date-picker"
            v-model="picker"
            locale="fr-fr"
            no-title
          >
          </v-date-picker>
        </v-col>
        <v-col>
          <v-sheet height="800" style="margin: 5px">
            <v-calendar
              ref="calendar"
              :type="type"
              :value="selectedDate"
              :events="events"
              @click:time="handleClick"
              @click:event="openEventDialog"
              locale="fr-fr"
            ></v-calendar>
            <CreateEventMenu
              :showEventMenu="showEventMenu"
              :events="events"
              :nbOfEventsInDB="nbOfEventsInDB"
              :selectedElement="selectedElement"
              :currentEvent="currentEvent"
              @update-nb-of-events-in-db="updateNbOfEventsInDB"
              @detach-from-selected-element="selectedElement = null"
              @set-show-event-menu="setShowEventMenu"
              @reset-current-event="resetCurrentEvent"
            >
            </CreateEventMenu>
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
import CreateEventMenu from "@/components/CreateEventMenu.vue";
import type {
  CalendarEvent,
  User,
  DayTimeObject,
  EventEntity,
  CalendarEventWithDayTimeObject,
} from "../models/commons";

export default Vue.extend({
  name: "CalendarView",
  components: { DateTimePicker, EventDialog, CreateEventMenu },
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
    nbOfEventsInDB: 0,
    selectedElement: null as EventTarget | null,
    currentEvent: {
      id: "",
      name: "",
      start: new Date(),
      end: new Date(),
      description: "",
      color: "primary",
      timed: true,
    } as CalendarEvent,
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
  methods: {
    // Format month selected in date picker to display above the calendar
    selectedMonth() {
      const month = this.selectedDate.getMonth();
      return this.monthNames[month] + " " + this.selectedDate.getFullYear();
    },
    // Clear local storage and redirect to register page
    logOut() {
      this.$store.commit("user/resetState");
      this.$router.push({ path: "/" });
    },
    // Handles click depending on where the user click : on an empty slot or on an event
    handleClick(selectedSlot: DayTimeObject) {
      // the user selected an existing event, @click:event is already handling it
      if (this.showEventDialog) {
        return;
      }

      // the user clicked oustide the Event Menu while it was open
      if (this.showEventMenu) {
        this.deletePreviewEvent();
        this.resetCurrentEvent();
        this.showEventMenu = false;
        this.selectedElement = null;
        return;
      }

      // the user selected an empty slot to create a new event
      this.selectedElement = selectedSlot.nativeEvent.target; // attach menu to event selected (activator)
      const date = new Date(selectedSlot.date);
      const startDate = new Date(
        date.setHours(selectedSlot.hour, selectedSlot.minute < 30 ? 0 : 30, 0)
      );
      const endDate = new Date(date.setHours(date.getHours() + 1));
      const currentEvent = {
        id: "",
        name: "",
        start: startDate,
        end: endDate,
        description: "",
        color: "primary",
        timed: true,
      };
      this.events.push(currentEvent); // add event waiting to be filled to display a preview
      this.currentEvent = currentEvent;
      this.showEventMenu = true; // open Menu to add further informations on event (sumarry, description)
    },
    // The user clicked on the button to create an event
    openEventMenu(pointerEvent: PointerEvent) {
      this.selectedElement = pointerEvent.target;
      this.showEventMenu = true;
    },
    // retrieve all events of the user connected
    async fetchEvents() {
      try {
        const response = await axios.get("/events");
        this.events = response.data.map((event: EventEntity) => {
          return this.fromEventEntityToCalendarEvent(event, "primary");
        });
        this.nbOfEventsInDB = this.events.length;
      } catch (error) {
        console.error(error);
      }
    },
    openEventDialog(selectedEvent: CalendarEventWithDayTimeObject) {
      this.currentEvent = selectedEvent.event;
      this.showEventDialog = true;
    },
    // retrieve all users in DB
    async fetchUsers() {
      try {
        const response = await axios.get("/users");
        this.allUsers = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    // retrieve events of a selected user;
    async fetchEventsOfUser(user: User) {
      this.selectedUser = user;
      try {
        const response = await axios.get(`/events?userId=${user.id}`);
        this.events = response.data.map((event: EventEntity) => {
          return this.fromEventEntityToCalendarEvent(event, "secondary");
        });
      } catch (error) {
        console.error(error);
      }
    },
    setShowEventMenu(value: boolean) {
      this.showEventMenu = value;
    },
    updateNbOfEventsInDB(value: number) {
      this.nbOfEventsInDB = value;
    },
    fromEventEntityToCalendarEvent(
      event: EventEntity,
      color: string
    ): CalendarEvent {
      return {
        id: event.id ?? "",
        name: event.summary,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        description: event.description,
        color: color,
        timed: true,
      };
    },
    // stop displaying a preview when there is one
    deletePreviewEvent() {
      if (this.nbOfEventsInDB < this.events.length) {
        this.events.pop();
      }
    },
    resetCurrentEvent() {
      this.currentEvent = {
        id: "",
        name: "",
        start: new Date(),
        end: new Date(),
        description: "",
        color: "primary",
        timed: true,
      };
    },
  },
  watch: {
    picker(newValue) {
      this.selectedDate = new Date(newValue);
    },
  },
});
</script>
