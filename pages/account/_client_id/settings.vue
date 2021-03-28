<template lang="pug">
  cabinetBase(:bcItems="bcItems")
    div(v-if="loaded")#user_setting
      b-form-group(:label="$t('lk_settings3')")
        b-input(v-model='client.first_name' :placeholder="$t('lk_settings1')" :value="client.first_name" trim)
        div.err {{ validation.first_name }}
      b-form-group(:label="$t('lk_settings4a')")
        b-input(v-model='client.middle_name' :placeholder="$t('lk_settings1a')" :value="client.middle_name" trim)
        div.err {{ validation.middle_name }}
      b-form-group(:label="$t('lk_settings4')")
        b-input(v-model='client.last_name' :placeholder="$t('lk_settings2')" :value="client.last_name" trim)
        div.err {{ validation.last_name }}
      b-form-group(:label="$t('lk_settings5')")
        vue-phone-number-input(@input="onPhoneChange" ref="phoneInput" v-model="ph" :clearable="true" :translations="{countrySelectorLabel: $t('contacts6'),countrySelectorError: $t('contacts7'),phoneNumberLabel: $t('contacts8'),example: $t('contacts9')}")
      div.age_sex
        b-form-group(:label="$t('lk_settings6')")
          b-select(v-model="age_selected" :options="age_options")
        b-form-group(:label="$t('lk_settings7')")
          b-select(v-model="sex_selected" :options="sex_options")
      div.mt-2
        b-button(@click="cleanForm").btn-rev {{ $t('lk_button1') }}
        b-button(@click="saveClient") {{ $t('lk_button2') }}
      div.mb-5
    div(v-else)
      loader
</template>
<script>
import cabinetBase from "~/components/clientAccount/cabinetBase";
import loader from "~/components/loader";
import { mapGetters } from 'vuex';
export default {
  components: {
    cabinetBase,
    loader
  },
  data() {
    return {
      ph: "",
      phone: "",
      bcItems: [
        {
          text: this.$t('Личный кабинет'),
          to: { name: this.$assets.prefix('account-client_id', this.$i18n.locale), params: {client_id: this.$route.params.client_id} }
        },
        {
          text: this.$t('Настройки'),
          active: true
        }
      ],
      age_selected: '',
      age_options: [],
      sex_selected: 0,
      sex_options: {},
      loaded: false,
      client: {},
      validation: {},
      names_reg: /^[а-яА-ЯЁёa-zA-Z\s]{0,100}$/
    }
  },
  computed: {
    ...mapGetters(['axios_config']),
    first_name() { return this.client.first_name },
    middle_name() { return this.client.middle_name },
    last_name() { return this.client.last_name },
  },
  mounted(){
    this.$assets.checkClientAuth(this)
    this.loadData()
  },
  watch: {
    first_name(val){ this.names_reg.test(this.client['first_name']) ? this.validation['first_name'] = '' : this.validation['first_name'] = this.$t('lk_msg1') },
    middle_name(val){ this.names_reg.test(this.client['middle_name']) ? this.validation['middle_name'] = '' : this.validation['middle_name'] = this.$t('lk_msg3') },
    last_name(val){ this.names_reg.test(this.client['last_name']) ? this.validation['last_name'] = '' : this.validation['last_name'] = this.$t('lk_msg3') }
  },
  methods: {
    loadData() {
      this.$axios.get(`clients/` + this.$route.params.client_id, this.axios_config).then(res => {
        if(res.data.status === 'success'){
          //Присваиваю клиента
          let client = this.client = res.data.data
          //Присваиваю телефон
          this.ph = client.phone
          //Задаю допустимые значения для возраста
          this.age_selected = this.$t('lk_settings10')
          this.age_options.push(this.$t('lk_settings10'))
          for(let i=18;i<=80;i++){
            this.age_options.push({value: i, text: i})
          }
          //Определяю возраст
          client.age >= 18 ? this.age_selected = client.age : this.age_selected = this.$t('lk_settings10')
          this.loaded = true
          //Задаю допустимые значения для пола
          this.sex_selected = this.$t('lk_settings10')
          this.sex_options = {0: this.$t('lk_settings10'), 1: this.$t('lk_settings7a'), 2: this.$t('lk_settings7b')}
          this.sex_selected = client.sex
        }else{
          this.$assets.makeErrorToast(this, res.data.status)
        }
      }).catch (e => {
        this.$assets.makeErrorToast(this, e)
      })
    },
    onPhoneChange() {
      this.phone = this.$refs.phoneInput.phoneFormatted
    },
    //Отправляет запрос на сохранение полей на бэк
    async saveClient() {
      //Подготавливаю объект для отправки
      let age = 0; this.age_selected === this.$t('lk_settings10') ? age = 0 : age = this.age_selected;
      let sex = this.sex_selected
      this.$axios.put(
        `clients/` + this.$route.params.client_id,
        {
          first_name: this.client.first_name,
          middle_name: this.client.middle_name,
          last_name: this.client.last_name,
          phone: this.phone,
          age: age,
          sex: sex
        },
        this.axios_config
      ).then(res => {
        if(res.data.status === 'success'){
          this.validation = {}
          this.$store.dispatch('updateClient')
          this.$assets.makeTranslatedToast(this, 'success', 'Статус', 'Настройки успешно сохранены')
        }else{
          this.$assets.makeErrorToast(this)
        }
      }).catch (e => {
        this.$assets.makeErrorToast(this, e)
      })
    },
    cleanForm() {
      this.loadData()
    }
  }
}
</script>
<style lang="sass" scoped>
.btn-secondary:first-child
  margin-right: 30px
.err
  padding-top: 3px
  font-size: 0.75rem
  color: red
</style>
<style lang="sass">
@import "~/assets/styles/mixins"
@include orangeBStyles
#user_setting
  .form-control, .form-control:visited, .form-control:focus, .form-control:active, .form-control:hover
    border-color: #B7B7B7
    border-radius: 0
    color: #000
  .form-group
    max-width: 445px
  ::placeholder
    color: #000
  .col-form-label
    font-size: 1rem
    color: #B7B7B7
  .custom-select
    width: 175px
    border-radius: 0
  .age_sex
    .form-group
      display: inline-block
    .form-group:first-child
      margin-right: 15px
</style>
