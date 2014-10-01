if (typeof Permission == 'undefined') {
	Permission = {};
	Permission.Common = {};
}
Pages = {};

Validation = {};

jQuery(document).ready(function() {
	$.event.trigger({
		type : "pageLoad"
	});
});


StringUtils = {
	// Code to format into JSON object
	format : function(text, params) {
		if (params == null)
			return text;

		for (var i = 0, l = params.length; i < l; ++i) {
			var reg = new RegExp("\\{" + i + "\\}", "g");
			text = text.replace(reg, params[i]);
		}

		return text;
	},
	// Code to check string is empty or not
	emptyChk : function(text) {
		if (text == null)
			return null;
		if (text.length > 0) {
			return text;
		} else {
			return null;
		}
	},
	// Code to check string is empty or not
	isEmpty : function(text) {
		if (StringUtils.emptyChk(text) == null)
			return true;
		return false;
	}
};

TableUtils = {
	deleteRow : function(row) {
		var cells = row.children();
		var columnCount = cells.length;
		var firstCell = cells.eq(0);
		firstCell.css("text-decoration", "line-through");
		for (var i = 1; i < columnCount; i++) {
			var cell = cells.eq(i);
			cell.html("");
		}
	}
};

Event = {
	// from
	// http://www.webdevelopment2.com/the-secret-of-cancelling-and-stopping-events-using-javascript/
	stopEvent : function(e) {
		if (!e)
			e = window.event;
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	},

	cancelEvent : function(e) {
		if (!e)
			e = window.event;
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	}
};

// Logic to find the query parameters in the url
QueryParameters = (function() {
	var result = {};

	if (window.location.search) {
		// split up the query string and store in an associative array
		var params = window.location.search.slice(1).split("&");
		for (var i = 0; i < params.length; i++) {
			var tmp = params[i].split("=");
			result[tmp[0]] = unescape(tmp[1]);
		}
	}

	return result;
}());

Dom = {
	removeAllChildren : function(domNode) {
		while (domNode.hasChildNodes()) {
			domNode.removeChild(domNode.lastChild);
		}
	},
	appendChild : function(parentNode, newNode) {
		parentNode.appendChild(newNode);
	}
};
