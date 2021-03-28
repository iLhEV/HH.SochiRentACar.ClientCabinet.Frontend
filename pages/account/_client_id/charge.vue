<template lang="pug">
  cabinetBase(:bcItems="bcItems")
    div#user_cabinet_chargemiles
      #inputs
        b-form-group(:label="$t('Номер бронирования')")
          b-input(v-model="booking_number" :placeholder="$t('Введите номер')").number
          div {{ booking_number}} {{ booking_date }}
        b-form-group(:label="$t('Дата бронирования')").date
          datetime(
            type="date"
            :placeholder="$t('Введите дату')"
            v-model="booking_date"
            format="dd.MM.yy"
          )
      b-button(@click="charge") {{ $t('Проверить') }}
</template>
<script>
import cabinetBase from "~/components/clientAccount/cabinetBase";
import { Datetime } from 'vue-datetime';
import { mapGetters } from 'vuex';
export default {
  components: {
    cabinetBase,
    Datetime
  },
  data() {
    return {
      bcItems: [
        {
          text: this.$t('Личный кабинет'),
          to: { name: this.$assets.prefix('account-client_id', this.$i18n.locale), params: {client_id: this.$route.params.client_id} }
        },
        {
          text: this.$t('Начислить мили'),
          active: true
        }
      ],
      booking_date: null,
      booking_number: null
    }
  },
  computed: {
    ...mapGetters(['axios_config'])
  },
  mounted(){
    this.$assets.checkClientAuth(this)
  },
  methods: {
    charge() {
      this.$axios.get(`bonusmiles/` + this.$route.params.client_id + `/charge`, this.axios_config)
      .then(res => {
        if(res.data.status === 'success'){
          this.validation = {}
          this.$assets.makeTranslatedToast(this, 'success', 'Статус', 'Мили успешно начислены (демо)')
        }else{
          this.$assets.makeErrorToast(this)
        }
      }).catch (e => {
        this.$assets.makeErrorToast(this)
        console.error(e)
      })
    }
  }
}
</script>
<style lang="sass" scoped>
#inputs
  display: flex
  flex-wrap: wrap
.number
  max-width: 255px
.date
  @media(max-width:500px)
    flex-basis: 100%
</style>
<style lang="sass">
#user_cabinet_chargemiles
  .col-form-label
    padding: 0 0 2px 0
    padding-left: 0
    font-size: 1rem
    line-height: 1rem
    color: #B7B7B7
  .form-control
    height: 37px
    border-radius: 0
    border: 1px solid #B7B7B7
    color: #000
  .vdatetime-input
    border: 1px solid #B7B7B7
    width: 160px
    height: 37px
    padding-left: 10px
  .form-group
    margin-right: 30px
</style>
