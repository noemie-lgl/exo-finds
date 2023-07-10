<template>
  <v-dialog v-model="showDialog" max-width="800" persistent>
    <v-card>
      <v-card-title> Modifier mon événement </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="Titre" v-model="updatedEvent.name" />
          <DateTimePicker
            label="Début"
            :dateWithTime="updatedEvent.start"
            @date-time-updated="updateNewEventStart"
          />
          <DateTimePicker
            label="Fin"
            :dateWithTime="updatedEvent.end"
            @date-time-updated="updateNewEventEnd"
          />
          <v-text-field
            label="Description"
            v-model="updatedEvent.description"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="deleteEvent"> Supprimer cet événement </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="closeDialog"> Annuler </v-btn>
        <v-btn color="primary" @click="updateEvent"> Enregistrer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import axios from "axios";
import Vue from "vue";
import DateTimePicker from "./DateTimePicker.vue";
import type { CalendarEvent } from "../models/commons";

// This dialog allows the user to update or delete an event selected in the calendar
export default Vue.extend({
  name: "EventDialog",
  components: { DateTimePicker },
  props: {
    showEventDialog: {
      type: Boolean,
      required: true,
    },
    selectedEvent: {
      type: Object as () => CalendarEvent,
      required: true,
    },
  },
  data: function () {
    return {
      updatedEvent: this.selectedEvent,
    };
  },
  computed: {
    showDialog() {
      return this.showEventDialog;
    },
  },
  methods: {
    // use custom event sent by child component DateTimePicker to update beginning date
    updateNewEventStart(date: Date) {
      this.updatedEvent.start = date;
    },
    // use custom event sent by child component DateTimePicker to update end date
    updateNewEventEnd(date: Date) {
      this.updatedEvent.end = date;
    },
    async deleteEvent() {
      try {
        await axios.delete("/events/" + this.updatedEvent.id);
        this.$emit("event-deleted");
        this.$emit("close-event-dialog");
      } catch (error) {
        console.error(error);
      }
    },
    async updateEvent() {
      try {
        const payload = {
          startDate: this.updatedEvent.start,
          endDate: this.updatedEvent.end,
          summary: this.updatedEvent.name,
          description: this.updatedEvent.description,
        };
        await axios.put("/events/" + this.updatedEvent.id, payload);
        this.$emit("close-event-dialog");
      } catch (error) {
        console.error(error);
      }
    },
    // notify parent component (CalendarView) that user closed the event dialog
    closeDialog() {
      this.$emit("close-event-dialog");
    },
  },
  watch: {
    selectedEvent(newValue) {
      this.updatedEvent = newValue;
    },
  },
});
</script>
