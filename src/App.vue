<template>
  <Navigation></Navigation>
  <!-- <ScheduleTableSubmit></ScheduleTableSubmit> -->
  <router-view></router-view>
</template>

<style>

</style>

<script lang="ts" setup>
import Navigation from './components/Navigation.vue';
import ScheduleTableSubmit from './views/ScheduleTableSubmit.vue';
</script>