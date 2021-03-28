<template lang="pug">
  section#personal
    devider
    main.py-3
      div.container
        BreadCrumbs(:items="bcItems")
        h1="{{ $t('lk15') }}"
        b-row
          b-col(sm="12" md="6" lg="6")
            b-form
              b-form-group.mb-0.py-2
                b-form-input(v-model="login" :placeholder="$t('lk16')")
              b-form-group.mb-0.py-2
                b-button(type="submit").btn.main.w-100.text-uppercase
                  | {{ $t('lk17') }}
              hr
              b-row
                b-col(sm="12" md="6" lg="6").text-center
                  nuxt-link(:to="{name: $assets.prefix('account-registration', $i18n.locale)}")="{{ $t('lk12') }}"
                b-col(sm="12" md="6" lg="6").text-center
                  nuxt-link(:to="{name: $assets.prefix('account-login', $i18n.locale)}")="{{ $t('lk8') }}"
          b-col(sm="12" md="6" lg="6").my-0.my-sm-3.my-md-0.my-lg-0
            h5
              |Добро пожаловать в
              b.mx-2.text-nowrap
                span.b-text="AUTOPILOT"
                span="."
                span.r-text="LOYALTY"

            p.my-2
              |Зарегистрируйтесь в программе
              b.mx-2.text-nowrap
                span.b-text="AUTOPILOT"
                span="."
                span.r-text="LOYALTY"
              |до того, как решите забронировать автомобиль.
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
        bcItems: [
          {
            text: this.$t('breadcrumbs1'),
            to: { name: this.$assets.prefix('index', this.$i18n.locale) }
          },
          {
            text: this.$t('lk15'),
            active: true
          }
        ],
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
