<template lang="pug">
  div
    b-modal(ref="editDriverModal")#edit_driver_modal.pa-trip-detail
      div(slot="modal-footer")
      h1.main {{ $t('Редактировать водителя') }}
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
        vue-phone-number-input(@input="onPhoneChange" ref="phoneInput" v-model="driver.phone" :clearable="true" :translations="{countrySelectorLabel: $t('contacts6'),countrySelectorError: $t('contacts7'),phoneNumberLabel: $t('contacts8'),example: $t('contacts9')}")
        div.err {{ validation.phone }}
      b-form-group(:label="$t('lk_driver4')")
        b-input(v-model="driver.email" :placeholder="$t('contacts10')").text
        div.err {{ validation.email }}
        //- span.approved {{ $t('lk_driver6') }}
        b-link.not-approved
      //- Добавление файла паспорта
      b-form-group(:label="$t('lk_driver1')")
        b-form-file(v-model="passport_file" id="passport_file" @input="checkFileSize('passport_file')").hidden
        div(v-if="passport_file.name").document-name="{{ passport_file.name }}"
        div(v-else).document-name="{{ $t('Фото загружено') }}"
        div.document-link
          b-link(@click="open_file_load('passport_file')").upload {{ $t('изменить') }}
        div.err {{ validation.passport_file }}
      //- Добавление файла водительского удостоверения
      b-form-group(:label="$t('lk_driver2')")
        b-form-file(v-model="driver_license_file" id="driver_license" @input="checkFileSize('driver_license_file')").hidden
        div(v-if="driver_license_file.name").document-name="{{ driver_license_file.name }}"
        div(v-else).document-name="{{ $t('Фото загружено') }}"
        div.document-link
          b-link(@click="open_file_load('driver_license')").upload {{ $t('изменить') }}
        div.err {{ validation.driver_license_file }}
      b-row.mt-2.justify-content-start
        b-col.pb-4.mr-2
          b-button(@click="close_modal").btn-rev {{ $t('Закрыть') }}
        b-col
          b-button(@click="applyChanges") {{ $t('lk_button2') }}
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: "editDriverModal",
  props: {
    updateList: Function,
    driver: Object,
  },
  data() {
    return {
      validation: { first_name: "", middle_name: "", last_name: "", phone: "", email: "", passport_file: "",  driver_license_file: "" },
      passport_file: [],
      driver_license_file: [],
      names_reg: /^[а-яА-ЯЁёa-zA-Z\s]{0,100}$/,
      file_size_limit: 2
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
    email() {
      return this.driver.email
    }
  },
  watch: {
    first_name(val){
      this.checkNameField('first_name')
    },
    middle_name(val){
      this.checkNameField('middle_name')
    },
    last_name(val){
      this.checkNameField('last_name')
    },
    email(val){
      if(this.driver.email !== "") this.validation.email = ""
    }
  },
  mounted() {
    this.$assets.checkClientAuth(this)
  },
  methods: {
    open_file_load(id) {
      document.getElementById(id).click()
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
    onPhoneChange() {
      if(this.driver.phone !== "") this.validation['phone'] = ''
    },
    close_modal() {
      this.$refs.editDriverModal.hide()
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      })
    },
    async applyChanges(){
      //Проверка заполнения полей
      if(!this.checkFields()) return false
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
      this.driver.phone = this.$refs.phoneInput.phoneFormatted
      this.$axios.put('drivers/' + this.driver.id, { driver: this.driver }, this.axios_config).then (resp => {
          if(resp.data.status === 'success'){
            this.updateList()
            this.$assets.makeTranslatedToast(this, 'success', 'Статус', 'Изменения успешно сохранены')
            this.close_modal()
          } else if (resp.data.status === 'error_data_other_driver_has_same_phone') {
            this.$assets.makeTranslatedToast(this, 'danger', 'Ошибка', 'Другой водитель с таким телефоном уже зарегистрирован в системе')
          } else {
            this.$assets.makeTranslatedToast(this, 'danger', 'Ошибка', 'Неизвестная ошибка')
          }
        }).catch ((err) => {
          this.$assets.makeTranslatedToast(this, 'danger', 'Ошибка', 'Непредвиденная ошибка')
          console.log(err)
        })
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
      if(Array.isArray(this[v_model_name])){
        this.validation[v_model_name] = this.$t(messages[v_model_name])
        return false
      } else {
        this.validation[v_model_name] = ""
        return true
      }
    },
    checkFields(){
      let check_ok = true
      //Проверка общих текстовых полей
      const text_fields = {
        phone: 'Телефон не может быть пустым',
        email: 'Email не может быть пустым'
      }
      for (let prop_name in text_fields) {
        if (!this.driver[prop_name]) {
          this.validation[prop_name] = this.$t(text_fields[prop_name])
          check_ok = false
          continue
        }
        this.validation[prop_name] = ""
      }
      //Проверка полей имён
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
        if(!Array.isArray(this[v_model_name])) {
          if(!this.checkFileSize(v_model_name)) check_ok = false
        }
      })
      return check_ok
    }
  }
}
</script>
<style lang="sass" scoped>
h1.main
  font-size: 2rem
  margin-bottom: 20px
.file
  padding-right: 15px
.upload, .approved, .not-approved
  font-size: 0.875rem
.upload
  padding-left: 0
.approved
  color: #3E424C
.text
  display: inline
  max-width: 255px
  margin-right: 12px
  margin-bottom: 10px
.err
  padding-top: 3px
  font-size: 0.75rem
  color: red
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
<style lang="sass">
#edit_driver_modal
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
