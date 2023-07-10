<template>
  <v-menu
    v-model="showMenu"
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
            :dateWithTime="eventMenu.startDate"
            @date-time-updated="updateNewEventStart"
          />
          <DateTimePicker
            label="Fin"
            :dateWithTime="eventMenu.endDate"
            @date-time-updated="updateNewEventEnd"
          />
          <v-text-field label="Description" v-model="eventMenu.description" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeEventMenu"> Annuler </v-btn>
        <v-btn color="primary" @click="createEvent"> Enregister </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import DateTimePicker from "../components/DateTimePicker.vue";
import type { CalendarEvent, EventEntity } from "@/models/commons";

export default Vue.extend({
  name: "CreateEventMenu",
  components: { DateTimePicker },
  props: {
    showEventMenu: {
      type: Boolean,
      required: true,
    },
    events: {
      type: Array as () => CalendarEvent[],
      required: true,
    },
    nbOfEventsInDB: {
      type: Number,
      required: true,
    },
    selectedElement: {
      validator: (value: EventTarget | null) => {
        return value === null || value instanceof EventTarget;
      },
      required: true,
    },
    currentEvent: {
      type: Object as () => CalendarEvent,
      required: true,
    },
  },
  data: function () {
    return {
      eventMenu: {
        startDate: new Date(),
        endDate: new Date(),
        summary: "",
        description: "",
      } as EventEntity,
    };
  },
  computed: {
    showMenu: {
      get() {
        return this.showEventMenu;
      },
      set(value: boolean) {
        this.$emit("set-show-even-menu", value);
      },
    },
  },
  mounted: function () {
    this.eventMenu.startDate = this.currentEvent.start;
    this.eventMenu.endDate = this.currentEvent.end;
  },
  methods: {
    // Create Event in DB + display it in calendar
    async createEvent() {
      try {
        const response = await axios.post("/events", this.eventMenu);
        const createdEvent = response.data;

        //remove fake event displayed (only when clicking on calendar)
        if (this.nbOfEventsInDB < this.events.length) {
          this.events.pop();
        }

        // display new event created
        this.events.push({
          id: createdEvent.id,
          name: createdEvent.summary,
          start: new Date(createdEvent.startDate),
          end: new Date(createdEvent.endDate),
          description: createdEvent.description,
          color: "primary",
          timed: true,
        });
        this.$emit("update-nb-of-events-in-db", this.nbOfEventsInDB + 1);
        this.resetEventMenu();
      } catch (error) {
        console.error(error);
      }
    },
    closeEventMenu() {
      if (this.nbOfEventsInDB < this.events.length) {
        this.events.pop();
      }
      this.resetEventMenu();
      this.$emit("reset-current-event");
    },
    resetEventMenu() {
      this.$emit("set-show-event-menu", false);
      this.eventMenu = {
        startDate: new Date(),
        endDate: new Date(),
        summary: "",
        description: "",
      };
      this.$emit("detach-from-selected-element");
    },
    updateNewEventStart(date: Date) {
      this.eventMenu.startDate = date;
    },
    updateNewEventEnd(date: Date) {
      this.eventMenu.endDate = date;
    },
  },
  watch: {
    currentEvent(newValue: CalendarEvent) {
      this.eventMenu.startDate = newValue.start;
      this.eventMenu.endDate = newValue.end;
    },
  },
});
</script>
