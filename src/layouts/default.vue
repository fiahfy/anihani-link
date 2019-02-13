<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-tile v-for="tab in tabs" :key="tab.name" :to="tab.path">
          <v-list-tile-action>
            <v-icon>{{ tab.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="tab.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app clipped-left>
      <v-toolbar-side-icon
        class="hidden-xs-only"
        @click.stop="drawer = !drawer"
      />
      <v-toolbar-title>AniHani Schedule</v-toolbar-title>
    </v-toolbar>

    <v-content class="fill-height scroll-y">
      <nuxt />
    </v-content>

    <v-footer app mandatory height="56" class="hidden-sm-and-up">
      <v-bottom-nav :active.sync="activeIndex" :value="true">
        <v-btn
          v-for="(tab, index) of tabs"
          :key="tab.name"
          color="primary"
          flat
          :value="index"
          @click="(e) => onTabClick(e, tab)"
        >
          <span>{{ tab.title }}</span>
          <v-icon>{{ tab.icon }}</v-icon>
        </v-btn>
      </v-bottom-nav>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  components: {},
  data() {
    return {
      drawer: null,
      activeIndex: 0,
      tabs: [
        {
          title: 'Schedule',
          icon: 'schedule',
          name: 'index',
          path: '/'
        },
        {
          title: 'Member',
          icon: 'account_circle',
          name: 'members',
          path: '/members'
        },
        {
          title: 'About',
          icon: 'help',
          name: 'about',
          path: '/about'
        }
      ]
    }
  },
  computed: {
    title() {
      const date = new Date(this.month)
      return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    },
    today() {
      return new Date(this.now).getDate()
    },
    ...mapState([]),
    ...mapGetters([])
  },
  created() {
    this.activeIndex = this.tabs.findIndex(
      (tab) => tab.name === this.$route.name
    )
  },
  methods: {
    getClasses(category) {
      return {
        'primary--text': category.id === this.category.id
      }
    },
    onTabClick(e, tab) {
      this.$router.push(tab.path)
    },
    ...mapMutations([])
  }
}
</script>

<style scoped>
@media only screen and (min-width: 600px) {
  .v-content {
    padding-bottom: 0 !important;
  }
}
@media only screen and (min-width: 1264px) {
  .v-navigation-drawer {
    max-height: calc(100% - 64px) !important;
  }
}
.v-item-group.v-bottom-nav .v-btn--active {
  padding-top: 8px;
}
.v-item-group.v-bottom-nav .v-btn--active >>> .v-btn__content {
  font-size: 12px;
}
</style>
