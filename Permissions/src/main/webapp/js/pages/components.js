Pages.Components = new (function() {
	var that = this;

	this.attachEventHandlers = function() {
		$("#addNew").click(function() {
			Pages.CustomPrompts.showDiv('customOverlay');
			return false;
		});

		$("#saveAddMore").click(function() {
			var componentId = $('#newComponent').val();
			if ((/[a-zA-Z0-9]/.test(componentId)) == false) {
				Pages.Prompts.showMessage("Invalid input.",
						Pages.Prompts.ERROR, true);
				return false;
			}
			if (componentId.length >= 50) {
				Pages.Prompts
						.showMessage(
								"Too long name, name can not be longer then 50 characters",
								Pages.Prompts.ERROR, true);
				$("#newComponent").attr("value", "");
				return false;
			}	
			if (componentId != undefined && componentId != "")
				addComponent(componentId, true);
			$("#newComponent").attr("value", "");
			$("#notifyAdd").html("");
			return false;
		});

		$("#saveAdd").click(function() {
			var componentId = $('#newComponent').val();
			if ((/[a-zA-Z0-9]/.test(componentId)) == false) {
				Pages.Prompts.showMessage("Invalid input.",
						Pages.Prompts.ERROR, true);
				return false;
			}
			if (componentId.length >= 50) {
				Pages.Prompts
						.showMessage(
								"Too long name, name can not be longer then 50 characters",
								Pages.Prompts.ERROR, true);
				$("#newComponent").attr("value", "");
				return false;
			}	
			if (componentId != undefined && componentId != "")
				addComponent(componentId, false);
			$("#newComponent").attr("value", "");
			$("#notifyAdd").html("");
			Pages.CustomPrompts.hideDiv('customOverlay');
			return false;
		});

		$("#cancelAdd").click(function() {
			Pages.CustomPrompts.hideDiv('customOverlay');
			$("#newComponent").attr("value", "");
			$("#notifyAdd").html("");
			return false;
		});

		$('[name="Edit"]').click(function() {
			$("#alias").val($(this).attr("value"));
			$("#alias").attr("name", $(this).attr("value"));
			Pages.CustomPrompts.showDiv('editOverlay');
			return false;
		});

		$("#saveEdit").click(function() {
			var newComponent = $('#alias').val();
			var component = $("#alias").attr("name");
			if ((/[a-zA-Z0-9]/.test(newComponent)) == false) {
				Pages.Prompts.showMessage("Invalid input.",
						Pages.Prompts.ERROR, true);
				return false;
			}
			if (newComponent.length >= 50) {
				Pages.Prompts
						.showMessage(
								"Too long name, name can not be longer then 50 characters",
								Pages.Prompts.ERROR, true);
				Pages.CustomPrompts.hideDiv('customOverlay');
				return false;
			}
			if (newComponent != undefined && newComponent != "")
				editComponent(component, newComponent);
			$("#alias").attr("value", "");
			$("#notifyEdit").html("");
			Pages.CustomPrompts.hideDiv('editOverlay');
			return false;
		});

		$("#cancelEdit").click(function() {
			Pages.CustomPrompts.hideDiv('editOverlay');
			$("#notifyEdit").html("");
			return false;
		});

		$("[name='Delete']").click(
				function() {
					var componentId = $(this).attr("value");
					var buttons = [];
					buttons.push({
						'text' : StringUtils.format('Yes, delete "{0}"',
								[ componentId ]),
						'eventHandler' : function() {
							deleteHandler(componentId);
						}
					});
					Pages.Prompts.showMessage(
							"Are you sure, you want to delete this component?",
							Pages.Prompts.WARNING, true, buttons);
					return false;
				});

		$("#newComponent").keypress(function(e) {
							if (Validation.isValid(e.which) == false) {
								Pages.Prompts
										.showMessage(
												"Invalid character. \"#$%&+,?\\\`|~ not allowed",
												Pages.Prompts.ERROR, true);
								return false;
							}
							$("#notifyAdd").html("There is unsaved change.");
						});

		$("#alias").keypress(function(e) {
			if (Validation.isValid(e.which) == false) {
				Pages.Prompts
						.showMessage(
								"Invalid character. \"#$%&+,?\\\`|~ not allowed",
								Pages.Prompts.ERROR, true);
				return false;
			}
			$("#notifyEdit").html("There is unsaved change.");
		});

		addComponent = function(componentId, more) {
			try {
				var url = getAddComponentUrl(componentId);
				// showing the busy spinner
				Pages.showBusy(StringUtils.format('Adding component "{0}"',
						[ componentId ]));

				var successHandler = function(data, requestObject) {
					if ("FAILURE" == data.status) {
						Pages.Prompts.showMessage(data.message,
								Pages.Prompts.ERROR);
					} else if ("SUCCESS" == data.status) {
						Pages.Prompts.showMessage(StringUtils.format(
								'Added component "{0}"', [ componentId ]),
								Pages.Prompts.SUCCESS, true);
						if (more)
							Pages
									.takeToUrl(StringUtils
											.format(
													"{0}/components.xhtml?addMore=true&component={1}",
													[ Permission.baseUrl,
															componentId ]));
						else
							Pages.takeToUrl(StringUtils.format(
									"{0}/components.xhtml",
									[ Permission.baseUrl ]));
					}
					// turn off the busy spinner.
					Pages.hideBusy();
				};

				var errorHandler = function(request, status, error,
						requestObject) {
					// turn off the busy spinner.
					Pages.hideBusy();
					Pages.Prompts.showMessage(request.message,
							Pages.Prompts.ERROR, true);
				};

				var ajaxRequest = new Permission.io.AjaxRequest(null, url,
						'POST', successHandler, errorHandler);
				ajaxRequest.send();

			} catch (exception) {
				Pages.Prompts.showMessage(exception, Pages.Prompts.ERROR);
			}
		};

		editComponent = function(component, newComponent) {
			try {
				var url = getEditComponentUrl(component, newComponent);
				// showing the busy spinner
				Pages.showBusy(StringUtils.format('Editing component "{0}"',
						[ component ]));

				var successHandler = function(data, requestObject) {
					if ("FAILURE" == data.status) {
						Pages.Prompts.showMessage(data.message,
								Pages.Prompts.ERROR);
					} else if ("SUCCESS" == data.status) {
						Pages.Prompts.hideMessage();
						Pages
								.takeToUrl(StringUtils.format(
										"{0}/components.xhtml",
										[ Permission.baseUrl ]));
					}
					// turn off the busy spinner.
					Pages.hideBusy();
				};

				var errorHandler = function(request, status, error,
						requestObject) {
					// turn off the busy spinner.
					Pages.hideBusy();
					Pages.Prompts.showMessage(request.message,
							Pages.Prompts.ERROR, true);
				};

				var ajaxRequest = new Permission.io.AjaxRequest(null, url,
						'PUT', successHandler, errorHandler);
				ajaxRequest.send();

			} catch (exception) {
				Pages.Prompts.showMessage(exception, Pages.Prompts.ERROR);
			}
		};

		deleteHandler = function(componentId) {
			try {
				var url = getDeleteUrl(componentId);
				// showing the busy spinner
				Pages.showBusy(StringUtils.format('Deleting component "{0}"',
						[ componentId ]));

				var successHandler = function(data, requestObject) {
					if ("FAILURE" == data.status) {
						Pages.Prompts.showMessage(data.message,
								Pages.Prompts.ERROR);
					} else if ("SUCCESS" == data.status) {
						Pages.Prompts.hideMessage();
						TableUtils.deleteRow($(StringUtils.format(
								"[name='{0}']", [ componentId ])));
					}
					// turn off the busy spinner.
					Pages.hideBusy();

				};

				var errorHandler = function(request, status, error,
						requestObject) {
					// turn off the busy spinner.
					Pages.hideBusy();
					Pages.Prompts.showMessage(error, Pages.Prompts.ERROR);
				};

				var ajaxRequest = new Permission.io.AjaxRequest(null, url,
						'DELETE', successHandler, errorHandler);
				ajaxRequest.send();

			} catch (exception) {
				Pages.Prompts.showMessage(exception, Pages.Prompts.ERROR);
			}

		};

		getAddComponentUrl = function(componentId) {
			return StringUtils.format("{0}/rest/component?component={1}", [
					Permission.baseUrl, componentId ]);
		};

		getEditComponentUrl = function(component, newComponent) {
			return StringUtils.format(
					"{0}/rest/component?component={1}&newComponent={2}", [
							Permission.baseUrl, component, newComponent ]);
		};

		getDeleteUrl = function(componentId) {
			return StringUtils.format("{0}/rest/component?component={1}", [
					Permission.baseUrl, componentId ]);
		};
	};
})();

$(document).on(
		"pageLoad",
		function() {
			Pages.Components.attachEventHandlers();
			if (QueryParameters["component"] != undefined)
				$("#lastAction").html(
						StringUtils.format("Component '{0}' was added.",
								[ QueryParameters["component"] ]));
			if ("true" == QueryParameters["addMore"])
				$("#addNew").click();
			$(".slide-menu").show();
			$(".menuli .selected").removeClass("selected");
			$("#componentLink").addClass("selected");

		});