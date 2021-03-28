<template lang="pug">
div
  div.label {{ label }}
  div.bar
    div(:id="'goalProgressBar' + $vnode.key").ribbon
    div.small-label-1
      | {{ from }}
    div.small-label-2
      | {{ to }}
    div#percent.percent
      | {{ percent_current }}%

</template>
<script>
export default {
  name: "goalProgressBar",
  props: {
    label: String,
    from: String,
    to: String,
    percent: Number
  },
  data() {
    return {
    }
  },
  computed: {
    percent_current() {
      return (this.percent > 100 ? 100 : this.percent)
    }
  },
  mounted() {
    this.update_ribbon()
  },
  watch: {
    percent: function() {
      this.update_ribbon()
    }
  },
  methods: {
    update_ribbon: function() {
      let ribbon = document.getElementById('goalProgressBar' + this.$vnode.key)
      ribbon.style.width = this.percent_current + "%"
      if (ribbon.offsetParent.offsetWidth - ribbon.offsetWidth <=5) {
        ribbon.style.borderTopRightRadius = "10px"
        ribbon.style.borderBottomRightRadius = "10px"
      }
    }
  }
}
</script>
<style lang="sass" scoped>
@import '~/assets/styles/variables'

.label
  font-size: 1rem
  color: black
  position: relative
  padding-left: 11px
.label::before
  color: #FD811E
  content: "\2022"
  font-size: 1rem
  font-weight: 700
  left: 0
  top: 3px
  line-height: 18px
  position: absolute
.bar
  position: relative
  // overflow: hidden
  height: 43px
  margin-top: 2px
  border: 1px solid #FD811E
  border-radius: 10px
  font-size: 1.125rem
  font-weight: 500
.small-label-1
  z-index: 10
  position: absolute
  top: 6px
  left: 10px
.small-label-2
  z-index: 10
  position: absolute
  top: 6px
  right: 10px
.ribbon
  $width: 20px
  z-index: 9
  position: absolute
  box-sizing: padding-box
  border-top-left-radius: 10px
  border-bottom-left-radius: 10px
  padding-left: 0
  padding-top: 6px
  width: $width
  height: 100%
  background: #FFEADA
.percent
  z-index: 10
  position: absolute
  top: 6px
  width: 100%
  text-align: center
  font-weight: bold
</style>
