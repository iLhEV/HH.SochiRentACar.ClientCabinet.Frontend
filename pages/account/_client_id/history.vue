<template lang="pug">
  cabinetBase(:bcItems="bcItems")
    div(v-if="loaded")
      div(v-if="Object.entries(month_rents).length !== 0")
        div(v-for="(rents, month_key) in month_rents")
          h1.main {{ get_month(month_key) }} {{ get_year(month_key) }}
          div(@click="open_modal(month_key + '-' + key)" v-for="(item, key) in rents").link
            rentDetailModal(:ref="'userTripDetailComponent' + month_key + '-' + key" :rent="item" :key="month_key + '-' + key")
            rent(:item="item")
        div.mt-5
      div(v-else)
        | {{ $t('lk_msg4') }}
    div(v-else)
      loader
</template>
<script>
import rent from "~/components/clientAccount/rent";
import rentDetailModal from "~/components/clientAccount/rentDetailModal";
import cabinetBase from "~/components/clientAccount/cabinetBase";
import loader from "~/components/loader";
import { mapGetters } from 'vuex';
export default {
  components: {
    rent,
    rentDetailModal,
    cabinetBase,
    loader
  },
  data() {
    return {
      bcItems: [
        {
          text: this.$t('Личный кабинет'),
          to: { name: this.$assets.prefix('account-client_id', this.$i18n.locale), params: {client_id: this.$route.params.client_id} }
        },
        {
          text: this.$t('История бронирования'),
          active: true
        }
      ],
      month_rents: {},
      loaded: false
    }
  },
  computed: {
    ...mapGetters(['axios_config'])
  },
  mounted() {
    this.$assets.checkClientAuth(this)
    let config = this.axios_config
    config.params = { client_id: this.$route.params.client_id }
    this.$axios.get(`rents/`, config).then(res => {
      if(res.data.status === 'success'){
        let rents = res.data.data
        let month_rents = {}
        rents.forEach(function(rent, index, theArray) {
          let month = this.$moment(rent.date_begin).format('MM')
          let year = this.$moment(rent.date_begin).format('YYYY')
          let date_index = 'y' + year + 'm' + month
          date_index in month_rents ? undefined : month_rents[date_index] = []
          month_rents[date_index].push(rent)
          //Добавляю значения элементам, которые пока что не приходят с бэкенда
          theArray[index].thumbnail = "/images/examples/car1.png";
          theArray[index].points = ["Место подачи (в разработке)", "Место возврата (в разработке)"]
        }, this);
        console.log("Ренты по датам:")
        console.log(month_rents)
        this.month_rents = this.sort_dates(month_rents)
        this.loaded = true
      }else{
        this.$assets.makeErrorToast(this, res.data.status)
      }
    }).catch (e => {
      this.$assets.makeErrorToast(this, e)
    })
  },
  methods: {
    open_modal(key){
      this.$refs['userTripDetailComponent' + key][0].$refs['userTripDetailModal'].show()
    },
    sort_dates(no_ordered){
      const ordered = Object.keys(no_ordered).sort().reverse().reduce(
        (obj, key) => {
          obj[key] = no_ordered[key];
          return obj;
        },
        {}
      );
      return ordered
    },
    get_month(key){
      return this.capitalize_first_letter(this.$moment(key.substring(6, 8), 'MM').lang(this.$i18n.locale).format('MMMM'))
    },
    capitalize_first_letter(string){
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    get_year(key){
      return key.substring(1, 5)
    }
  }
}
</script>
<style lang="sass" scoped>
h1.main
  margin-bottom: 20px
  font-size: 1.625rem
  font-weight: 700
.link
  cursor: pointer
</style>
