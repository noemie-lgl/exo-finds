<template>
  <RegisterForm />
</template>

<script lang="ts">
import Vue from "vue";
import RegisterForm from "../components/RegisterForm.vue";

export default Vue.extend({
  name: "RegisterView",
  components: { RegisterForm },
});
</script>
