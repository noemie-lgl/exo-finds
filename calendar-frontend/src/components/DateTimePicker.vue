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
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="showMenu = false">
            Annuler
          </v-btn>
          <v-btn text color="primary" @click="saveDate"> OK </v-btn>
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

export default Vue.extend({
  name: "DateTimePicker",
  props: {
    label: {
      type: String,
      required: true,
    },
    dateWithTime: {
      type: Date,
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
    this.selectedDate = new Date(this.dateWithTime).toISOString().substr(0, 10);
    this.selectedHour =
      new Date(this.dateWithTime).getHours() >= 10
        ? new Date(this.dateWithTime).getHours().toString()
        : "0" + new Date(this.dateWithTime).getHours().toString();
    this.selectedMinute =
      new Date(this.dateWithTime).getMinutes() == 0
        ? "00"
        : new Date(this.dateWithTime).getMinutes().toString();
  },
  methods: {
    saveDate() {
      console.log(this.hours);
    },
    generateDate(date: string, hour: string, minute: string) {
      let newDate = new Date(date);
      newDate.setHours(parseInt(hour));
      newDate.setMinutes(parseInt(minute));
      return newDate;
    },
  },
  watch: {
    dateWithTime(newValue: Date, olValue: Date) {
      this.selectedDate = newValue.toISOString().substr(0, 10);
      this.selectedHour =
        new Date(newValue).getHours() >= 10
          ? new Date(newValue).getHours().toString()
          : "0" + new Date(newValue).getHours().toString();
      this.selectedMinute =
        new Date(newValue).getMinutes() == 0
          ? "00"
          : new Date(newValue).getMinutes().toString();
    },
    selectedDate(newValue, olValue) {
      const date = this.generateDate(
        newValue,
        this.selectedHour,
        this.selectedMinute
      );
      this.$emit("date-time-updated", date);
    },
    selectedHour(newValue, olValue) {
      const date = this.generateDate(
        this.selectedDate,
        newValue,
        this.selectedMinute
      );
      this.$emit("date-time-updated", date);
    },
    selectedMinute(newValue, olValue) {
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
