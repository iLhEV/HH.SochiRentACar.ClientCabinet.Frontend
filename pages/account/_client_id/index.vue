<template lang="pug">
  cabinetBase(:bcItems="bcItems")
    div(v-if="loaded")
      div.us-container
        div.username
          | {{ client.first_name }} {{ client.last_name }}
        b-badge(v-if="client.bonus_status" :style="{ background: bonus_cards[client.bonus_status-1].badge_color }").status
          | {{ $t('lk_card_status_title') }}: {{ $t('lk_card_status' + client.bonus_status) }}
      div.phone-email
        div(flex).pr-4 {{ formatPhone(client.phone) }}
        div(flex) {{ client.email }}
      b-row.mt-4
        b-col(md="7").pl-0
          div(v-if="client.bonus_status").plastic-card
            img.in-plastic(:src='"/images/cards/card" + client.bonus_status + ".svg"')
            div(:class="{ 'change-name' : client.bonus_status === 1 }")#client_name
              | {{ client.first_name }} {{ client.last_name }}
            div(:class="{ 'change-name' : client.bonus_status === 1 }")#card_number
              | {{ ('00' + client.id).slice(-3) }}
            div(:class="{ 'change-date' : client.bonus_status === 1 }")#card_expire
              | 10/20
          div(v-else).mt-2.px-3
            | {{ $t('lk_msg5') }}
        b-col(md="5")
          div
            div.kilometers {{ $assets.prepareNumber(client.bonus_miles) }} {{ get_miles(client.bonus_miles) }}
            b-link(to="#")
              img.question(src="/icons/question.svg")
          div.my-4
            | {{ $t("lk_card_get_level_message" + client.bonus_status) }}
          div
            goalProgressBar(key="1" :label="$t('lk_card_distance')" :from="$assets.prepareNumber(client.mileage) + $t('unit1')" :to="$assets.prepareNumber(bonus_cards[client.bonus_status].max_mileage) + $t('unit1')" :percent="Math.round(client.mileage/(bonus_cards[client.bonus_status].max_mileage/100))")
            div.mt-3
            goalProgressBar(key="2" :label="$t('lk_card_days')" :from="get_days_string(client.rental_days)" :to="get_days_string(bonus_cards[client.bonus_status].max_days)" :percent="Math.round(client.rental_days/(bonus_cards[client.bonus_status].max_days/100))")
            div.mb-5
    div(v-else)
      loader
</template>
<script>
import cabinetBase from "~/components/clientAccount/cabinetBase";
import goalProgressBar from "~/components/clientAccount/goalProgressBar";
import loader from "~/components/loader";
import { mapGetters } from 'vuex';


export default {
  components: {
    cabinetBase,
    goalProgressBar,
    loader
  },
  data() {
    return {
      loaded: false,
      bonus_cards: [
        {
          max_mileage: 100,
          max_days: 1,
          badge_color: '#6E5E3A'
        },
        {
          max_mileage: 1000,
          max_days: 10,
          badge_color: '#8E8E8E'
        },
        {
          max_mileage: 5000,
          max_days: 50,
          badge_color: '#B5872B'
        },
        {
          max_mileage: 10000,
          max_days: 100,
          badge_color: '#383838'
        }
      ],
      user: {
        name: "Максим Константинопольский",
        phone: "+7 992 334-15-74",
        email: "tchk.d@yandex.ru",
        card: {
          name: "Maxim Konstantinopolsky",
          number: 83,
          valid: "10/20",
          kilometers_current: 1251,
          miles_current: 1100,
          kilometers_percent: 30,
          days_goal: 30,
          days_percent: 10,
        }
      },
      bcItems: [
        {
          text: this.$t('Личный кабинет'),
          to: { name: this.$assets.prefix('account-client_id', this.$i18n.locale), params: {client_id: this.$route.params.client_id} }
        },
        {
          text: this.$t('Мой счёт'),
          active: true
        }
      ],
      age_selected: 25,
      age_options: [],
      sex_selected: 'М',
      sex_options: ['М', 'Ж'],
      client: {}
    }
  },
  computed: {
    ...mapGetters(['axios_config'])
  },
  mounted(){
    this.$assets.checkClientAuth(this)
    this.$axios.get(`clients/${this.$route.params.client_id}`, this.axios_config)
    .then((resp) => {
      this.client = resp.data.data
      this.loaded = resp.data.status === 'success'
      this.bonus_cards.push({max_mileage: this.client.mileage, max_days: this.client.rental_days})
    }).catch ((e) => {
      this.$assets.makeErrorToast(this, e)
    })
  },
  methods: {
    get_days_string(count){
      return count + ' ' + this.$assets.getNameSpecBiling(count, this.$i18n.locale, 'день', 'дня', 'дней', 'day', 'days')
    },
    get_miles(count){
      return this.$assets.getNameSpecBiling(count, this.$i18n.locale, 'миля', 'мили', 'миль', 'mile', 'miles')
    },
    formatPhone(phone){
      return phone.substr(0, 2) + ' (' + phone.substr(2, 3) + ') ' + phone.substr(5, 3) + ' ' + phone.substr(8, 2) + ' ' + phone.substr(10, 100)
    }
  },
  watch: {
    loaded(){
    }
  }

}
</script>
<style lang="sass" scoped>
.us-container
  display: flex
  flex-wrap: wrap
.username
  display: flex
  align-items: flex-end
  margin-right: 21px
  margin-bottom: 12px
  line-height: 1.625rem
  font-size: 1.625rem
  font-weight: 700
.status
  display: flex
  align-items: flex-end
  margin-bottom: 12px
  font-size: 1rem
  line-height: 1rem
  color: #3E424C
.phone-email
  display: flex
  flex-wrap: wrap
  font-size: 1rem
.plastic-card
  position: relative
  border: none
  margin: 0 15px 35px
.in-plastic
  width: 100%
.kilometers
  border: 2px solid #FD811E
  border-radius: 10px
  font-size: 1.625rem
  font-weight: 700
  padding: 7px 16px
  display: inline-block
.question
  position: relative
  left: 15px
  top: -4px
  width: 24px
  height: 24px
  vertical-align: middle
  display: inline-block
  background-repeat: no-repeat
#card_expire
  position: absolute
  top: 67.5%
  left: 19%
  font-size: 2rem
  color: #fff
  @media(max-width: 460px)
    top: 70%
    left: 20%
    font-size: 1.7rem
  @media(max-width: 405px)
    font-size: 1.3rem
#client_name
  position: absolute
  top: 11%
  left: 7.7%
  font-size: 1.75rem
  color: #fff
.change-name, .change-date
  color: #B7B7B7 !important
.change-date
  top: 69% !important
#card_number
  position: absolute
  top: 41%
  left: 7.7%
  font-size: 1.625rem
  color: #fff
.badge
  color: #fff
  position: relative
  top: 2px
  font-weight: normal
  font-size: 0.95rem
</style>
<style lang="sass">
</style>
