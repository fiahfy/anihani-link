<template>
  <v-container fill-height pa-0>
    <swiper :options="swiperOptions">
      <swiper-slide v-for="id of slides" :key="id">
        <daily-calendar />
      </swiper-slide>
    </swiper>
  </v-container>
</template>

<script>
import DailyCalendar from '~/components/DailyCalendar.vue'

export default {
  components: {
    DailyCalendar
  },
  data() {
    const slides = [0, 1, 2, 3, 4, 5, 6]
    const initialSlide = 3
    return {
      slides,
      swiperOptions: {
        initialSlide
      }
    }
  }
}
</script>
