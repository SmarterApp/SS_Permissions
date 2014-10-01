CommonURLs = {
	homePageUrl : function() {
		var url = StringUtils.format('{0}/default.xhtml',
				[ Permission.baseUrl ]);
		return url;
	},
};

var invalidChars = [];

Validation.populateInvalid = function() {
	var i;
	/*
	 * for (i = 0; i <= 31; i++) invalidChars.push(i);// control keys
	 */
	for (i = 34; i <= 38; i++)
		invalidChars.push(i);
	for (i = 43; i <= 44; i++)
		invalidChars.push(i);
	invalidChars.push(63);
	invalidChars.push(92);
	invalidChars.push(96);
	invalidChars.push(124);
	invalidChars.push(126);
	invalidChars.push(160);

	/*
	 * for (i = 127; i <= 159; i++) invalidChars.push(i); // control keys
	 */
};

Validation.isValid = function(ch) {
	for (var i = 0; i < invalidChars.length; i++) {
		if (invalidChars[i] == ch)
			return false;
	}
	return true;
};

Pages.showBusy = function(text) {
	if (typeof (text) != 'undefined' && text != null)
		$('#spinnerMessage').html(text);

	Pages.checkForOverlay().show();
};
Pages.hideBusy = function() {
	Pages.checkForOverlay().hide();
};

Pages.checkForOverlay = function() {
	var overlayObject = $('#overlay');
	if (overlayObject.length == 0) {
		// we will just log it for the time being.
		Firebug.log("No element with id 'overlay' found");
	}
	return overlayObject;
};

Pages.reassignLoadingImageUrl = function() {
	/*
	 * // hack!!!. if a link is clicked then the busy spinner gif stops playing. //
	 * the hack is to reassign the image source. var src =
	 * $('#overlayImage').attr("src"); //now reassign
	 * $('#overlayImage').attr("src", src);
	 */
	// the above hack does not seem to be working.
};

Pages.takeToUrl = function(newUrl, showBusy, showBusyMessage) {
	if (showBusy) {
		if (showBusyMessage)
			Pages.showBusy(showBusyMessage);
		else
			Pages.showBusy("");
	}
	setTimeout(function() {
		window.location = newUrl;
	}, 0);
	/*
	 * hack!!! does not work. possibly because DOM has been unloaded.
	 * Pages.reassignLoadingImageUrl();
	 */
};

Pages.Prompts = new (function() {
	var that = this;

	this.WARNING = 'warn';
	this.ERROR = 'error';
	this.SUCCESS = 'success';

	this.attachEventHandlers = function() {
		$("#closePopupMessage").click(that.hideMessage);
		$("#homeBtn").click(function() {
			var url = CommonURLs.homePageUrl();
			Pages.takeToUrl(url, true);
		});
	};

	/*
	 * @param text the text to be displayed. @param type wether it is warning,
	 * error or just plain message. @buttons an array of buttons that need to
	 * show up. each button is an object with two attributes {text, styleClass
	 * (optional), eventHandler(optional)} eventHandler for buttons will default
	 * to "closing the pop-up" if nothing has been supplied.
	 */
	this.showMessage = function(text, type, showClose, buttons) {
		clearExistingPopup(showClose);
		if (typeof (text) != 'undefined' && text != null) {
			$('#popUpMessage').html(text);
			var headerBlock = $('#messageType');
			if (this.WARNING == type) {
				headerBlock.html("Warning!");
				headerBlock.attr('class', 'warning');
				$('#popUpMessage').attr('class', 'warning');
			} else if (this.ERROR == type) {
				headerBlock.html("Error!");
				headerBlock.attr('class', 'error');
				$('#popUpMessage').attr('class', 'error');
			} else if (this.SUCCESS == type) {
				headerBlock.html("Success!");
				headerBlock.attr('class', 'success');
				$('#popUpMessage').attr('class', 'success');
			}
		}
		// render the buttons
		if (buttons) {
			for (var i = 0; i < buttons.length; ++i) {
				cloneAndAddButton(buttons[i].text, buttons[i].styleClass,
						buttons[i].eventHandler);
			}
		}
		centerPopup();
		$("#backgroundPopup").css({
			"opacity" : "0.7"
		});
		$("#backgroundPopup").fadeIn("slow");
		that.checkForOverlay().fadeIn("slow");
	};

	this.hideMessage = function() {
		$("#backgroundPopup").fadeOut("slow");
		that.checkForOverlay().fadeOut("slow");
	};

	this.checkForOverlay = function() {
		var overlayObject = $('#overlayMessages');
		if (overlayObject.length == 0) {
			// we will just log it for the time being.
			Firebug.log("No element with id 'overlay' found");
		}
		return overlayObject;
	};

	// centering popup
	function centerPopup() {
		// request data for centering
		var windowWidth = document.documentElement.clientWidth;
		var windowHeight = document.documentElement.clientHeight;
		var popupHeight = $("#overlayMessages").height();
		var popupWidth = $("#overlayMessages").width();
		// centering
		$("#overlayMessages").css({
			"position" : "fixed",
			"top" : windowHeight / 2 - popupHeight / 2,
			"left" : windowWidth / 2 - popupWidth / 2
		});

		// only need force for IE6
		$("#backgroundPopup").css({
			"height" : windowHeight
		});

	}
	;

	function cloneAndAddButton(text, styleClass, handler) {
		var clonedButton = $('#closePopupMessage').clone();
		// change its id.
		clonedButton.attr('id', 'tempPopupButton' + text);
		if (typeof handler == 'undefined') {
			clonedButton.click(that.hideMessage);
		} else {
			clonedButton.click(handler);
		}
		if (typeof styleClass != 'undefined') {
			clonedButton.attr('class', styleClass);
		}
		clonedButton.html(text);
		$('#popUpMessageButtonsDiv').append(clonedButton);
		clonedButton.show();

	}
	;

	function clearExistingPopup(showClose) {
		$('#popUpMessage').html("");
		$('#messageType').html("");
		// clear all buttons except the closePopupMessage button.
		$("#popUpMessageButtonsDiv").find("button").each(function(index) {
			// if the id is not "closePopupMessage then remove it from the dom.
			if ('closePopupMessage' == $(this).attr('id')) {
				if (showClose)
					$(this).show();
				else
					$(this).hide();
			} else
				$(this).remove();
		});
	}
	;
})();

/*
 * TODO Shiva: Pages.customPrompts should probably be merged with Pages.Prompts
 * CustomPrompts may be used to show a div on the page in a pop-up. Right now we
 * will impose a restriction that only one of these is open.
 */
Pages.CustomPrompts = new (function() {
	var that = this;
	var currentlyShowing = {};
	/*
	 * @param the divId to be shown in pop-up. @param optional onshow
	 * eventhandler. @param optional onhide eventhandler.
	 */
	this.showDiv = function(divId, onshow, onhide) {
		// clear all existing pop up attributes.
		clearExistingPopup();

		// keep track of the new one.
		currentlyShowing = {
			'id' : '#' + divId,
			'onshow' : onshow,
			'onhide' : onhide
		};

		centerPopup();
		$("#backgroundPopup").css({
			"opacity" : "0.7"
		});
		$("#backgroundPopup").fadeIn("slow");
		checkForOverlay().fadeIn("slow");

		if (typeof currentlyShowing.onshow == 'function')
			currentlyShowing.onshow();
	};

	this.hideDiv = function() {
		$("#backgroundPopup").fadeOut("slow");
		checkForOverlay().fadeOut("slow");
		if (typeof currentlyShowing.onhide == 'function')
			currentlyShowing.onhide();
		clearExistingPopup();
	};

	function checkForOverlay() {
		var overlayObject = $(currentlyShowing.id);
		if (overlayObject.length == 0) {
			// we will just log it for the time being.
			Firebug.log("No element with id 'overlay' found");
		}
		return overlayObject;
	}
	;

	// centering popup
	function centerPopup() {
		// request data for centering
		var windowWidth = document.documentElement.clientWidth;
		var windowHeight = document.documentElement.clientHeight;
		var popupHeight = $(currentlyShowing.id).height();
		var popupWidth = $(currentlyShowing.id).width();
		// centering
		$(currentlyShowing.id).css({
			"position" : "fixed",
			"top" : windowHeight / 2 - popupHeight / 2,
			"left" : windowWidth / 2 - popupWidth / 2
		});

		// only need force for IE6
		$("#backgroundPopup").css({
			"height" : windowHeight
		});

	}
	;

	function clearExistingPopup() {
		currentlyShowing = {};
	}
	;
})();

$(document).on("pageLoad", function() {
	// we will first load up the publishers from the rest URL.
	Pages.reassignLoadingImageUrl();
	Pages.Prompts.attachEventHandlers();
	Validation.populateInvalid();
});