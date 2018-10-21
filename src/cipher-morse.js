(function () {

  var $ = jQuery

  MorseCode = function (formElement) {
    this.baseUrl = formElement.get(0).dataset.baseUrl

    this.inputField = $('<input size="50" />').keyup(this, this._keyUpHandler)

    this.cipherContainer = $(document.createElement('div'))

    formElement.append(
      $(document.createElement('p')).text('Text att kryptera: ').append(this.inputField),
      $(document.createElement('p')).text('Krypterad text: ').append(this.cipherContainer)
    )
  }

  MorseCode.prototype._keyUpHandler = function (event) {
    var that = event.data
    that._encrypt(this.value)
  }

  MorseCode.prototype._encrypt = function (text) {
    var symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
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
          if (offset < 9) {
            el.src = this.baseUrl + 'morse-symbol-0' + (offset + 1) + '.gif'
          }
          else {
            el.src = this.baseUrl + 'morse-symbol-' + (offset + 1) + '.gif'
          }
          el.style.display = 'block'
          el.style.marginTop = spaceDetected ? '20px' : '5px'
          if (spaceDetected) {
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

  $('.cipher-morse').each(function () {new MorseCode($(this))})
})()