// Read more on https://en.wikipedia.org/wiki/Grille_(cryptography)

(function () {

  var $ = jQuery

  GrilleCipher = function (formElement) {
    this.inputField = $('<input size="50" />').keyup(this, this._keyUpHandler)
    this.keyField = $('<input size="20" />').keyup(this, this._keyUpHandler).val(this._shuffle(this._generateKey(4)))
    this.cipherContainer = $(document.createElement('div'))

    formElement.append(
      $(document.createElement('p')).text('Nyckel: ').append(this.keyField),
      $(document.createElement('p')).text('Text att kryptera: ').append(this.inputField),
      $(document.createElement('p')).text('Krypterad text: ').append(this.cipherContainer)
    )

    // var that = this
    // Array(10).fill(0,0,10).forEach(function (value) { console.log(that._shuffle(that._generateKey(4))) })

    var actual = this._getKeyCoords(['324-15', '--132', '-1'])
    console.log(actual.join('\n'))
    var expected = [
      [' ', ' ', '#', ' ', ' ', ' '],
      ['#', ' ', ' ', ' ', ' ', '#'],
      [' ', ' ', ' ', '#', ' ', ' '],
      [' ', '#', ' ', ' ', ' ', '#'],
      [' ', ' ', '#', ' ', '#', ' '],
      ['#', ' ', ' ', ' ', ' ', ' ']
    ]
    console.log(expected.join('\n'))
  }

  GrilleCipher.prototype._keyUpHandler = function (event) {
    var that = event.data
    that._encrypt(this.value)
  }

  GrilleCipher.prototype._generateKey = function () {
    return this._range(5)
  }

  GrilleCipher.prototype._range = function (n) {
    var values = Array(n)
    while (n) {
      values[n - 1] = n--
    }
    return values
  }

  GrilleCipher.prototype.createMatrix = function (size, defaultValue) {
    var result = []
    for (var y = 0; y < size; y++) {
      result[y] = []
      for (var x = 0; x < size; x++) {
        result[y][x] = defaultValue
      }
    }
    return result
  }
  GrilleCipher.prototype._getKeyCoords = function (circularCoords) {
    var size = circularCoords.length * 2

    var result = this.createMatrix(size, ' ')

    var char = 65

    console.log(result)

    for (var i = 0; i < circularCoords.length; i++) {
      var radius = circularCoords.length - i
      var seq = circularCoords[i]

      console.log('====================== Processing square with radius:', radius)
      console.log('====================== The key:', seq)

      var rotations = 0
      var lastPos = 0
      for (var x = 0; x < seq.length; x++) {
        if (seq[x] === '-') {
          rotations++
          continue
        }
        var pos = parseInt(seq[x])
        if (pos < lastPos + (radius - 1)) {
          console.log('   Rotate because ', pos, ' is less than ', lastPos + 1)
          rotations++
        }
        var sourceCoord = [pos - (radius + 1), radius - 1]
        var newCoord = this._rotate(sourceCoord, rotations)
        console.log('From: ', sourceCoord.join(), ' To: ', newCoord.join())

        var column = newCoord[0] + (size / 2)
        var row = (size / 2) - 1 - newCoord[1]
        result[row][column] = String.fromCharCode(char++)

        lastPos = pos
      }
    }
    return result
  }

  GrilleCipher.prototype._rotate = function (coord, rotations) {
    console.log('Rotate ', coord.join(), ' by ', rotations)
    var x = coord[0]//-3
    var y = coord[1]//-3
    while (rotations) {
      var oldX = x
      x = y
      y = -oldX - 1
      rotations--
      // console.log('Rotated once')
    }
    return [x, y]
  }
  GrilleCipher.prototype._shuffle = function (input) {
    var array = Array.from(input)
    for (var i = array.length - 1; i > 0; i--) {
      var posToMove = Math.floor(Math.random() * (i + 1))
      var valueToMove = array[posToMove]
      array[posToMove] = array[i]
      array[i] = valueToMove
    }
    return array
  }

  GrilleCipher.prototype._encrypt = function (text) {
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
          el.src = 'http://www.nackasmu.se/tools/cipher/grille-symbol-' + (offset + 1) + '.gif'
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

  $('.cipher-grille').each(function () {new GrilleCipher($(this))})
})()