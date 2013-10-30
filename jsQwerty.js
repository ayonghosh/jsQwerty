
/*
 * jsQwerty - a reusable virtual keyboard plugin
 * Author: Ayon Ghosh
 * Version: 1.0
 * Date: 30 October 2013
 */

/* A key */
var Key = function (charc) {
	this.charc = charc;
	this.key = document.createElement('button');
	this.key.className = 'key';
	this.key.innerHTML = this.charc;
};

Key.prototype.toggleCase = function () {
	if (this.charc.length == 1) {
		if (this.charc >= 'a' && this.charc <= 'z') {
			this.charc = this.charc.toUpperCase();
		}else if (this.charc >= 'A' && this.charc <= 'Z') {
			this.charc = this.charc.toLowerCase();
		}
		this.key.innerHTML = this.charc;
	}
};


/* The keyboard */
var Keyboard = function () {
	this.kbd = document.createElement('div');
	this.kbd.id = 'kbd';
	this.kbd.style.display = 'none';
	
	this.keys = [
		[
			// digits
			new Key('1'), 
			new Key('2'),
			new Key('3'),
			new Key('4'),
			new Key('5'),
			new Key('6'),
			new Key('7'),
			new Key('8'),
			new Key('9'),
			new Key('0')
		], 
		[
			// letters
			new Key('q'),
			new Key('w'),
			new Key('e'),
			new Key('r'),
			new Key('t'),
			new Key('y'),
			new Key('u'),
			new Key('i'),
			new Key('o'),
			new Key('p')
		],
		[
			new Key('a'),
			new Key('s'),
			new Key('d'),
			new Key('f'),
			new Key('g'),
			new Key('h'),
			new Key('j'),
			new Key('k'),
			new Key('l')
		],
		[
			new Key('shift'),
			new Key('z'),
			new Key('x'),
			new Key('c'),
			new Key('v'),
			new Key('b'),
			new Key('n'),
			new Key('m')
		],
		[
			new Key('space'),
			new Key('.'),
			new Key(','),
			new Key(';'),
			new Key(':'),
			new Key('backspace')
		]
	];
	
	var i, j;
	var docFrag = document.createDocumentFragment();
	for (i = 0; i < this.keys.length; i++) {
		for (j = 0; j < this.keys[i].length; j++) {
			docFrag.appendChild(this.keys[i][j].key);
		}
		docFrag.appendChild(document.createElement('br'));
	}
	
	// close button
	var close = document.createElement('button');
	close.className = 'close';
	close.innerHTML = 'x';
	this.kbd.appendChild(close);
	
	this.kbd.appendChild(docFrag);
	document.body.appendChild(this.kbd);
	
	var _this = this;
	function _keyTyped(evt) {
		_this.keyTyped(evt);
	};
	
	//this.kbd.addEventListener('click', _keyTyped, false);
	addEventHandler(this.kbd, 'click', _keyTyped);
	//this.kbd.addEventListener('touch', _keyTyped, false);
};

Keyboard.prototype.shiftToggle = function () {
	var i, j;
	for (i = 0; i < this.keys.length; i++) {
		for (j = 0; j < this.keys[i].length; j++) {
			if (this.keys[i][j].key.innerHTML == 'shift') {
				if (this.keys[i][j].key.className == 'key') {
					this.keys[i][j].key.className = 'key pressed';
				}else {
					this.keys[i][j].key.className = 'key';
				}
			}else {
				this.keys[i][j].toggleCase();
			}
		}
	}
};

Keyboard.prototype.keyTyped = function (evt) {
	// no target, i.e., no input field is focussed
	if (!this.currentTarget) {
		return;
	}
	
	// if event source is a key
	var target = evt.target || evt.srcElement;
	if (target.className == 'key' || target.className == 'key pressed') {
		var keyval = target.innerHTML;
		if (keyval == 'shift') {
			this.shiftToggle();
		}else {
			if (keyval == 'backspace') {	// backspace
				var str = this.currentTarget.value;
				this.currentTarget.value = 
					str.substring(0, str.length - 1);
			}else { 
				if (keyval == 'space') {
					keyval = ' ';
				}
				this.currentTarget.value = this.currentTarget.value + keyval;
			}
		}
	}else if (target.className == 'close') {
		this.hide();
	}
};

Keyboard.prototype.show = function (inputElem) {
	if (this.shown) {
		return;
	}
	this.bottom = -400;
	this.kbd.style.bottom = this.bottom + 'px';
	this.kbd.style.display = 'block';
	this.currentTarget = inputElem;
	
	var _this = this;
	
	var anim = setInterval(function () {
		if (_this.bottom < 0) {
			_this.bottom += 20;
			_this.kbd.style.bottom = _this.bottom + 'px';
		}else {
			_this.shown = true;
			clearInterval(anim);
		}
	}, 10);
};

Keyboard.prototype.hide = function () {
	var _this = this;
	
	var anim = setInterval(function () {
		if (_this.bottom > -400) {
			_this.bottom -= 20;
			_this.kbd.style.bottom = _this.bottom + 'px';
		}else {
			_this.kbd.style.display = 'none';
			_this.shown = false;
			clearInterval(anim);
		}
	}, 10);
};



// the application
var kbd = null;

window.attachKeyboard = function (inputElems) {
	if (!kbd) {
		kbd = new Keyboard();
	}
	for (var i = 0; i < inputElems.length; i++) {
		addEventHandler(inputElems[i], 'focus', function () {
			kbd.show.call(kbd, this);
		});
		/*
		inputElems[i].addEventListener('focus', function () {
			kbd.show.call(kbd, this);
		});*/
	}
};

window.addEventHandler = function (elem, evt, handler) {
	if (elem.addEventListener) {
		elem.addEventListener(evt, handler, false);
	}else if (elem.attachEvent){
		elem.attachEvent('on' + evt, handler);
	}
};
