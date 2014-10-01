/*
 * Common class for all ajax requests. send method will call success error
 * handler based on response
 */
Permission.io = {};

Permission.io.AjaxRequestId = (new function() {
	var maxId = 0;
	this.getId = function() {
		maxId++;
		return maxId;
	};
});

Permission.io.AjaxRequest = function(data, url, verb, successFunction,
		errorFunction) {

	var myId = Permission.io.AjaxRequestId.getId();
	var myData = JSON.stringify(data);
	var mySuccessHandler = successFunction;
	var myErrorHandler = errorFunction;
	var myUrl = url;
	var myRetrievedData = null;
	var that = this;
	var method = verb;

	this.getSentData = function() {
		return myData;
	};

	this.getRequestId = function() {
		return myId;
	};

	this.getResponseData = function() {
		return myRetrievedData;
	};

	this.send = function() {
		$.ajax({
			contentType : "application/json",
			dataType : 'json',
			type : method,
			url : myUrl,
			data : myData,
			success : function(respData) {
				myRetrievedData = respData;
				mySuccessHandler(myRetrievedData, that);
			},
			error : function(request, status, error) {
				var responseData = {};
				if (request != null && request.responseText != null)
					responseData = eval('(' + request.responseText + ')');
				myErrorHandler(responseData, status, error, that);
			}
		});
	};
};