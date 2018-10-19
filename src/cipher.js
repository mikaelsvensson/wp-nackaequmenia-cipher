(function() {

    var $ = jQuery;
	
	/*
	 * Pigpen
	 */
	
	PigpenCipher = function (formElement, outputElement)
	{
		this._init(formElement, outputElement);
	};
	
	PigpenCipher.prototype._init = function (formElement, outputElement)
	{
        this.inputField = $('<input size="50" />');
        this.inputField.keyup(this, this._keyUpHandler);
		
		this.cipherContainer = outputElement;
        
        formElement.append(
                $(document.createElement("p")).text("Text att kryptera: ").append(
                        this.inputField
                        )
                )
	};
	
    PigpenCipher.prototype._keyUpHandler = function(event) {
        var that = event.data;
        that._encrypt(this.value);
    };
    
    PigpenCipher.prototype._encrypt = function(text) {
        var symbols = "ABCDEFGHIJKLMNOPRSTUVXYZÅÄÖ";
        this.cipherContainer.text("");
        var spaceDetected = false;
        var inputValid = true;
        for (var i = 0; i < text.length; i++) 
        {
            var c = text.toUpperCase().charAt(i);
            if (c == ' ') 
            {
                spaceDetected = true;
            }
            else 
            {
                var offset = symbols.indexOf(c);
                if (offset >= 0) 
                {
                    var el = document.createElement("img");
                    el.src = "/tools/cipher/pigpen-symbol-" + (offset + 1) + ".gif";
                    if (spaceDetected) 
                    {
                        el.style.marginLeft = "40px";
                        spaceDetected = false;
                    }
                    this.cipherContainer.append(el);
                }
				else
				{
					inputValid = false;
				}
            }
        }
		this.inputField.toggleClass("cipher-formfield-error", !inputValid).attr("title", inputValid ? "" : "Texten innehåller bokstäver/tecken som inte kan översättas.");
    };
	
	/*
	 * Morse
	 */
	
	MorseCode = function (formElement, outputElement)
	{
		this._init(formElement, outputElement);
	};
	
	MorseCode.prototype._init = function (formElement, outputElement)
	{
        this.inputField = $('<input size="50" />');
        this.inputField.keyup(this, this._keyUpHandler);
		
		this.cipherContainer = outputElement;
        
        formElement.append(
                $(document.createElement("p")).text("Text att koda: ").append(
                        this.inputField
                        )
                )
	};
	
    MorseCode.prototype._keyUpHandler = function(event) {
        var that = event.data;
        that._encrypt(this.value);
    };
    
    MorseCode.prototype._encrypt = function(text) {
        var symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        this.cipherContainer.text("");
        var spaceDetected = false;
        var inputValid = true;
        for (var i = 0; i < text.length; i++) 
        {
            var c = text.toUpperCase().charAt(i);
            if (c == ' ') 
            {
                spaceDetected = true;
            }
            else 
            {
                var offset = symbols.indexOf(c);
                if (offset >= 0) 
                {
                    var el = document.createElement("img");
					if (offset < 9)
					{
                        el.src = "/tools/cipher/morse-symbol-0" + (offset + 1) + ".gif";
					}
					else
					{
                        el.src = "/tools/cipher/morse-symbol-" + (offset + 1) + ".gif";
					}
                    el.style.display = "block";
                    el.style.marginTop = spaceDetected ? "20px" : "5px";
                    if (spaceDetected) 
                    {
                        spaceDetected = false;
                    }
                    this.cipherContainer.append(el);
                }
				else
				{
					inputValid = false;
				}
            }
        }
		this.inputField.toggleClass("cipher-formfield-error", !inputValid).attr("title", inputValid ? "" : "Texten innehåller bokstäver/tecken som inte kan översättas.");
    };
	
	/*
	 * Polybius Square
	 */
	PolybiussquareCipher = function (formElement, outputElement)
    {
        this.symbols = "ABCDEFGHIJKLMNOPRSTUVYÅÄÖ";
        
        this._init(formElement, outputElement);
    };
    
    PolybiussquareCipher.prototype._init = function (formElement, outputElement)
    {
        this.cipherContainer = outputElement;
		
        this.inputField = $('<input size="50" />').keyup(this, this._keyUpHandler);
        this.word1Field = $('<input size="7" />').keyup(this, this._cfgKeyUpHandler).val("SCOUT");
        this.word2Field = $('<input size="7" />').keyup(this, this._cfgKeyUpHandler).val("scout");
        
		var td1_2 = document.createElement("td");
		this.word1Field.appendTo(td1_2);
		
		var td2_1 = document.createElement("td");
		this.word2Field.appendTo(td2_1);
		
		var td2_2 = document.createElement("td");
		this._translationTableElement = $(document.createElement("div"));
		this._translationTableElement.appendTo(td2_2);
		
		var tr1 = document.createElement("tr");
		tr1.appendChild(document.createElement("td"));
		tr1.appendChild(td1_2);
		
		var tr2 = document.createElement("tr");
		tr2.appendChild(td2_1);
		tr2.appendChild(td2_2);
        
		var t = document.createElement("table");
		t.appendChild(tr1);
		t.appendChild(tr2);
		
        formElement.append(
                $(document.createElement("p")).text("Text att kryptera: ").append(this.inputField),
                $(document.createElement("p")).text("Översättningstabell: ").append(t)
                )
				
		this._drawTranslationTable();
    };
	
    PolybiussquareCipher.prototype._drawTranslationTable = function ()
	{
        var table = ['<table><tbody><td></td>'];
        var word1 = this.word1Field.val();
        var word2 = this.word2Field.val();
        
        for (var x = 0; x < 5; x++)
        {
            table.push('<th>'+word1.charAt(x)+'</th>');
        }
        for (var y = 0; y < 5; y++)
        {
            table.push('<tr>');
            table.push('<th>'+word2.charAt(y)+'</th>');
            for (var x = 0; x < 5; x++)
            {
                table.push('<td>'+this.symbols.charAt(y*5+x)+'</td>');
            }
            table.push('</tr>');
        }
        table.push('</tbody></table>');
		
		this._translationTableElement.html(table.join(""));
	};
    
    PolybiussquareCipher.prototype._keyUpHandler = function(event) {
        var that = event.data;
        that._encrypt(this.value);
    };
	
    PolybiussquareCipher.prototype._cfgKeyUpHandler = function(event) {
        var that = event.data;
		that._drawTranslationTable();
        that._encrypt(that.inputField.val());
    };
    
    PolybiussquareCipher.prototype._validateEncryptionKeyPart = function(word) {
		if (word.length == 5)
		{
			var chars = {};
			for (var i in word)
			{
				if (chars[word[i]])
				{
					return false;
				}
				else
				{
					chars[word[i]] = true;
				}
			}
			return true;
		}
		else 
		{
			return false;
		}
	};
	
    PolybiussquareCipher.prototype._encrypt = function(text) {
        
		var word1 = this.word1Field.val();
        var word2 = this.word2Field.val();
		
		var word1Valid = this._validateEncryptionKeyPart(word1);
		var word2Valid = this._validateEncryptionKeyPart(word2);
		var inputValid = true;
		
		var result = "";
		if (word1Valid && word2Valid)
		{
	        for (var i = 0; i < text.length; i++) 
	        {
	            var c = text.toUpperCase().charAt(i);
	            if (c == ' ') 
	            {
	                result += " ";
	            }
	            else 
	            {
	                var offset = this.symbols.indexOf(c);
	                if (offset >= 0) 
	                {
						var word1pos = offset % 5;
						var word2pos = Math.floor(offset / 5);
						
						result += word1.charAt(word1pos) + word2.charAt(word2pos) + " ";
	                }
					else
					{
						inputValid = false;
					}
	            }
	        }
		}
		
		this.word1Field.toggleClass("cipher-formfield-error", !word1Valid).attr("title", word1Valid ? "" : "Ordet måste vara exakt 5 bokstäver långt och varje bokstav får bara förekomma en gång.");
		this.word2Field.toggleClass("cipher-formfield-error", !word2Valid).attr("title", word2Valid ? "" : "Ordet måste vara exakt 5 bokstäver långt och varje bokstav får bara förekomma en gång.");
		this.inputField.toggleClass("cipher-formfield-error", !inputValid).attr("title", inputValid ? "" : "Texten innehåller bokstäver/tecken som inte kan översättas.");
		
        this.cipherContainer.text(result);
    };
	
	/*
	 * Caesar
	 */
	CaesarCipher = function (formElement, outputElement)
    {
        this._init(formElement, outputElement);
    };
    
    CaesarCipher.prototype._init = function (formElement, outputElement)
    {
        this.cipherContainer = outputElement;
		
        this.inputField = $('<input size="50" />').keyup(this, this._keyUpHandler);
        this.offsetField = $('<input size="5" />').keyup(this, this._cfgKeyUpHandler).val(1);
		
		var select = document.createElement("select");
		select.appendChild(new Option("ABCDEFGHIJKLMNOPQRSTUVXYZÅÄÖ"));
		select.appendChild(new Option("ABCDEFGHIJKLMNOPQRSTUVXYZÅÄÖ0123456789"));
		select.appendChild(new Option("ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ"));
		select.appendChild(new Option("ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789"));
		
        this.symbolsField = $(select).change(this, this._cfgKeyUpHandler);
        
		this._translationTableElement = $(document.createElement("div"));
		
        formElement.append(
                $(document.createElement("p")).text("Text att kryptera: ").append(this.inputField),
                $(document.createElement("p")).text("Alfabete: ").append(this.symbolsField),
                $(document.createElement("p")).text("Förskjutning: ").append(this.offsetField),
                $(document.createElement("p")).text("Översättningstabell: ").append(this._translationTableElement)
                )
				
		this._drawTranslationTable();
    };
	
    CaesarCipher.prototype._drawTranslationTable = function ()
	{
		var offset = parseInt(this.offsetField.val(), 10);
        var table = ['<table><tbody><tr>'];
		var symbols = this.symbolsField.val();
        
        for (var i = 0; i < symbols.length; i++)
        {
            table.push('<td>'+symbols.charAt(i)+'</td>');
        }
		table.push('</tr>');
		table.push('<tr><td>&darr;</td></tr>');
		table.push('<tr>');
        for (var i = 0; i < symbols.length; i++)
        {
			var translatedPos = (symbols.length + offset + i) % symbols.length;
            table.push('<td>'+symbols.charAt(translatedPos)+'</td>');
        }
		table.push('</tr></tbody></table>');
		
		this._translationTableElement.html(table.join(""));
	};
    
    CaesarCipher.prototype._keyUpHandler = function(event) {
        var that = event.data;
        that._encrypt(this.value);
    };
	
    CaesarCipher.prototype._cfgKeyUpHandler = function(event) {
        var that = event.data;
		that._drawTranslationTable();
        that._encrypt(that.inputField.val());
    };
    
    CaesarCipher.prototype._encrypt = function(text) {
        
		var symbols = this.symbolsField.val();
		var offset = parseInt(this.offsetField.val(), 10);
		
		var validOffset = !isNaN(offset);
		var inputValid = true;
		
		var result = "";
        for (var i = 0; i < text.length; i++) 
        {
            var c = text.toUpperCase().charAt(i);
            if (c == ' ') 
            {
                result += " ";
            }
            else 
            {
                var pos = symbols.indexOf(c);
                if (pos >= 0) 
                {
					result += symbols.charAt((symbols.length + offset + pos) % symbols.length);
                }
				else {
					inputValid = false;
				}
            }
        }
		
		this.offsetField.toggleClass("cipher-formfield-error", !validOffset).attr("title", validOffset ? "" : "Inte ett giltigt heltal.");
        this.inputField.toggleClass("cipher-formfield-error", !inputValid).attr("title", inputValid ? "" : "Texten innehåller bokstäver/tecken som inte finns i valt alfabete.");
		
        this.cipherContainer.text(result);
    };
	
	/*
	 * Factory and utility class
	 */
    Cipher = function(container, header, type) {
		
		this.initCommon(container, header);
		
		switch(type) {
			case "pigpen":
			    new PigpenCipher(this.form, this.resultElement);
                break;
			case "polybiussquare":
			    new PolybiussquareCipher(this.form, this.resultElement);
				break;
			case "caesar":
			    new CaesarCipher(this.form, this.resultElement);
				break;
			case "morse":
			    new MorseCode(this.form, this.resultElement);
				break;
		}
    };
	
    Cipher.prototype.initCommon = function(container, header) {
        this.el = container;
        this.el.innerHTML = "";
		
		this.form = $(document.createElement("form"));
		
		this.resultElement = $(document.createElement("div"));
		
        var printWindowButton = $('<a class="cipher-button" id="button-print" href="javascript:void(0);">Visa resultat i utskriftsvänligt fönster</a>').click(this, this._printWindowButtonClickHandler);
		
		var resultHeader = $(document.createElement("div")).text("Resultat:");
		
		var resultContainerElement = $('<div class="cipher-result-container" />').append(resultHeader, this.resultElement, printWindowButton);
		
		var header = $(document.createElement("h2")).text(header);
		
		$(this.el).append(header, this.form, resultContainerElement);
	};
    
    Cipher.prototype._printWindowButtonClickHandler = function(event) {
        var that = event.data;
        that._openPrinterFriendly();
    };
    
    Cipher.prototype._openPrinterFriendly = function() {
        var html = [];
        html.push('<html><head>');
        html.push('    <title>Chiffer</title>');
        html.push('    <link rel="stylesheet" href="/tools/cipher/cipher.css" type="text/css" />');
        html.push('    <style>');
        html.push('        @media print {');
        html.push('            #menu { display: none; }');
        html.push('            #cipher { margin-top: 1in }');
        html.push('        }');
        html.push('        body {');
        html.push('            font-family: Garamond, "Palatino Linotype", "Book Antiqua", Palatino, serif;');
        html.push('            background-color: #F9F7E5;');
        html.push('            margin: 0 1em;');
        html.push('        }');
        html.push('        body { color: #555555; }');
        html.push('        div#cipher { font-size: 200%; }');
        html.push('        a { color: #146070; }');
        html.push('        div { margin: 1em 0; }');
        html.push('    </style>');
        html.push('</head><body>');
        html.push('    <div id="cipher">' + this.resultElement.html() + '</div>');
        html.push('    <div id="menu">');
        html.push('        <a class="cipher-button" id="button-print" href="javascript:void(0);" onclick="window.print()">Skriv ut</a> |');
        html.push('        <a class="cipher-button" id="button-close" href="javascript:void(0);" onclick="window.close()">Stäng</a>');
        html.push('    </div>');
        html.push('</body></html>');
        var w = window.open("", "nackasmu-printerfriendly-" + (new Date()).getTime(), "height=300,width=500,scrollbars=1");
        w.document.write(html.join(""));
    };
})();


