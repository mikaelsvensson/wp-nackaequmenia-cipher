(function () {

  var $ = jQuery

  PigpenCipher = function (formElement) {
    this.inputField = $('<input size="50" />').keyup(this, this._keyUpHandler)

    this.cipherContainer = $(document.createElement('div'))

    formElement.append(
      $(document.createElement('p')).text('Text att kryptera: ').append(this.inputField),
      $(document.createElement('p')).text('Krypterad text: ').append(this.cipherContainer)
    )
  }

  PigpenCipher.prototype._keyUpHandler = function (event) {
    var that = event.data
    that._encrypt(this.value)
  }

  PigpenCipher.prototype._encrypt = function (text) {
    var symbols = 'ABCDEFGHIJKLMNOPRSTUVXYZÅÄÖ'
    this.cipherContainer.text('')
    var spaceDetected = false
    var inputValid = true
    for (var i = 0; i < text.length; i++) {
      var c = text.toUpperCase().charAt(i)
      if (c === ' ') {
        spaceDetected = true
      }
      else {
        var offset = symbols.indexOf(c)
        if (offset >= 0) {
          var el = document.createElement('img')
          el.src = 'http://www.nackasmu.se/tools/cipher/pigpen-symbol-' + (offset + 1) + '.gif'
          if (spaceDetected) {
            el.style.marginLeft = '40px'
            spaceDetected = false
          }
          this.cipherContainer.append(el)
        }
        else {
          inputValid = false
        }
      }
    }
    this.inputField.toggleClass('cipher-formfield-error', !inputValid).attr('title', inputValid ? '' : 'Texten innehåller bokstäver/tecken som inte kan översättas.')
  }

  $('.cipher-pigpen').each(function () {new PigpenCipher($(this))})
})()