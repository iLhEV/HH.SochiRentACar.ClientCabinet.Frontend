<template lang="pug">
  b-container.px-3.mt-3
    BreadCrumbs(:items="bcItems")
    b-row
      b-col(lg="3")
        ul.list-unstyled.side-menu.px-1
          li(v-for="link in links")
            nuxt-link(:to="{name: generate_route(link), params: {client_id: $route.params.client_id}}" v-if="typeof link.sublinks === 'undefined'")
              | {{ $t(link.translation) }}
            nuxt-link(:to="{name: generate_route(link), params: {client_id: $route.params.client_id}}" v-else).with-sublinks
              | {{ $t(link.translation) }}
            ul(v-if="typeof link.sublinks !== 'undefined' && link.sublinks.length != 0").sublink
              li(v-for="(sublink, skey) in link.sublinks")
                nuxt-link(:to="{name: generate_route(sublink), params: {client_id: $route.params.client_id}}")="{{ $t(sublink.translation) }}"
                //- div.corner
                //- div(v-if="skey > 0").stroke
      b-col(lg="9").slot-container
        slot
</template>
<script>
import BreadCrumbs from "~/components/BreadCrumbs";
export default {
  name: "userCabinetBase",
  props: {
    bcItems: Array
  },
  components: {
    BreadCrumbs
  },
  data(){
    return {
      links: [
        {route: '', translation: 'pm1'},
        {route: 'settings', translation: 'pm2'},
        {
          route: 'history',
          translation: 'pm3',
          sublinks: [
            {route: 'damages', translation: 'pm3-1'},
            {route: 'fines', translation: 'pm3-2'},

          ]
        },
        {route: 'charge', translation: 'pm4'},
        {route: 'spend', translation: 'pm5'},
        {route: 'drivers', translation: 'pm6'},
        {route: 'offers', translation: 'pm7'}
      ],
      prefix: "account-client_id"
    }
  },
  methods: {
    generate_route(link){
      const sub = link.route === '' ? '' : '-' + link.route
      return this.$assets.prefix(this.prefix + sub, this.$i18n.locale)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~/assets/styles/variables"
.slot-container
  overflow: hidden
.side-menu
  position: -webkit-sticky
  position: sticky
  top: 0
  padding: 0 15px
  li
    padding: 3px 0
    a
      color: $primary
      text-decoration: underline
      transition: 0.3s
      &.nuxt-link-exact-active
        color: $primary_hover
        text-decoration: none
      &:hover
        color: $primary_hover
        text-decoration: none
.sublink
  margin: 0
  padding: 0 0 0 20px
  list-style-type: none
  li
    position: relative
    //border-left: 1px solid #B7B7B7
  li::before
    //content: "-"
    //color: #B7B7B7
.corner
  position: absolute
  top: 2px
  left: -11px
  width: 7px
  height: 14px
  border-left: 1px solid #B7B7B7
  border-bottom: 1px solid #B7B7B7
.stroke
  position: absolute
  top: -15px
  left: -11px
  width: 1px
  height: 20px
  border-left: 1px solid #B7B7B7
</style>
