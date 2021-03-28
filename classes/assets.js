Date.prototype.addDays = function(days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

class Assets {
  prepareNumber = (val) => {
    return val.toLocaleString('ru')
  }

  checkClientAuth = (vue) => {
    if(!window.localStorage.client_authenticated) { throw({statusCode: 500}) }
    const client = JSON.parse(window.localStorage.getItem('client'))
    if(vue.$route.params.client_id != client.id) { throw({statusCode: 500}) }
  }

  randomString = (len, charSet) => {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
  }

  makeTranslatedToast = (vue, variant, title, text) => {
    vue.$bvToast.toast(vue.$t(text), {
      title: vue.$t(title),
      variant: variant,
      solid: true
    });
  }

  makeErrorToast = (vue, e = null) => {
    this.makeTranslatedToast(vue, 'danger', 'error', 'operation_error')
    if (e) console.error(e)
  }

  formatPhone = (input) => {
    return input.substring(0, 2) + ' (' + input.substring(2, 5) + ') ' + input.substring(5, 8) + ' ' + input.substring(8)
  }

  getNameSpecBiling(count, locale, word1, word2, word3, word4, word5){
    let word;
    let n = parseInt(count)
    if(locale === 'ru'){
      return this.getNameSpec(n, word1, word2, word3)
    }else if(n === 1){
      return word4
    }else{
      return word5
    }
  };

  getNameSpec(count, word1, word2, word3){
    let word;
    let n = parseInt(count)
    if ((n === 1) || (n > 20 && n % 10 === 1)) word = word1;
    else if ((n >= 2 && n <= 4) || (n > 20 && n % 10 >= 2 && n % 10 <= 4)) word = word2;
    else word = word3;
    return word;
  };
}

export default Assets
