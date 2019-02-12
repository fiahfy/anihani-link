<template>
  <v-container fill-height>
    <v-layout v-if="daySchedules.length" row>
      <v-flex xs12>
        <v-card>
          <v-list two-line>
            <template v-for="daySchedule of daySchedules">
              <v-subheader :key="daySchedule.timestamp">
                {{ daySchedule.timestamp | headline }}
              </v-subheader>

              <template v-for="(schedule, index) of daySchedule.schedules">
                <v-list-tile :key="schedule.id" avatar @click="">
                  <v-list-tile-avatar>
                    <img
                      src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                    />
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title
                      v-text="
                        schedule.owner ? schedule.owner.name_ja : schedule.title
                      "
                    />
                    <v-list-tile-sub-title>
                      <span>{{ schedule.started_at | time }}-</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider
                  v-if="index !== daySchedule.schedules.length - 1"
                  :key="`${schedule.id}-divider`"
                  inset
                />
              </template>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-else fill-height align-center justify-center>
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        size="64"
      />
      <div v-else class="text-xs-center">
        <v-icon size="128" color="grey lighten-2">error</v-icon>
        <p class="subheading">No Schedules</p>
        <p class="caption">
          No data or No good.
        </p>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  filters: {
    headline(value) {
      const d = new Date(value)
      return d.toLocaleString(window.navigator.language, {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      })
    },
    time(value) {
      const d = value.toDate()
      return (
        ('00' + d.getHours()).slice(-2) +
        ':' +
        ('00' + d.getMinutes()).slice(-2)
      )
    }
  },
  data() {
    return {
      loading: true,
      daySchedules: []
    }
  },
  async created() {
    const membersSnapshot = await this.$db.collection('anihani-members').get()
    const members = membersSnapshot.docs.reduce((carry, doc) => {
      return {
        ...carry,
        [doc.id]: doc.data()
      }
    }, {})

    const d = new Date()
    const yesterday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 2)

    const schedulesSnapshot = await this.$db
      .collection('anihani-schedules')
      .where('started_at', '>', yesterday)
      .orderBy('started_at', 'asc')
      .get()
    this.daySchedules = schedulesSnapshot.docs
      .map((doc) => {
        let owner = doc.data().owner
        if (owner) {
          owner = members[owner.id]
        }
        return {
          ...doc.data(),
          id: doc.id,
          owner
        }
      })
      .reduce((carry, schedule) => {
        const d = schedule.started_at.toDate()
        const timestamp = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate()
        ).getTime()
        if (carry.length && carry[carry.length - 1].timestamp === timestamp) {
          carry[carry.length - 1].schedules = [
            ...carry[carry.length - 1].schedules,
            schedule
          ]
          return carry
        }
        return [
          ...carry,
          {
            timestamp,
            schedules: [schedule]
          }
        ]
      }, [])
    this.loading = false
  }
}
</script>

<style scoped></style>
