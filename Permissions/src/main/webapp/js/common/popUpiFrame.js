/*
 * Sections of this javascript code are attributed to the author Adrian Gondelle listed below.
 */

/***************************/
//@Author: Adrian "yEnS" Mato Gondelle
//@website: www.yensdesign.com
//@email: yensamg@gmail.com
//@license: Feel free to use it, but keep this credits please!					
/** ************************ */

Pages.PopupiFrame = new (function() {

	var that = this;
	var currentlyShowingUrl = null;

	this.attachEventHandlers = function() {
		// find all elements with class "showPopup" and change their hrefs to
		// invoke this popup.
		$(".showPopup").each(function() {
			var hrefValue = $(this).attr('href');
			$(this).removeAttr('href');
			$(this).click(function() {
				$("#popupiFrame").attr('src', hrefValue);
				// centering with css
				centerPopup();
				// load popup
				loadPopup();
			});

		});

		// CLOSING POPUP
		// Click the x event!
		$("#popupContactClose").click(function() {
			disablePopup();
		});
		// Click out event!
		$("#backgroundPopup").click(function() {
			disablePopup();
		});
		// Press Escape event!
		$(document).keypress(function(e) {
			if (e.keyCode == 27 && popupStatus == 1) {
				disablePopup();
			}
		});
	};

	this.showUrl = function(url) {
		currentlyShowingUrl = url;
		$('#overlayiFrame').show();
	};

	this.hidePopup = function() {
		$('#overlayiFrame').hide();
	};

	this.isPopUpActive = function() {
		return false;
	};

	// SETTING UP OUR POPUP
	// 0 means disabled; 1 means enabled;
	var popupStatus = 0;

	// loading popup with jQuery magic!
	function loadPopup() {
		// loads popup only if it is disabled
		if (popupStatus == 0) {
			$("#backgroundPopup").css({
				"opacity" : "0.7"
			});
			$("#backgroundPopup").fadeIn("slow");
			$("#popupContact").fadeIn("slow");
			popupStatus = 1;
		}
	}

	// disabling popup with jQuery magic!
	function disablePopup() {
		// disables popup only if it is enabled
		if (popupStatus == 1) {
			$("#backgroundPopup").fadeOut("slow");
			$("#popupContact").fadeOut("slow");
			popupStatus = 0;
		}
	}

	// centering popup
	function centerPopup() {
		// request data for centering
		var windowWidth = document.documentElement.clientWidth;
		var windowHeight = document.documentElement.clientHeight;
		var popupHeight = $("#popupContact").height();
		var popupWidth = $("#popupContact").width();
		// centering
		$("#popupContact").css({
			"position" : "absolute",
			"top" : windowHeight / 2 - popupHeight / 2,
			"left" : windowWidth / 2 - popupWidth / 2
		});
		// only need force for IE6

		$("#backgroundPopup").css({
			"height" : windowHeight
		});

	}
})();

$(document).on("pageLoad", function() {
	// we will first load up the publishers from the rest URL.
	Pages.PopupiFrame.attachEventHandlers();
});