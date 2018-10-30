(function () {

  var $ = jQuery

  CaesarCipher = function (formElement) {
    this.inputField = $('<input size="50" type="text" />').keyup(this, this._keyUpHandler)
    this.offsetField = $('<input size="5" type="number" />').keyup(this, this._cfgKeyUpHandler).val(1)

    var select = document.createElement('select')
    select.appendChild(new Option('ABCDEFGHIJKLMNOPQRSTUVXYZÅÄÖ'))
    select.appendChild(new Option('ABCDEFGHIJKLMNOPQRSTUVXYZÅÄÖ0123456789'))
    select.appendChild(new Option('ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ'))
    select.appendChild(new Option('ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789'))

    this.symbolsField = $(select).change(this, this._cfgKeyUpHandler)

    this._translationTableElement = $(document.createElement('div'))
    this.cipherContainer = $(document.createElement('div'))

    formElement.append(
      $(document.createElement('p')).text('Alfabete: ').append(this.symbolsField),
      $(document.createElement('p')).text('Förskjutning: ').append(this.offsetField),
      $(document.createElement('p')).text('Översättningstabell som kommer användas: ').append(this._translationTableElement),
      $(document.createElement('p')).text('Text att kryptera: ').append(this.inputField),
      $(document.createElement('p')).text('Krypterad text: ').append(this.cipherContainer)
    )

    this._drawTranslationTable()
  }

  CaesarCipher.prototype._drawTranslationTable = function () {
    var offset = parseInt(this.offsetField.val(), 10)
    var table = ['<table><tbody><tr>']
    var symbols = this.symbolsField.val()

    for (var i = 0; i < symbols.length; i++) {
      table.push('<td>' + symbols.charAt(i) + '</td>')
    }
    table.push('</tr>')
    table.push('<tr><td>&darr;</td></tr>')
    table.push('<tr>')
    for (var i = 0; i < symbols.length; i++) {
      var translatedPos = (symbols.length + offset + i) % symbols.length
      table.push('<td>' + symbols.charAt(translatedPos) + '</td>')
    }
    table.push('</tr></tbody></table>')

    this._translationTableElement.html(table.join(''))
  }

  CaesarCipher.prototype._keyUpHandler = function (event) {
    var that = event.data
    that._encrypt(this.value)
  }

  CaesarCipher.prototype._cfgKeyUpHandler = function (event) {
    var that = event.data
    that._drawTranslationTable()
    that._encrypt(that.inputField.val())
  }

  CaesarCipher.prototype._encrypt = function (text) {
    var symbols = this.symbolsField.val()
    var offset = parseInt(this.offsetField.val(), 10)

    var validOffset = !isNaN(offset)
    var inputValid = true

    var result = ''
    for (var i = 0; i < text.length; i++) {
      var c = text.toUpperCase().charAt(i)
      if (c === ' ') {
        result += ' '
      }
      else {
        var pos = symbols.indexOf(c)
        if (pos >= 0) {
          result += symbols.charAt((symbols.length + offset + pos) % symbols.length)
        }
        else {
          inputValid = false
        }
      }
    }

    CipherUtils.handleInputError(this.offsetField, validOffset, 'Inte ett giltigt heltal.')
    CipherUtils.handleInputError(this.inputField, inputValid, 'Texten innehåller bokstäver/tecken som inte finns i valt alfabete.')

    this.cipherContainer.text(result)
  }

  $('.cipher-caesar').each(function () {new CaesarCipher($(this))})
})()