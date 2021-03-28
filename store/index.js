import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = () => new Vuex.Store({
  state: {
    searchForm: {},
    reg_phone: false,
    client: {},
    client_authenticated: 0,
    client_token: false,
    axios_config: {}
  },
  getters: {
    searchForm(state){
      return state.searchForm
    },
    client(state){
      if (state.client_authenticated){
        return state.client
      }else{
        return null
      }
    },
    axios_config(state){
      return {
        headers: {
          Authorization: `Bearer ${state.client_token}`
        }
      }
    }
  },
  mutations: {
    setSearchForm (state, formData) {
      state.searchForm = formData
    },
    loginClient(state, data) {
      state.client = data.client;
      state.client_authenticated = true;
      state.client_token = data.token
    },
    logoutClient(state) {
      state.client_authenticated = false;
      state.client = {};
    },
    initializeStore(state) {
      process.browser ? state.client_token = window.localStorage.getItem('client_token') : undefined;
    },
    updateClient(state, data) {
      state.client = data
    }
  },
  actions: {
    setSearchForm({ commit, state }, formData){
      commit('setSearchForm', formData);
    },
    loginClient({commit}, data){
      commit('loginClient', {client: data.client, token: data.token})
      localStorage.setItem('client_token', data.token)
      localStorage.setItem('client_device_token', data.device_token)
      localStorage.setItem('client', JSON.stringify(data.client))
      localStorage.setItem('client_authenticated', true)
    },
    logoutClient({commit}){
      commit('logoutClient')
      localStorage.removeItem('client_token')
      localStorage.removeItem('client')
      localStorage.removeItem('client_authenticated')
    },
    updateClient({commit, getters}) {
      let nuxt = window.$nuxt
      console.log(nuxt)
      nuxt.$axios.get('auth-client/client', getters.axios_config).then(res => {
        //Получаю данные клиента
        if(res.data.status === 'success'){
          commit('updateClient', res.data.data)
        }else{
          nuxt.$assets.makeErrorToast(nuxt)
          return;
        }
      }).catch(e => {
        nuxt.$assets.makeErrorToast(nuxt)
      })
    }
  },
});

export default store
