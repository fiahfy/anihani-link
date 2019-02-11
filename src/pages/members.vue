<template>
  <v-container fill-height scroll-y pa-0>
    <v-layout column>
      <v-card
        v-for="member of members"
        :key="member.id"
        class="ma-3"
        :style="{ 'background-color': colors[member.id] }"
        dark
      >
        <v-card-actions>
          <v-list-tile class="grow">
            <v-list-tile-avatar color="grey darken-3">
              <v-img
                class="elevation-6"
                src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
              />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-text="member.name_ja" />
            </v-list-tile-content>

            <!-- <v-layout align-center justify-end>
              <v-icon class="mr-1">mdi-heart</v-icon>
              <span class="subheading mr-2">256</span>
              <span class="mr-1">·</span>
              <v-icon class="mr-1">mdi-share-variant</v-icon>
              <span class="subheading">45</span>
            </v-layout> -->
          </v-list-tile>
        </v-card-actions>
        <v-card-text v-text="member.description" />
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
const colors = {
  'ran-hinokuma': 'rgb(123, 187, 80)',
  'hinako-umori': 'rgb(233, 127, 172)',
  'haneru-inaba': 'rgb(245, 221, 129)',
  'ichika-soya': 'rgb(85, 188, 232)',
  'mico-sekishiro': 'rgb(201, 227, 159)',
  'eli-sogetsu': 'rgb(123, 187, 80)',
  'patra-suo': 'rgb(250, 32, 127)',
  'charlotte-shimamura': 'rgb(126, 133, 251)',
  'mary-saionji': 'rgb(206, 132, 216)'
}

export default {
  data() {
    return {
      colors,
      members: []
    }
  },
  async created() {
    const snapshot = await this.$db.collection('anihani-members').get()
    this.members = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id }
    })
  }
}
</script>
