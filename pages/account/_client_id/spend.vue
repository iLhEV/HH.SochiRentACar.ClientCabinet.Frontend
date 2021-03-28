<template lang="pug">
cabinetBase(:bcItems="bcItems").base
  div.subcont.my-2
    b-row
      b-col(v-for="(item, key) in items" :key="key" :cols="6 * item.size" :md="item.size * 4").col
        div(@click="open_offer" :style="{ backgroundImage: 'url(' + item.image }" :class="'card' + item.size")
          h1 {{ get_title(item.title) }}
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
          size: 1,
          image: '/images/examples/spendmiles/2.png',
          title: ['Арендуй автомобиль бесплатно!', 'Rent a car for free!'],
          link: '#'
        },
        {
          size: 2,
          image: '/images/examples/spendmiles/1.png',
          title: ['Аренда авто с водителем', 'Car rental with a driver'],
          link: '#'
        },
        {
          size: 1,
          image: '/images/examples/spendmiles/3.png',
          title: ['Трансфер из аэропорта', 'Airport Transfer'],
          link: '#'
        },
        {
          size: 1,
          image: '/images/examples/spendmiles/4.png',
          title: ['Условия аренды', 'Rent terms'],
          link: '#'
        },
        {
          size: 1,
          image: '/images/examples/spendmiles/5.png',
          title: ['Скидка на поездку', 'Trip discount'],
          link: '#'
        }
      ],
      bcItems: [
        {
          text: this.$t('Личный кабинет'),
          to: { name: this.$assets.prefix('account-client_id', this.$i18n.locale), params: {client_id: this.$route.params.client_id} }
        },
        {
          text: this.$t('Потратить мили'),
          active: true
        }
      ]
    }
  },
  mounted() {
    this.$assets.checkClientAuth(this)
  },
  methods: {
    get_title(title) {
      if(this.$i18n.locale === "ru"){
        return title[0]
      }else{
        return title[1]
      }
    },
    open_offer() {
      //
    }
  }
}
</script>
<style lang="sass" scoped>
.subcont
  @media(max-width:991px)
    padding-left: 15px
    padding-right: 15px
.col
  position: relative
  padding-bottom: 20px
.card1, .card2
  border-radius: 10px
  width: 100%
  height: 0
  padding-bottom: 100%
  background-size: cover
  background-repeat: no-repeat
  cursor: pointer
.card2
  padding-bottom: 47.2%
h1
  position: absolute
  top: 0
  left: 0
  margin-top: 30px
  margin-left: 45px
  margin-right: 30px
  font-size: 1.1875rem
  color: #3E424C
  @media(max-width:470px)
    margin-top: 15px
    margin-left: 30px
</style>
