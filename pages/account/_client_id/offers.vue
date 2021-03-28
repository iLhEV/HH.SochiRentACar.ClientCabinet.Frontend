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
          size: 2,
          image: '/images/examples/spendmiles/6.png',
          title: ['Скидка на долгосрочную поездку!', 'Discount for longterm rental'],
          link: '#'

        },
        {
          size: 1,
          image: '/images/examples/spendmiles/5.png',
          title: ['Logan от 900р', 'Logan from 900 rubles'],
          link: '#'
        },
        {
          size: 1,
          image: '/images/examples/spendmiles/2.png',
          title: ['До аэропорта 30% скидка', 'Discount 30% to airport'],
          link: '#'
        },
        {
          size: 2,
          image: '/images/examples/spendmiles/1.png',
          title: ['Промокод на первую бесплатную поездку H3DM344', 'Promo-code for first free trip'],
          link: '#'
        }
      ],
      bcItems: [
        {
          text: this.$t('Личный кабинет'),
          to: { name: this.$assets.prefix('account-client_id', this.$i18n.locale), params: {client_id: this.$route.params.client_id} }
        },
        {
          text: this.$t('Персональные предложения'),
          active: true
        }
      ]
    }
  },
  mounted(){
    this.$assets.checkClientAuth(this)
  },
  methods: {
    get_title(title){
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
