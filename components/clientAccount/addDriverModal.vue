<template lang="pug">
  b-modal(ref="addDriverModal")#user_driver_detail_modal.pa-trip-detail
    div(slot="modal-footer")
    h1.main {{ $t('lk_add_driver') }}
    div(v-if="modal_mode")
      b-form-group(:label="$t('lk_settings3')")
        b-input(v-model='driver.first_name' :placeholder="$t('lk_settings1')" trim)
        div.err {{ validation.first_name }}
      b-form-group(:label="$t('lk_settings4a')")
        b-input(v-model='driver.middle_name' :placeholder="$t('lk_settings1a')" trim)
        div.err="{{ validation.middle_name }}"
      b-form-group(:label="$t('lk_settings4')")
        b-input(v-model='driver.last_name' :placeholder="$t('lk_settings2')" trim)
        div.err {{ validation.last_name }}
      b-form-group(:label="$t('lk_driver3')")
        vue-phone-number-input(@input="onPhoneChange" ref="phoneInput" v-model="driver.ph" :clearable="true" :translations="{countrySelectorLabel: $t('contacts6'),countrySelectorError: $t('contacts7'),phoneNumberLabel: $t('contacts8'),example: $t('contacts9')}")
        div.err {{ validation.ph }}
      b-form-group(:label="$t('lk_driver4')")
        b-input(v-model="driver.email" :placeholder="$t('contacts10')")
        div.err {{ validation.email }}
        //- span.approved {{ $t('lk_driver6') }}
      //- Добавление файла паспорта
      b-form-group(:label="$t('lk_driver1')")
        b-form-file(v-model="passport_file" id="passport_file" @input="checkFileSize('passport_file')").hidden
        div(v-if="passport_file").document-name="{{ passport_file.name }}"
        div.document-link
          b-link(@click="open_file_load('passport_file')").upload {{ $t('загрузить') }}
        div.err {{ validation.passport_file }}
      //- Добавление файла водительского удостоверения
      b-form-group(:label="$t('lk_driver2')")
        b-form-file(v-model="driver_license_file" id="driver_license" @input="checkFileSize('driver_license_file')").hidden
        div(v-if="driver_license_file").document-name="{{ driver_license_file.name }}"
        div.document-link
          b-link(@click="open_file_load('driver_license')").upload {{ $t('загрузить') }}
        div.err {{ validation.driver_license_file }}
      b-row.mt-2.justify-content-start
        b-col.pb-4.mr-2
          b-button(@click="confirm_close_modal").btn-rev {{ $t('lk_button4') }}
        b-col
          b-button(@click="createDriver") {{ $t('lk_button6') }}
    div(v-else)
      div.confirm-dialog.mt-4
        | {{ $t("Введённые данные будут удалены")}}
      div.mt-4
        b-row.mt-2.justify-content-start
          b-col.pb-4.mr-2
            b-button(@click="cancel_confirm").btn-rev {{ $t('lk_button7') }}
          b-col
            b-button(@click="close_modal") {{ $t('lk_button8') }}
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: "addDriverModal",
  props: [
    'updateList'
  ],
  data() {
    return {
      driver: {},
      validation: {},
      passport_file: [],
      driver_license_file: [],
      names_reg: /^[а-яА-ЯЁёa-zA-Z\s]{0,100}$/,
      file_size_limit: 2,
      modal_mode: 1
    }
  },
  computed: {
    ...mapGetters(['axios_config']),
    first_name() {
      return this.driver.first_name
    },
    middle_name() {
      return this.driver.middle_name
    },
    last_name() {
      return this.driver.last_name
    },
    phone() {
      return this.driver.phone
    },
    ph() {
      return this.driver.ph
    },
    email() {
      return this.driver.email
    }
  },
  watch: {
    first_name(val) {
      this.checkNameField('first_name')
    },
    middle_name(val) {
      this.checkNameField('middle_name')
    },
    last_name(val) {
      this.checkNameField('last_name')
    },
    email(val) {
      if(this.driver.email !== "") this.validation.email = ""
    },
    ph(val) {
      if(this.driver.ph !== "") this.validation.ph = ""
    }
  },
  mounted() {
    this.$assets.checkClientAuth(this)
    this.driver = this.$assets.getDriverObject()
    this.validation = this.$assets.getDriverValidation()
  },
  methods: {
    open_file_load(id) {
      document.getElementById(id).click()
    },
    clean_fields() {
      this.passport_file = []; this.driver_license_file = [];
      this.driver = this.$assets.getDriverObject()
      this.validation = this.$assets.getDriverValidation()
    },
    onPhoneChange() {
      this.driver.phone = this.$refs.phoneInput.phoneFormatted
      if(this.driver.ph) this.validation['phone'] = ''
    },
    confirm_close_modal() {
      let flag = false
      for(let prop in this.validation) {
        if (this.driver[prop] !== "" && this.driver[prop] !== undefined && this.driver[prop] !== null) {
          flag = true
        }
      }
      flag ? this.modal_mode = 0 : this.close_modal()
    },
    cancel_confirm() {
      this.modal_mode = 1
    },
    close_modal() {
      this.$refs.addDriverModal.hide()
      this.clean_fields()
      setTimeout(() => {
        this.modal_mode = 1
      }, 500)
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      })
    },
    async createDriver() {
      //Проверка заполнения полей
      if(!this.checkAllFields()) {
        this.$assets.makeTranslatedToast(this, 'warning', 'Ошибка', 'Проверьте правильность заполнения полей')
        return false
      }
      //Паспорт и водительское удостоверение
      for (let doc_name of ['passport', 'driver_license']) {
        if(!Array.isArray(this[doc_name + '_file'])) {
          try {
            this.driver[doc_name + '_blob'] = await this.toBase64(this[doc_name + '_file'])
          } catch (e) {
            this.$assets.makeErrorToast(this, e)
          }
        }
      }
      this.driver.client_id = this.$route.params.client_id
      this.$axios.post('drivers/create', { driver: this.driver }, this.axios_config)
      .then (res => {
        if(res.data.status === 'success'){
          this.close_modal()
          this.updateList()
          this.$assets.makeTranslatedToast(this, 'success', 'Статус', 'Водитель успешно добавлен')
        } else if(res.data.status === 'error_data_phone_already_exists') {
          this.$assets.makeTranslatedToast(this, 'danger', 'Ошибка', 'Водитель с таким телефоном уже зарегистрирован в системе')
        } else {
          this.$assets.makeErrorToast(this, res.data.status)
        }
      }).catch (e => {
        this.$assets.makeErrorToast(this, e)
      })
    },
    checkAllFields(){
      let check_ok = true
      if (!this.checkFieldsEmptiness()) check_ok = false
      if (!this.checkFieldsLength()) check_ok = false
      //Проверка на соответствие шаблону
      const name_fields = {
        first_name: 'Имя не может быть пустым',
        middle_name: 'Фамилия не может быть пустой',
        last_name: 'Отчество не может быть пустым',
      }
      for (let prop_name in name_fields) {
        if (!this.driver[prop_name]) {
          this.validation[prop_name] = this.$t(name_fields[prop_name])
          check_ok = false
          continue
        }
        if (!this.checkNameField(prop_name)) {
          check_ok = false
          continue
        }
        this.validation[prop_name] = ""
      }
      let file_fields = ['passport_file', 'driver_license_file']
      //Проверка, что файл добавлен и его размер не превышает некоторое число
      file_fields.forEach(v_model_name => {
        if(this.checkFileEmpty(v_model_name)) check_ok = false
        if(!this.checkFileSize(v_model_name)) check_ok = false
      })
      return check_ok
    },
    checkFieldsEmptiness() {
      let check_ok = true
      const fields = {
        ph: 'Телефон не может быть пустым',
        email: 'Email не может быть пустым'
      }
      for (let prop in fields) {
        if (!this.driver[prop]) {
          this.validation[prop] = this.$t(fields[prop])
          check_ok = false
          continue
        }
        this.validation[prop] = ""
      }
      return check_ok
    },
    checkFieldsLength() {
      let check_ok = true
      const fields = [
        {
          prop: 'ph',
          phrase: 'Телефон слишком короткий',
          min_length: 2
        }
      ]
      for (let field of fields) {
        let prop = field.prop
        if (!this.driver[prop]) continue;
        if (this.driver[prop].length < field.min_length) {
          this.validation[prop] = this.$t(field.phrase)
          check_ok = false
          continue
        }
        this.validation[prop] = ""
      }
      return check_ok
    },
    checkNameField(prop_name) {
      if (!this.names_reg.test(this.driver[prop_name])) {
        this.validation[prop_name] = this.$t('lk_msg1')
        return false
      } else {
        this.validation[prop_name] = ''
        return true
      }
    },
    checkFileSize(v_model_name) {
      const messages = {
        passport_file: 'Размер скана паспорта превышает',
        driver_license_file: 'Размер скана водительского удостоверения превышает'
      }
      if(Array.isArray(this[v_model_name]) || this[v_model_name] === null) return false
      if (this[v_model_name].size > (this.file_size_limit * 1000000 + 100000)) {
        this.validation[v_model_name] = this.$t(messages[v_model_name]) + ' ' + this.file_size_limit + this.$t('Мб')
        return false
      } else {
        this.validation[v_model_name] = ""
        return true
      }
    },
    checkFileEmpty(v_model_name) {
      const messages = {
        passport_file: 'Скан паспорта обязателен к добавлению',
        driver_license_file: 'Скан водительского удостоверения обязателен к добавлению'
      }
      if(Array.isArray(this[v_model_name]) || this[v_model_name] === null){
        this.validation[v_model_name] = this.$t(messages[v_model_name])
        return true
      } else {
        this.validation[v_model_name] = ""
        return false
      }
    }
  }
}
</script>
<style lang="sass" scoped>
h1.main
  font-size: 2rem
  margin-bottom: 20px
  margin-top: 15px
.file
  padding-right: 15px
.upload, .approved, .not-approved
  font-size: 0.875rem
.approved
  color: #3E424C
.err
  padding-top: 3px
  font-size: 0.75rem
  color: red
.confirm-dialog
  font-size: 1rem
</style>
<style lang="sass">
#user_driver_detail_modal, #user_driver_success_modal
  .close
    display: none
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
#user_driver_success_modal
  .modal-dialog
    margin-top: 40%
  .modal-body
    text-align: center
  .modal-footer
    div
      margin: 0 auto 30px
.hidden
  display: none
.document-name
  max-width: 100%
  overflow: hidden
  display: inline-block
  padding-right: 20px
  font-size: 0.9rem
  line-height: 0.9rem
.document-link
  display: inline-block
  line-height: 0.9rem
  vertical-align: top
  padding-top: 2px

</style>
