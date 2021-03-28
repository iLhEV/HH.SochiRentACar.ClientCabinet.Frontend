<template lang="pug">
  section#personal
    devider
    main.py-3
      div.container
        BreadCrumbs(:items="bcItems")
        h1="{{ $t('lk20') }}"
        b-row
          b-col(sm="12" md="6" lg="6")
              b-form(v-if="show_reg_form")
                //- b-form-group.mb-0.py-2
                  b-form-input(v-model="login" :placeholder="$t('lk16')")
                b-form-group.mb-0.py-2
                  vue-phone-number-input(@input="onPhoneChange" ref="phoneInput" v-model="ph" :clearable="true" :translations="{countrySelectorLabel: $t('contacts6'),countrySelectorError: $t('contacts7'),phoneNumberLabel: $t('contacts8'),example: $t('contacts9')}")
                b-form-group.mb-0.py-2
                  b-form-input(v-model="password" type="password" :placeholder="$t('lk9')")
                b-form-group.mb-0.py-2
                  b-form-input(v-model="re_password" type="password" :placeholder="$t('lk18')")
                b-form-group.mb-0.py-2
                  b-button(@click.prevent="registerClient" type="submit").btn.main.w-100.text-uppercase
                    | {{ $t('lk19') }}
              div(v-else).success-message
                | {{ $t('lk_msg6') }}.
                div.mt-2.mb-4
                  nuxt-link(:to="{name: $assets.prefix('account-login', $i18n.locale)}")="{{ $t('lk24') }}"
              hr
              b-row
                b-col(sm="12" md="6" lg="6").text-center
                  nuxt-link(:to="{name: $assets.prefix('account-login', $i18n.locale)}")="{{ $t('lk14') }}"
                b-col(sm="12" md="6" lg="6").text-center
                  nuxt-link(:to="{name: $assets.prefix('account-renew_password', $i18n.locale)}")="{{ $t('lk13') }}"
          b-col(sm="12" md="6" lg="6").my-0.my-sm-3.my-md-0.my-lg-0
            h5
              |Добро пожаловать в
              b.mx-2.text-nowrap
                span.b-text="AUTOPILOT"
                span="."
                span.r-text="LOYALTY"

            p.my-2
              | Зарегистрируйтесь в программе
              b.mx-2.text-nowrap
                span.b-text="AUTOPILOT"
                span="."
                span.r-text="LOYALTY"
              | до того, как решите забронировать автомобиль.
            p.my-2="Вам будет присвоен персональный номер участника, в который будут внесены ваши личные данные, что поможет сделать процесс бронирования еще проще и быстрее."
            p.my-2="Наш сервис быстрого обслуживания и заранее подготовленные документы позволят оказаться за рулем автомобиля в считанные минуты."
            p.my-20="Автомобиль будет ждать Вас в отведенном месте на парковке."
</template>

<script>
  import BreadCrumbs from "../../components/BreadCrumbs";
  import devider from "../../components/devider";
  export default {
    components: {
      devider,
      BreadCrumbs
    },
    data(){
      return {
        ph: '',
        login: '',
        re_password: '',
        password: '',
        phone: '',
        show_reg_form: true,
        bcItems: [
          {
            text: this.$t('breadcrumbs1'),
            to: { name: this.$assets.prefix('index', this.$i18n.locale) }
          },
          {
            text: this.$t('lk20'),
            active: true
          }
        ]
      }
    },
    methods:{
      onPhoneChange() {
        this.phone = this.$refs.phoneInput.phoneFormatted;
      },
      checkData() {
        let err_flag = false
        if(this.phone === undefined){
          this.$assets.makeTranslatedToast(this, 'danger', 'Ошибка регистрации', 'Телефон не может быть пустой')
          err_flag = true
        }
        if(this.password.length < 8){
          this.$assets.makeTranslatedToast(this, 'danger', 'Ошибка регистрации', 'Длина пароля должна быть не менее 8 символов')
          err_flag = true
        }
        if(this.password != this.re_password){
          this.$assets.makeTranslatedToast(this, 'danger', 'Ошибка регистрации', 'Пароли должны быть одинаковыми')
          err_flag = true
        }
        return !err_flag
      },
      registerClient() {
        if(!this.checkData()) return
        this.$axios.post('auth-client/register', {
          phone: this.phone,
          password: this.password
        }).then(res => {
          if(res.data.status === 'success'){
            this.show_reg_form = false
            this.$store.state.reg_phone = this.phone
          } else if (res.data.status === 'client_already_registered') {
            this.$assets.makeTranslatedToast(this, 'danger', 'Ошибка регистрации', 'Клиент с таким телефоном уже зарегистрирован в системе')
          } else if (res.data.status === 'client_not_found') {
            this.$assets.makeTranslatedToast(this, 'danger', 'Ошибка регистрации', 'Для регистрации в системе ваш телефон уже должен быть в базе данных')
          } else {
            this.$assets.makeErrorToast(this)
          }
        }).catch (e => {
          this.$assets.makeErrorToast(this)
          console.error(e)
        })
      }
    },
  }
</script>
<style lang="sass" scoped>
  .r-text
    color: #d52b1e
  .b-text
    color: #0039a6
  .success-message
    color: #333
</style>
