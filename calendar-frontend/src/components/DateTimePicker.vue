<template>
  <v-row>
    <v-col cols="8">
      <v-menu
        ref="menu"
        v-model="showMenu"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="selectedDate"
            :label="label"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="selectedDate" no-title scrollable>
        </v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="2">
      <v-select :items="hours" v-model="selectedHour"> </v-select>
    </v-col>
    <v-col cols="2">
      <v-select :items="minutes" v-model="selectedMinute"> </v-select>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import type { PropType } from "vue";

// This component allows the user to select a date and a time
export default Vue.extend({
  name: "DateTimePicker",
  props: {
    label: {
      type: String,
      required: true,
    },
    dateWithTime: {
      type: Date as PropType<Date>,
      required: true,
    },
  },
  data: function () {
    return {
      showMenu: false,
      hours: Array.from({ length: 24 }, (v, i) =>
        i >= 10 ? i.toString() : "0" + i.toString()
      ),
      minutes: ["00", "15", "30", "45"],
      selectedDate: new Date().toISOString().substr(0, 10),
      selectedHour: "09",
      selectedMinute: "00",
    };
  },
  mounted: function () {
    this.selectedDate = this.dateWithTime.toISOString().substr(0, 10);
    this.selectedHour = this.formatHour(this.dateWithTime);
    this.selectedMinute = this.formatMinute(this.dateWithTime);
  },
  methods: {
    // return hour as a 2-characters string
    formatHour(dateWithTime: Date) {
      return dateWithTime.getHours() >= 10
        ? dateWithTime.getHours().toString()
        : "0" + dateWithTime.getHours().toString();
    },
    // return minutes as a 2-characters string
    formatMinute(dateWithTime: Date) {
      const minutes =
        dateWithTime.getMinutes() == 0
          ? "00"
          : dateWithTime.getMinutes().toString();
      if (this.minutes.includes(minutes)) return minutes;
      else return "00";
    },
    // gather a date, an hour and minutes to return a date with time
    generateDate(date: string, hour: string, minute: string) {
      const newDate = new Date(date);
      newDate.setHours(parseInt(hour));
      newDate.setMinutes(parseInt(minute));
      return newDate;
    },
  },
  watch: {
    // watch when dateWithTime changes in parent component
    dateWithTime(newValue: Date) {
      this.selectedDate = new Date(newValue).toISOString().substr(0, 10);
      this.selectedHour = this.formatHour(newValue);
      this.selectedMinute = this.formatMinute(newValue);
    },
    // notify parent component when the date selected changes
    selectedDate(newValue: string) {
      const date = this.generateDate(
        newValue,
        this.selectedHour,
        this.selectedMinute
      );
      this.$emit("date-time-updated", date);
    },
    // notify parent component when the hour selected changes
    selectedHour(newValue: string) {
      const date = this.generateDate(
        this.selectedDate,
        newValue,
        this.selectedMinute
      );
      this.$emit("date-time-updated", date);
    },
    // notify parent component when the minute selected changes
    selectedMinute(newValue: string) {
      const date = this.generateDate(
        this.selectedDate,
        this.selectedHour,
        newValue
      );
      this.$emit("date-time-updated", date);
    },
  },
});
</script>
