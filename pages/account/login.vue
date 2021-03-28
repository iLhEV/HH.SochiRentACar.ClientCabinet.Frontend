<template lang="pug">
  section#personal
    devider
    main.py-3
      div.container
        BreadCrumbs(:items="bcItems")
        h1="{{ $t('lk11') }}"
        b-row
          b-col(sm="12" md="6" lg="6")
            b-form(v-if="!$store.state.client_authenticated")
              b-form-group.mb-0.py-2
                vue-phone-number-input(@input="onPhoneChange" ref="phoneInput" v-model="ph" :clearable="true" :translations="{countrySelectorLabel: $t('contacts6'),countrySelectorError: $t('contacts7'),phoneNumberLabel: $t('contacts8'),example: $t('contacts9')}")
              b-form-group.mb-0.py-2
                b-form-input(v-model="password" type="password" :placeholder="$t('lk9')")
              b-form-group.mb-0.py-2
                b-button(type="submit" @click.prevent="clientLogin").btn.main.w-100.text-uppercase
                  | {{ $t('lk8') }}
              hr
              b-row
                b-col(sm="12" md="6" lg="6").text-center
                  nuxt-link(:to="{name: $assets.prefix('account-registration', $i18n.locale)}")="{{ $t('lk12') }}"
                b-col(sm="12" md="6" lg="6").text-center
                  nuxt-link(:to="{name: $assets.prefix('account-renew_password', $i18n.locale)}")="{{ $t('lk13') }}"
            div(v-else)
              |   {{ $t('lk_msg7') }}.
          b-col(sm="12" md="6" lg="6").my-0.my-sm-3.my-md-0.my-lg-0
            h5
              | Добро пожаловать в
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
            p.my-2="Автомобиль будет ждать Вас в отведенном месте на парковке."
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
        phone: '',
        password: '',
        ph: '',
        bcItems: [
          {
            text: this.$t('breadcrumbs1'),
            to: { name: this.$assets.prefix('index', this.$i18n.locale) }
          },
          {
            text: this.$t('lk8'),
            active: true
          }
        ],
      }
    },
    mounted() {
      if(this.$store.state.reg_phone) this.ph = this.$store.state.reg_phone
    },
    computed: {
    },
    methods: {
      onPhoneChange() {
        this.phone = this.$refs.phoneInput.phoneFormatted
      },
      clientLogin() {
        const device_token = localStorage.getItem("client_device_token") === null ? this.$assets.randomString(60) : window.localStorage.client_device_token;
        localStorage.setItem('client_device_token', device_token)
        this.$axios.post('auth-client/login', {
          phone: this.phone,
          password: this.password,
          device_token: device_token
        }).then(res => {
          if (res.data.status === 'success') {
            const token = res.data.token
            this.$axios.get('auth-client/client', {
              headers: { Authorization: `Bearer ${token}` }
            }).then(res1 => {
              //Получаю данные клиента
              if(res1.data.status === 'success'){
                const client = res1.data.data
                this.$store.dispatch('loginClient', { client: client, token: token, device_token: device_token })
                this.$router.push({ name: this.$assets.prefix('account-client_id', this.$i18n.locale), params: { client_id: client.id } })
              }else{
                this.$assets.makeErrorToast(this)
                return;
              }
            }).catch((e1) => {
              this.$assets.makeErrorToast(this)
              console.error(e1)
            })
          } else if (res.data.status === 'client_not_found'){
            this.$assets.makeTranslatedToast(this, 'danger', 'Ошибка авторизации', 'Введённые учётные данные не найдены')
          } else {
            this.$assets.makeErrorToast(this)
          }
        }).catch ((e) => {
          this.$assets.makeErrorToast(this, e)
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  .r-text
    color: #d52b1e
  .b-text
    color: #0039a6
</style>
