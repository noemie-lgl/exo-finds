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

declare interface CalendarEvent {
  id: string;
  name: string;
  start: Date;
  end: Date;
  color: string;
  timed: boolean;
}

export default Vue.extend({
  name: "EventDialog",
  components: { DateTimePicker },
  props: {
    showEventDialog: {
      type: Boolean,
      required: true,
    },
    selectedEvent: {
      type: Object,
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
      console.log("this event : ", this.updatedEvent);
      return this.showEventDialog;
    },
  },
  methods: {
    updateNewEventStart(date: Date) {
      this.updatedEvent.start = date;
    },
    updateNewEventEnd(date: Date) {
      this.updatedEvent.end = date;
    },
    async deleteEvent() {
      try {
        await axios.delete(
          "http://localhost:3000/events/" + this.updatedEvent.id
        );
        this.$emit("event-deleted");
        this.$emit("close-event-dialog");
      } catch (error) {
        console.error(error);
      }
    },
    async updateEvent() {
      try {
        const payload = {
          description: "test",
        }; // pas terminé
        await axios.put(
          "http://localhost:3000/events/" + this.updatedEvent.id,
          payload
        );
        this.$emit("close-event-dialog");
      } catch (error) {
        console.error(error);
      }
    },
    closeDialog() {
      this.$emit("close-event-dialog");
    },
  },
  watch: {
    selectedEvent(newValue, oldValue) {
      this.updatedEvent = newValue;
    },
  },
});
</script>
