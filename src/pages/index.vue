<template>
  <v-container fill-height scroll-y pa-0>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-list two-line>
            <template v-for="daySchedule of daySchedules">
              <v-subheader :key="daySchedule.timestamp">
                {{ daySchedule.timestamp }}
              </v-subheader>

              <template v-for="schedule of daySchedule.schedules">
                <v-list-tile :key="schedule.id" avatar @click="">
                  <v-list-tile-avatar>
                    <img
                      src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                    />
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title v-text="schedule.id" />
                    <v-list-tile-sub-title
                      v-html="schedule.description"
                    ></v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider :key="`${schedule.id}-divider`" inset />
              </template>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      daySchedules: []
    }
  },
  async created() {
    const d = new Date()
    const yesterday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1)
    const snapshot = await this.$db
      .collection('anihani-schedules')
      .where('started_at', '>', yesterday)
      .orderBy('started_at', 'asc')
      .get()
    this.daySchedules = snapshot.docs
      .map((doc) => {
        const owner = doc.data().owner
        if (owner) {
          // const o = await db.collection('anihani-members').doc(doc.data().owner).get()
          // console.log(o.data())
        }
        return {
          ...doc.data(),
          id: doc.id
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
  }
}
</script>

<style scoped></style>
