// Read more on https://en.wikipedia.org/wiki/Grille_(cryptography)

(function () {

  var $ = jQuery

  const SKIP_SIDE = 'A'

  GrilleCipher = function (formElement) {
    // TODO: Add support for texts longer than 36 letters
    this.inputField = $('<input size="50" type="text" />').val('FEST HOS EMMA PÅ LÖRDAG FÖR KRYPTOKLUBBEN').keyup(this, this._keyUpHandler.bind(this))
    this.newKeyButton = $('<button type="button"/>').text('Slumpa ny').click(this, this._generateNewKey.bind(this))
    // TODO: Add input validation to the key field
    this.keyField = $('<input size="20" type="text" />').keyup(this, this._keyUpHandler.bind(this)).val(this.getRandomKeyParams())
    this.illustrationContainer = $(document.createElement('div'))
    // TODO: Show encrypted text as string AND in grid
    this.cipherContainer = $(document.createElement('div'))

    formElement.append(
      $(document.createElement('p')).text('Text att kryptera: ').append(this.inputField),
      $(document.createElement('p')).text('Nyckel: ').append(this.keyField).append(this.newKeyButton),
      $(document.createElement('p')).text('Nyckel för utskrift: ').append(this.illustrationContainer),
      $(document.createElement('p')).text('Krypterad text: ').append(this.cipherContainer)
    )

    //   [' ', ' ', '#', ' ', ' ', ' '],
    //   ['#', ' ', ' ', ' ', ' ', '#'],
    //   [' ', ' ', ' ', '#', ' ', ' '],
    //   [' ', '#', ' ', ' ', ' ', '#'],
    //   [' ', ' ', '#', ' ', '#', ' '],
    //   ['#', ' ', ' ', ' ', ' ', ' ']

    var keyParams = this.getRandomKeyParams()

    var keyCoords = this.getFixedKeyCoords('324A15AA132A1AA')

    console.log('Test 1:')
    var input = 'FEST HOS EMMA PÅ LÖRDAG FÖR KRYPTOKLUBBEN'.replace(/\s/g, '')
    var expected = 'OMFAKG EFLÖPS RUÅTKB LHRBÖO YESREP MDNTXA'.replace(/\s/g, '')
    var actual = this.encrypt(input, keyCoords)
    console.log('Encrypt this: ', input.split(/(.{9})/).filter(function (value) {
      return !!value
    }).join(' '))
    console.log('Expected:     ', expected)
    console.log('Actual:       ', actual)
    console.log(expected === actual ? 'The algorithm WORKS!' : 'Something is wrong.')

    console.log('Test 2:')
    var input = 'DRICK INTE! DU KAN DÖ. DET ÄR GIFT I LÄSKEN.'.replace(/\s/g, '').replace(/[^A-Za-zÅÄÖåäö]/g, 'X')
    var expected = 'IXDDLD REÄTUI ÄSKCRK AKGENI INNDTF EÖXTXX'.replace(/\s/g, '')
    var actual = this.encrypt(input, keyCoords)
    console.log('Encrypt this: ', input.split(/(.{9})/).filter(function (value) {
      return !!value
    }).join(' '))
    console.log('Expected:     ', expected)
    console.log('Actual:       ', actual)
    console.log(expected === actual ? 'The algorithm WORKS!' : 'Something is wrong.')

    this._encrypt()
  }

  GrilleCipher.prototype._generateNewKey = function (event) {
    this.keyField.val(this.getRandomKeyParams())
    this._encrypt()
  }

  GrilleCipher.prototype.getFixedKeyCoords = function (keyParams) {
    return this._getKeyCoords([
      keyParams.substr(0, 6),
      keyParams.substr(6, 5),
      keyParams.substr(11, 4)])

  }

  GrilleCipher.prototype.getRandomKeyParams = function () {
    return [
      this._shuffle(['1', '2', '3', '4', '5', SKIP_SIDE]).join(''),
      this._shuffle(['1', '2', '3', SKIP_SIDE, SKIP_SIDE]).join(''),
      this._shuffle(['1', SKIP_SIDE, SKIP_SIDE, SKIP_SIDE]).join('')].join('')
  }

  // TODO: This seems like an unnecessary wrapper function
  GrilleCipher.prototype.getKey = function (keyData) {
    return this._getKeyCoords(keyData)
  }

  GrilleCipher.prototype.encrypt = function (input, keyCoords) {
    var inputChars = input
    var size = Math.sqrt(keyCoords.length * 4)

    var keys = [
      this.rotateCoords(keyCoords, 0),
      this.rotateCoords(keyCoords, 3),
      this.rotateCoords(keyCoords, 2),
      this.rotateCoords(keyCoords, 1)
    ].map(this.sortByWriteOrder)

    // TODO: Make "X" into a constant, or better yet, make it configurable
    var currentBoard = this.createMatrix(size, 'X')

    var result = []

    var inputCharIndex = 0
    while (inputCharIndex < inputChars.length) {
      var boardPos = inputCharIndex % (size * size)
      var keyNum = Math.floor(boardPos / keyCoords.length)
      var keyCoordIndex = boardPos % keyCoords.length

      var coord = keys[keyNum][keyCoordIndex]

      var column = coord[0] + (size / 2)
      var row = (size / 2) - 1 - coord[1]
      currentBoard[row][column] = inputChars.charAt(inputCharIndex)

      if (boardPos === (size * size) - 1) {
        result.push(currentBoard.map(function (row) { return row.join('') }).join(''))
        currentBoard = this.createMatrix(size, 'X')
      }

      inputCharIndex++
    }
    result.push(currentBoard.map(function (row) { return row.join('') }).join(''))
    return result.join(';')
  }

  GrilleCipher.prototype.rotateCoords = function (coords, rotations) {
    var rotated = []
    for (var i = 0; i < coords.length; i++) {
      rotated.push(this._rotate(coords[i], rotations))
    }
    return rotated
  }

  GrilleCipher.prototype.sortByWriteOrder = function (coords) {
    return coords.sort(function (a, b) {
      return b[1] !== a[1] ? b[1] - a[1] : a[0] - b[0]
    })
  }

  GrilleCipher.prototype.getPrintableCoords = function (keyCoords) {
    var size = Math.sqrt(keyCoords.length * 4)
    var result = this.createMatrix(size, ' ')
    for (var i = 0; i < keyCoords.length; i++) {
      var newCoord = keyCoords[i]

      var column = newCoord[0] + (size / 2)
      var row = (size / 2) - 1 - newCoord[1]
      result[row][column] = '#'
    }
    return result
  }

  GrilleCipher.prototype._keyUpHandler = function (event) {
    this._encrypt()
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
    var keyCoords = []

    for (var i = 0; i < circularCoords.length; i++) {
      var radius = circularCoords.length - i
      var seq = circularCoords[i]

      var rotations = 0
      var lastPos = 0
      for (var x = 0; x < seq.length; x++) {
        if (seq[x] === SKIP_SIDE) {
          rotations++
          continue
        }
        var pos = parseInt(seq[x])
        if (pos < lastPos + (radius - 1)) {
          rotations++
        }
        var sourceCoord = [pos - (radius + 1), radius - 1]
        var newCoord = this._rotate(sourceCoord, rotations)
        keyCoords.push(newCoord)

        lastPos = pos
      }
    }
    return keyCoords
  }

  GrilleCipher.prototype._rotate = function (coord, rotations) {
    // console.log('Rotate ', coord.join(), ' by ', rotations)
    var x = coord[0]
    var y = coord[1]
    while (rotations) {
      var oldX = x
      x = y
      y = -oldX - 1
      rotations--
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

  GrilleCipher.prototype._encrypt = function () {

    var text = this.inputField.val()
    var key = this.keyField.val()

    var keyCoords = this.getFixedKeyCoords(key)

    const rows = this.getPrintableCoords(keyCoords).map(function (value) {
      return value.map(function (column) {
        // TODO: Testing for presence of "#" seems a bit unrefined.
        return column === '#' ? '<div class="grille-box grille-box-used">' + column + '</div>' : '<div class="grille-box">' + column + '</div>'
      }).join('')
    }).map(function (row) {
        return '<div class="grille-row">' + row + '</div>'
      }
    ).join('')
    this.illustrationContainer.html('<div class="grille-grid">' + rows + '<p>' + key + '</p></div>')

    var cipherText = this.encrypt(text.replace(/\s/g, ''), keyCoords)

    const size = Math.sqrt(keyCoords.length * 4)
    var matrix = this.createMatrix(size)
    for (var i = 0; i < cipherText.length; i++) {
      var char = cipherText[i]
      var col = i % size
      var row = Math.floor(i / size)
      matrix[row][col] = char
    }
    var cipherText = matrix.map(function (value) {
      return value.map(function (column) {
        return '<div class="grille-box">' + column + '</div>'
      }).join('')
    }).map(function (row) {
        return '<div class="grille-row">' + row + '</div>'
      }
    ).join('')

    this.cipherContainer.html('<div class="grille-grid">' + cipherText + '</div>')
    // this.inputField.toggleClass('cipher-formfield-error', !inputValid).attr('title', inputValid ? '' : 'Texten innehåller bokstäver/tecken som inte kan översättas.')
  }

  $('.cipher-grille').each(function () {new GrilleCipher($(this))})
})()