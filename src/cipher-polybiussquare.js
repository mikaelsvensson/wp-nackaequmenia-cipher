(function () {

  var $ = jQuery

  PolybiussquareCipher = function (formElement, outputElement) {
    this.symbols = 'ABCDEFGHIJKLMNOPRSTUVYÅÄÖ'
    this.cipherContainer = $(document.createElement('div'))

    this.inputField = $('<input size="50" type="text" />').keyup(this, this._keyUpHandler)
    this.word1Field = $('<input size="7" type="text" />').keyup(this, this._cfgKeyUpHandler).val('SCOUT')
    this.word2Field = $('<input size="7" type="text" />').keyup(this, this._cfgKeyUpHandler).val('scout')

    var td1_2 = document.createElement('td')
    this.word1Field.appendTo(td1_2)

    var td2_1 = document.createElement('td')
    this.word2Field.appendTo(td2_1)

    var td2_2 = document.createElement('td')
    this._translationTableElement = $(document.createElement('div'))
    this._translationTableElement.appendTo(td2_2)

    var tr1 = document.createElement('tr')
    tr1.appendChild(document.createElement('td'))
    tr1.appendChild(td1_2)

    var tr2 = document.createElement('tr')
    tr2.appendChild(td2_1)
    tr2.appendChild(td2_2)

    var t = document.createElement('table')
    t.appendChild(tr1)
    t.appendChild(tr2)

    formElement.append(
      $(document.createElement('p')).text('Text att kryptera: ').append(this.inputField),
      $(document.createElement('p')).text('Översättningstabell: ').append(t),
      $(document.createElement('p')).text('Krypterad text: ').append(this.cipherContainer)
    )

    this._drawTranslationTable()
  }

  PolybiussquareCipher.prototype._drawTranslationTable = function () {
    var table = ['<table><tbody><td></td>']
    var word1 = this.word1Field.val()
    var word2 = this.word2Field.val()

    for (var x = 0; x < 5; x++) {
      table.push('<th>' + word1.charAt(x) + '</th>')
    }
    for (var y = 0; y < 5; y++) {
      table.push('<tr>')
      table.push('<th>' + word2.charAt(y) + '</th>')
      for (var x = 0; x < 5; x++) {
        table.push('<td>' + this.symbols.charAt(y * 5 + x) + '</td>')
      }
      table.push('</tr>')
    }
    table.push('</tbody></table>')

    this._translationTableElement.html(table.join(''))
  }

  PolybiussquareCipher.prototype._keyUpHandler = function (event) {
    var that = event.data
    that._encrypt(this.value)
  }

  PolybiussquareCipher.prototype._cfgKeyUpHandler = function (event) {
    var that = event.data
    that._drawTranslationTable()
    that._encrypt(that.inputField.val())
  }

  PolybiussquareCipher.prototype._validateEncryptionKeyPart = function (word) {
    if (word.length === 5) {
      var chars = {}
      for (var i in word) {
        if (chars[word[i]]) {
          return false
        }
        else {
          chars[word[i]] = true
        }
      }
      return true
    }
    else {
      return false
    }
  }

  PolybiussquareCipher.prototype._encrypt = function (text) {

    var word1 = this.word1Field.val()
    var word2 = this.word2Field.val()

    var word1Valid = this._validateEncryptionKeyPart(word1)
    var word2Valid = this._validateEncryptionKeyPart(word2)
    var inputValid = true

    var result = ''
    if (word1Valid && word2Valid) {
      for (var i = 0; i < text.length; i++) {
        var c = text.toUpperCase().charAt(i)
        if (c === ' ') {
          result += ' '
        }
        else {
          var offset = this.symbols.indexOf(c)
          if (offset >= 0) {
            var word1pos = offset % 5
            var word2pos = Math.floor(offset / 5)

            result += word1.charAt(word1pos) + word2.charAt(word2pos) + ' '
          }
          else {
            inputValid = false
          }
        }
      }
    }

    CipherUtils.handleInputError(this.word1Field, word1Valid, 'Ordet måste vara exakt 5 bokstäver långt och varje bokstav får bara förekomma en gång.')
    CipherUtils.handleInputError(this.word2Field, word2Valid, 'Ordet måste vara exakt 5 bokstäver långt och varje bokstav får bara förekomma en gång.')
    CipherUtils.handleInputError(this.inputField, inputValid, 'Texten innehåller bokstäver/tecken som inte kan översättas.')

    this.cipherContainer.text(result)
  }

  $('.cipher-polybiussquare').each(function () {new PolybiussquareCipher($(this))})
})()