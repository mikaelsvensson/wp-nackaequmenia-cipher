(function () {

  CipherUtils = {
    setInputError: function ($el, msg) {
      $el.toggleClass('cipher-formfield-error', true).attr('title', msg)
    },
    clearInputError: function ($el) {
      $el.toggleClass('cipher-formfield-error', false).attr('title', '')
    },
    handleInputError: function ($el, valid, msg) {
      if (!valid) {
        this.setInputError($el, msg)
      } else {
        this.clearInputError($el)
      }
    }
  }

})()
