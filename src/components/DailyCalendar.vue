<template>
  <v-layout column class="wrapper mb-3">
    <v-subheader v-text="headline" />
    <div class="mx-3">
      <v-layout v-for="hour of hours" :key="hour" align-center class="hour">
        <div class="label text-xs-right caption grey--text">
          <template v-if="hasLabel(hour)">
            {{ hour }}:00
          </template>
        </div>
        <v-divider />
      </v-layout>
      <v-layout
        v-if="hasNow"
        :style="{ top: 66 * nowY + 'px' }"
        align-center
        class="hour current"
      >
        <div class="label text-xs-right caption primary--text">
          {{ nowLabel }}
        </div>
        <v-divider class="primary" />
      </v-layout>
      <div class="content">
        <div>
          <daily-calendar-card
            v-for="e of ajustedEvents"
            :key="e.id"
            :style="{
              position: 'absolute',
              top: 66 * e.y + 'px',
              left: 100 * e.w * e.x + '%',
              height: 66 * e.h + 'px',
              width: 100 * e.w + '%'
            }"
            :event="e"
          />
        </div>
      </div>
    </div>
  </v-layout>
</template>

<script>
import DailyCalendarCard from '~/components/DailyCalendarCard.vue'

export default {
  components: {
    DailyCalendarCard
  },
  props: {
    date: {
      type: Date,
      required: true
    },
    events: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      timer: null,
      now: new Date(),
      hours: [...Array(25).keys()]
    }
  },
  computed: {
    headline() {
      const d = new Date(this.date)
      return d.toLocaleDateString(window.navigator.language, {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      })
    },
    hasNow() {
      const tomorrow = new Date(this.date)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return this.now >= this.date && this.now < tomorrow
    },
    nowY() {
      return this.now.getHours() + this.now.getMinutes() / 60
    },
    nowLabel() {
      return (
        this.now.getHours() + ':' + ('00' + this.now.getMinutes()).slice(-2)
      )
    },
    ajustedEvents() {
      const events = this.events.map((e) => {
        const startedAt = e.started_at.toDate()
        const d = new Date(startedAt)
        d.setHours(d.getHours() + 1)
        return {
          ...e,
          startedAt,
          endedAt: d
        }
      })

      let index = 0
      let maxX = 0
      for (let i = 0; i < events.length; i++) {
        const e = events[i]
        e.y = e.startedAt.getHours() + e.startedAt.getMinutes() / 60
        e.h = (e.endedAt.getTime() - e.startedAt.getTime()) / 60 / 60 / 1000
        const targets = events.slice(index, i)
        if (!targets.length) {
          e.x = 0
        } else {
          const xs = targets.reduce((carry, p) => {
            if (e.startedAt >= p.startedAt && e.startedAt < p.endedAt) {
              return [...carry, p.x]
            }
            return carry
          }, [])

          let minX = xs.length
          for (let j = 0; j < xs.length; j++) {
            if (!xs.includes(j)) {
              minX = j
              break
            }
          }

          if (minX > maxX) {
            maxX = minX
          }

          e.x = minX
        }

        if (i === events.length - 1 || e.endedAt <= events[i + 1].startedAt) {
          for (let j = index; j <= i; j++) {
            events[j].w = 1 / (maxX + 1)
          }
          index = i + 1
          maxX = 0
        }
      }
      return events
    }
  },
  created() {
    this.timer = setInterval(() => {
      this.now = new Date()
    }, 1000)
  },
  methods: {
    hasLabel(hour) {
      const d = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        this.date.getDate(),
        hour
      )
      const start = new Date(d)
      start.setMinutes(-15)
      const end = new Date(d)
      end.setMinutes(15)
      return !(this.now > start && this.now < end)
    }
  }
}
</script>

<style scoped>
.wrapper {
  position: relative;
  margin-left: env(safe-area-inset-left);
  margin-right: env(safe-area-inset-left);
}
.wrapper > div {
  position: relative;
}
.content {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  box-sizing: border-box;
  padding: 33px 0px 33px 40px;
}
.content > div {
  position: relative;
}
.hour {
  height: 66px;
}
.hour.current {
  position: absolute;
  left: 0;
  right: 0;
}
.hour > .label {
  width: 40px;
  padding-right: 4px;
}
</style>
