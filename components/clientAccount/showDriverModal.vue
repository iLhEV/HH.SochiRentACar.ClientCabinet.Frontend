<template lang="pug">
  div
    b-modal(ref="showDriverModal")#show_driver_modal.pa-trip-detail
      div(slot="modal-footer")
      h1.main {{ $t('Карточка водителя') }}
      b-form-group(:label="$t('lk_settings3')")
        | {{ driver.first_name }}
      b-form-group(:label="$t('lk_settings4a')")
        | {{ driver.middle_name }}
      b-form-group(:label="$t('lk_settings4')")
        | {{ driver.last_name }}
      b-form-group(:label="$t('lk_driver3')")
        | {{ $assets.formatPhone(driver.phone) }}
      b-form-group(:label="$t('lk_driver4')")
        | {{ driver.email }}
      //- Добавление файла паспорта
      b-form-group(:label="$t('lk_driver1')")
        | {{ $t('Фото загружено') }}
      //- Добавление файла водительского удостоверения
      b-form-group(:label="$t('lk_driver2')")
        | {{ $t('Фото загружено') }}
      b-row.mt-2.justify-content-start
        b-col.pb-4.mr-2.mt-3
          b-button(@click="close_modal").btn-rev {{ $t('Закрыть') }}
</template>
<script>
export default {
  name: "showDriverModal",
  props: {
    driver: Object,
  },
  mounted() {
    this.$assets.checkClientAuth(this)
  },
  methods: {
    close_modal() {
      this.$refs.showDriverModal.hide()
    },
  }
}
</script>
<style lang="sass" scoped>
h1.main
  font-size: 2rem
  margin-bottom: 20px
</style>
<style lang="sass">
#show_driver_modal
  .col-form-label
    font-size: 1rem
    color: #B7B7B7
  .modal-body
    padding-left: 40px
    padding-right: 40px
  .modal-header
    padding: 10px
    border-bottom: 0 none
  .modal-footer
    border-top: 0 none
  .col-form-label
    padding-bottom: 2px
</style>
