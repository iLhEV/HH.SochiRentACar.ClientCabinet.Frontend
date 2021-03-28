<template lang="pug">
  cabinetBase(:bcItems="bcItems")
    div.scroll
      b-table(:items="items" :fields="fields" striped hover)
        template(#head(name)="data")
          span(v-html="$t('lk_damages_th1')")
        template(#head(cost)="data")
          span(v-html="$t('lk_damages_th2')")
        template(#head(paid)="data")
          span(v-html="$t('lk_damages_th3')")
        template(#head(debt)="data")
          span(v-html="$t('lk_damages_th4')")
        template(#cell(name)="data")
          | {{ $t(data.value) }}
    b-button.mt-4 Оплатить
</template>
<script>
import cabinetBase from "~/components/clientAccount/cabinetBase";
export default {
  components: {
    cabinetBase
  },
  data() {
    return {
      items: [
        {
          name: "Деталь №1 (демо)",
          cost: 2700,
          paid: 1445,
          debt: 900
        },
        {
          name: "Деталь №2 (демо)",
          cost: 3500,
          paid: 125
        }
      ],
      fields: [
        {key: 'name'},
        {key: 'cost'},
        {key: 'paid'},
        {key: 'debt'}
      ],
      bcItems: [
        {
          text: this.$t('Личный кабинет'),
          to: { name: this.$assets.prefix('account-client_id', this.$i18n.locale), params: {client_id: this.$route.params.client_id} }
        },
        {
          text: this.$t('История бронирования'),
          to: { name: this.$assets.prefix('account-client_id-history', this.$i18n.locale), params: {client_id: this.$route.params.client_id} }
        },
        {
          text: this.$t('Повреждения АМ'),
          active: true
        }
      ]
    }
  },
  mounted() {
    this.$assets.checkClientAuth(this)
    this.items.forEach(function(curr, index, arr){
      for(let name of ['cost', 'paid', 'debt']){
        arr[index][name] = arr[index][name] ? arr[index][name] + 'р' : '-'
      }
    })
  }
}
</script>
<style lang="sass" scoped>
.scroll
  @media(max-width:500px)
    overflow: scroll
</style>
<style lang="sass">
@import "~/assets/styles/mixins"
@include orangeBStyles
</style>
