<template lang="pug">
  b-modal(ref="userTripDetailModal")#user_trip_detail_modal.pa-trip-detail
    div(slot="modal-footer")
    h1(v-if="rent.car").main {{ rent.car.naimenovanie }}
    h1(v-else).main Данные об авто не определены
    b-row.my-3
      b-col
        b-carousel(controls indicators).carousel
          b-carousel-slide(v-if="rent.car" :img-src="rent.car.car_image")
          div(v-else)
      b-col
        ul(v-if="rent.car").orange-icons-list
          //- li.bag {{ rent.bags }} {{ $assets.getNameSpecBiling(rent.bags, $i18n.locale, 'сумка', 'сумки', 'сумок', 'bag', 'bags') }}, {{ rent.suitcase }} {{ $assets.getNameSpecBiling(rent.suitcase, $i18n.locale, 'чемодан', 'чемодана', 'чемоданов', 'suitcase', 'suitcases') }}
          li.person {{ rent.car.numberofseats }} {{ $assets.getNameSpecBiling(rent.car.numberofseats, $i18n.locale, 'пассажир', 'пассажира', 'пассажиров', 'passenger', 'passengers') }}
            //-       li.fuel {{ rent.fuel }}{{ $t('')}} / 100км
          li.kpp {{ rent.car.kpp }}
    //-       li.person {{ rent.doors }} {{ $assets.getNameSpec(rent.doors, 'дверь', 'двери', 'дверей') }}
    //-       li.climat Климат-контроль
    div.trip
      h3 {{ $t(rent.points[0]) }}
      span {{ formatDate(rent.date_begin) }}
      h3 {{ $t(rent.points[1]) }}
      span {{ formatDate(rent.date_end) }}
    div(v-for="list_item in list")
      h2 {{ list_item.header }}
      table(:class="list_item.class").list
        tr(v-for="(val, title) in list_item.items")
          td {{ $t(title) }}
          td {{ val }}
    table.font-weight-bold.mb-4
      td ИТОГО:
      td  {{ $assets.prepareNumber(rent.sum) }} &#8381;
    //- b-link(to="/").href Скачать ваучер
    //- b-img(src="/icons/pdf.svg").ml-3.text-muted
    //- div.mt-3
</template>
<script>
export default {
  name: "userTripDetail",
  props: {
    rent: null
  },
  data() {
    return {
      list: [
        {
          header: "Дополнительные опции",
          class: "check-list",
          items: {
            "На этапе разработки": "",
          }
        },
        {
          header: "Повреждения АМ",
          items: {
            "На этапе разработки": ""
          }

        },
        {
          header: "Штрафы ПДД",
          items: {
            "На этапе разработки": ""
          }
        }
      ]
    }
  },
  mounted() {
    // for (let list_id in this.rent.lists){
    //   for (const [key, value] of Object.entries(this.rent.lists[list_id].items)) {
    //     this.rent.lists[list_id].items[key] = value + 'р'
    //   }
    // }
  },
  methods: {
    formatDate(val) {
      return this.$moment(val).format('DD.MM.YYYY, hh:mm')
    }
  }
}
</script>
<style lang="sass" scoped>
@import "~/assets/styles/mixins"
@include orangeBStyles
h1.main
  font-size: 2rem
li
  font-size: 1rem
.trip
  padding-left: 30px
  background-image: url("/icons/bind2.svg")
  background-position-y: 24px
  background-repeat: no-repeat
  h3
    font-size: 1.25rem
  span
    display: block
    margin-top: 10px
    font-size: 1rem
  h3:nth-child(3)
    padding-top: 40px
h2
  margin-top: 30px
  margin-bottom: 15px
  font-size: 1.625rem
table
  padding: 0
  margin: 0
  width: 100%
  td
    font-size: 1rem
    padding-bottom: 14px
  td:nth-child(odd)
    margin-bottom: 20px
  td:nth-child(even)
    padding-left: 10px
    text-align: right
table.check-list
  td:nth-child(odd)
    padding-left: 22px
    background-image: url("/icons/check.svg")
    background-position-y: 5px
    background-repeat: no-repeat
.href
  font-size: 1.125rem
  color: #000
</style>
<style lang="sass">
#user_trip_detail_modal
  .modal-body
    padding-left: 40px
    padding-right: 40px
  .modal-header
    padding: 10px
    border-bottom: 0 none
  .modal-footer
    border-top: 0 none
</style>
