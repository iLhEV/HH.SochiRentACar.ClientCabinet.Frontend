<template lang="pug">
cabinetBase(:bcItems="bcItems")
  div(v-if="loaded")
    addDriverModal(ref="addDriverModal" :updateList="loadData")
    editDriverModal(ref="editDriverModalContainer" :updateList="loadData" :driver="modal_driver")
    showDriverModal(ref="showDriverModalContainer" :driver="modal_driver")
    div(v-for="(driver, key) in drivers").driver
      confirmModal(:ref="'confirmDriverDeleteModal_' + driver.id" :key="driver.id" :confirmAction="deleteDriver")
        template(v-slot:body)
          | {{ $t('Подтвердите удаление водителя') }}
          br
          | {{ driver.last_name + ' ' + driver.first_name }}
      div.signs
        b-link(@click.prevent="showDriver(driver.id)").eye
        b-link(@click.prevent="editDriver(driver.id)").note
        b-link(@click="confirmDeleteDriver(driver.id)").minus
      b-row
        b-col(sm="12").name
          div.driver-name-container
            | {{ driver.last_name + ' ' + driver.first_name }}
    div.driver
      b-link(@click="addDriver()").plus="{{ $t('Добавить водителя') }}"
  div(v-else)
    loader
</template>
<script>
import cabinetBase from "~/components/clientAccount/cabinetBase";
import addDriverModal from "~/components/clientAccount/addDriverModal";
import confirmModal from "~/components/clientAccount/confirmModal";
import editDriverModal from "~/components/clientAccount/editDriverModal";
import showDriverModal from "~/components/clientAccount/showDriverModal";
import loader from "~/components/loader";
import { mapGetters } from 'vuex';
export default {
  components: {
    cabinetBase,
    addDriverModal,
    confirmModal,
    editDriverModal,
    showDriverModal,
    loader
  },
  data() {
    return {
      loaded: false,
      drivers: null,
      modal_driver: { first_name: "", middle_name: "", last_name: "", phone: "", email: "", passport_blob: "", driver_license_blob: "" },
      bcItems: [
        {
          text: this.$t('Личный кабинет'),
          to: { name: this.$assets.prefix('account-client_id', this.$i18n.locale), params: {client_id: this.$route.params.client_id} }
        },
        {
          text: this.$t('Мои водители'),
          active: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['axios_config'])
  },
  mounted(){
    this.$assets.checkClientAuth(this)
    this.loadData()
  },
  methods: {
    loadData () {
      this.$axios.get('drivers/', this.axios_config).then(res => {
        if(res.data.status === 'success'){
          this.drivers = res.data.data
          this.loaded = true
        } else {
          this.$assets.makeErrorToast(this, res.data.status)
        }
      }).catch (e => {
          this.$assets.makeErrorToast(this, e)
      })
    },
    addDriver() {
      this.$refs['addDriverModal'].$refs['addDriverModal'].show()
    },
    confirmDeleteDriver(driver_id) {
      this.$refs['confirmDriverDeleteModal_' + driver_id][0].$refs['clientAccountConfirmModal'].show()
    },
    editDriver(driver_id) {
      this.$axios.get('drivers/' + driver_id + '/', this.axios_config).then((res) => {
        if (res.data.status === 'success') {
          this.modal_driver = res.data.data
          this.$refs['editDriverModalContainer'].$refs['editDriverModal'].show()
        } else {
          this.$assets.makeErrorToast(this, res.data.status)
        }
      }).catch((e) => {
        this.$assets.makeErrorToast(this, e)
      })
    },
    showDriver(driver_id) {
      this.$axios.get('drivers/' + driver_id + '/', this.axios_config).then((res) => {
        if (res.data.status === 'success') {
          this.modal_driver = res.data.data
          this.$refs['showDriverModalContainer'].$refs['showDriverModal'].show()
        } else {
          this.$assets.makeErrorToast(this, res.data.status)
        }
      }).catch((e) => {
        this.$assets.makeErrorToast(this, e)
      })
    },
    deleteDriver(driver_id) {
      let config = this.axios_config
      config.params = {
        driver_id: driver_id
      }
      this.$axios.delete('drivers/delete', config).then(res => {
        if (res.data.status === 'success') {
          this.$assets.makeTranslatedToast(this, 'success', 'Статус', 'Водитель успешно удалён')
          this.loadData()
        } else {
          this.$assets.makeErrorToast(this, res.data.status)
        }
      }).catch (e => {
          this.$assets.makeErrorToast(this, e)
      })
    },
  },
}
</script>
<style lang="sass" scoped>
.max
  max-width: 445px
.driver
  position: relative
  max-width: 445px
  min-height: 40px
  margin-bottom: 20px
  padding: 8px 20px
  border-radius: 5px
  background: #FFF9F3
  font-size: 1.25rem
  font-weight: 700
  color: #000
.driver-name-container
  width: calc(100% - 110px)
.signs
  z-index: 1000
  position: absolute
  display: flex
  right: 20px
  top: 10px
.eye, .note, .minus, .plus
  display: block
  background-repeat: no-repeat
.eye
  width: 28px
  height: 19px
  margin-top: 2px
  background: url('/icons/eye.svg')
.note
  width: 22px
  height: 24px
  margin-left: 12px
  background: url('/icons/note.svg')
.minus
  width: 22px
  height: 22px
  margin-top: 1px
  margin-left: 12px
  background: url('/icons/minus.svg')
.plus
  padding-left: 35px
  height: 22px
  background: url('/icons/plus.svg')
  background-repeat: no-repeat
  font-size: 0.95rem
  color: black
  font-weight: 500
.name
  @media(max-width: 375px)
    flex-basis: 125px
</style>
