<template lang="pug">
  b-modal(ref="clientAccountConfirmModal")#client_account_confirm_modal
    div(slot="modal-footer")
      b-button(@click="close_modal").btn-rev.cancel Отмена
      b-button(@click="confirm_modal").btn Удалить
    slot(name="body")
</template>
<script>
export default {
  name: 'clientAccountConfirmModal',
  props: [
    'confirmAction'
  ],
  methods: {
    close_modal() {
      this.$refs['clientAccountConfirmModal'].hide()
    },
    confirm_modal() {
      this.confirmAction(this.$vnode.key)
    }
  }
}
</script>
<style lang="sass" scoped>
.btn-rev
  margin-right: 30px !important
</style>
<style lang="sass">
#client_account_confirm_modal
  .col-form-label
    font-size: 1rem
    color: #B7B7B7
  .modal-body
    padding-left: 40px
    padding-right: 40px
    text-align: center
  .modal-header
    padding: 10px
    border-bottom: 0 !important
  .modal-footer
    border-top: 0 !important
    div
      margin: 0 auto 30px
  .col-form-label
    padding-bottom: 2px
  .modal-dialog
    margin-top: 40%
</style>
