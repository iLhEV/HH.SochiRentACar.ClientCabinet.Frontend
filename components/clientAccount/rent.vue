<template lang="pug">
  div
    b-row().user-trip
      b-col(xl="2" lg="12").image-container
        b-img(v-if="item.car" :key="item.img" :src="item.car.car_image").image
      b-col(xl="7" lg="12")
        div.points
          h1(v-if="item.car") {{ item.car.naimenovanie }}
          h1(v-else) Данные об авто не определены
            span(v-if="item.car") {{ item.car.godvypuska }}
          p
            | {{ $t(item.points[0]) }}
            img(src="/icons/arrow-right.svg").right-arrow
            | {{ $t(item.points[1]) }}
      b-col(xl="3" lg="12").dates
        div.dates-nested
          p {{ formatDate(item.date_begin) }}
          p {{ formatDate(item.date_end) }}
</template>
<script>
export default {
  name: "userTrip",
  props: {
    item: Object
  },
  methods: {
    formatDate(val){
      return this.$moment(val).format('DD.MM.YYYY')
    }
  }
}
</script>
<style lang="sass" scoped>
.user-trip
  margin: 0
  background: #FFF9F3
  margin-bottom: 20px
.right-arrow
  padding: 0 5px 2px 7px
.image-container
  padding: 0
.image
  width: 145px
.points
  padding-left: 15px
  @media (max-width: 1200px)
    padding-left: 0
  h1
    margin: 17px 0 10px
    font-size: 1.25rem
  span
    font-size: 0.875rem
    padding-left: 5px
  p
    margin: 0
.dates
  min-height: 82px
  box-sizing: padding-box
  padding-top: 10px
  vertical-align: middle
  .dates-nested
    display: inline-block
    padding-left: 20px
    background-image: url("/icons/bind.svg")
    background-position: left center
    background-repeat: no-repeat
  p
    margin: 0
    font-size: 1rem
    font-weight: bold
  p:first-child
    margin-top: 4px
  p:nth-child(2)
    margin-top: 10px
</style>
