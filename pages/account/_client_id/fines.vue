<template lang="pug">
  cabinetBase(:bcItems="bcItems")
    div.scroll
      b-table(:items="items" :fields="fields" striped hover)
        template(#head(name)="data")
          span(v-html="$t('lk_fines_th1')")
        template(#head(vehicle)="data")
          span(v-html="$t('lk_fines_th2')")
        template(#head(fine_size)="data")
          span(v-html="$t('lk_fines_th3')")
        template(#head(date)="data")
          span(v-html="$t('lk_fines_th4')")
        template(#cell(name)="data")
          | {{ $t(data.value) }}
          img(src='/icons/pdf.svg')
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
          name: "Штраф №1 (демо)",
          vehicle: "Audi Q3 New",
          fine_size: 1445,
          date: "25.10.2019"
        },
        {
          name: "Штраф №2 (демо)",
          vehicle: "Toyota Prado Black New",
          fine_size: 125,
          date: "23.10.2019"
        }
      ],
      fields: [
        {key: 'name'},
        {key: 'vehicle'},
        {key: 'fine_size'},
        {key: 'date'}
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
          text: this.$t('Штрафы ПДД'),
          active: true
        }
      ]
    }
  },
  mounted() {
    this.$assets.checkClientAuth(this)
    this.items.forEach(function(curr, index, arr){
      for(let name of ['fine_size']){
        arr[index][name] = arr[index][name] ? arr[index][name] + 'р' : '-'
      }
    })
  },
  methods: {
  }
}
</script>
<style lang="sass" scoped>
@import "~/assets/styles/mixins"
@include orangeBStyles
td
  img
    width: 20px
    margin-left: 10px
.scroll
  @media(max-width:500px)
    overflow: scroll
</style>
<style lang="sass">
th
  vertical-align: middle
</style>
