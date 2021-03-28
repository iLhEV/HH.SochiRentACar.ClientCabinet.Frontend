<template lang="pug">
  div
    nuxt-link(v-if="!$store.state.client_authenticated" :to="{name: $assets.prefix('account-login', $i18n.locale)}").btn.main.slim="{{ $t('m18') }}"
    div(v-else).client
      b {{ $store.state.client.last_name }} {{ $store.state.client.first_name }} {{ $store.state.client.middle_name }}
      div
        | {{ $t('lk21') }}: {{ $store.state.client.bonus_miles }}
      div.link-containers
        div.account-link-container
          b-link(:to="{ name: $assets.prefix('account-client_id', $i18n.locale), params: {client_id: $store.state.client.id} }") {{ $t('lk22') }}
        div.logout-link-container
          b-link.logout(@click.prevent="clientLogout") {{ $t('lk23') }}
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "HComponent",
  computed: {
    ...mapGetters(['axios_config']),
  beforeCreate() {
    this.$store.commit('initializeStore')
  },
  methods: {
    clientLogout() {
      this.$axios.get(`auth-client/logout`, this.axios_config).then((resp) => {
      }).catch((e) => {
        console.error("Ошибка запроса к api для logout")
      }).finally(() => {
        this.$store.dispatch('logoutClient')
        this.$router.push({ name: this.$assets.prefix('index', this.$i18n.locale) })
      })
    }
  },
}
</script>

<style lang="sass" scoped>
  .client
    width: 200px
    margin-top: 10px
    padding: 5px 10px
    border: 1px solid #FF6A1C
    border-radius: 5px
    font-size: 0.75rem
  .link-containers
    display: flex
    flex-direction: row
    align-items: flex-start
    justify-content: space-between
  .account-link-container, .logout-link-container
    flex-grow: 0
    flex-shrink: 0
  .logout
    font-weight: bold
    text-decoration: underline
</style>