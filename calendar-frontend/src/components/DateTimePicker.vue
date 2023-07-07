<template>
    <v-row>
        <v-col cols="8">
            <v-menu
                ref="menu"
                v-model="showMenu"
                :close-on-content-click="false"
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
                <v-date-picker
                v-model="selectedDate"
                no-title
                scrollable
                >
                <v-spacer></v-spacer>
                <v-btn
                    text
                    color="primary"
                    @click="showMenu = false"
                >
                    Annuler
                </v-btn>
                <v-btn
                    text
                    color="primary"
                    @click="saveDate"
                >
                    OK
                </v-btn>
                </v-date-picker>
            </v-menu>
        </v-col>
        <v-col cols="2">
            <v-select :items="hours">
            </v-select>
        </v-col>
        <v-col cols="2">
            <v-select :items="minutes">
            </v-select>
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
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
},
data: function () {
    return {
        showMenu: false,
        selectedDate: (new Date(this.date)).toISOString().substr(0, 10),
        hours: Array.from({ length: 24}, (v, i) => i >= 10 ? i.toString() : "0" + i.toString()),
        minutes: ["00","15","30","45"],
        selectedHour: "",
        selectedMinute: ""
    }
},
methods: {
    saveDate() {
        console.log(this.hours)
    }
}
});
</script>
  