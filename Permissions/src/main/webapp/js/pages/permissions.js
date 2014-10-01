Pages.Permissions = new (function() {
	var that = this;

	this.attachEventHandlers = function() {
		if (QueryParameters['component'] != "View all components"
				&& QueryParameters['component'] != undefined) {
			$("#componentList").val(QueryParameters['component']);
			$("#allCompTable").remove();
		} else {
			if (QueryParameters['component'] != undefined)
				$("#componentList").val(QueryParameters['component']);
			$("#oneCompTable").remove();
		}

		if (QueryParameters['popComponent'] != undefined) {
			$("#addComponentList").val(QueryParameters['popComponent']);
		}

		$("#addNew").click(function() {
			Pages.CustomPrompts.showDiv('customOverlay');
			return false;
		});

		$("#saveAddMore").click(
				function() {
					var componentId = $('#addComponentList	option:selected')
							.text();
					var permissionId = $('#addPermission').val();
					/*if (permissionId == "")
						permissionId = $("#existingPermission option:selected")
								.text();*/
					if (componentId == "Select a component...") {
						Pages.Prompts.showMessage("Select a component",
								Pages.Prompts.ERROR, true);
						return false;
					}
					if (permissionId == undefined || permissionId == ""
							|| permissionId == "Select a permission") {
						Pages.Prompts.showMessage(
								"Type a permission.",
								Pages.Prompts.ERROR, true);
						return false;
					}
					if (permissionId.length >= 50) {
						Pages.Prompts.showMessage(
								"Too long name, name can not be longer then 50 characters",
								Pages.Prompts.ERROR, true);
						$("#addPermission").attr("value", "");
						return false;
					}
					if ((/[a-zA-Z0-9]/.test(permissionId)) == false) {
						Pages.Prompts.showMessage("Invalid input.",
								Pages.Prompts.ERROR, true);
						return false;
					}
					if (permissionId != undefined && permissionId != ""
							&& permissionId != "Select a permission")
						if (componentId != "Select a component...")
							addPermission(componentId, permissionId, true);
					$("#addPermission").attr("value", "");
//					$("#addPermission").removeAttr('style');
					$("#addPermission").removeAttr('disabled');
//					$("#existingPermission").removeAttr('style');
//					$("#existingPermission").removeAttr('disabled');
					$("#notifyAdd").html("");
					return false;
				});

		$("#saveAdd").click(
				function() {
					var componentId = $('#addComponentList	option:selected')
							.text();
					var permissionId = $('#addPermission').val();
					/*if (permissionId == "")
						permissionId = $("#existingPermission option:selected")
								.text();*/
					if (componentId == "Select a component...") {
						Pages.Prompts.showMessage("Select a component",
								Pages.Prompts.ERROR, true);
						return false;
					}
					if (permissionId == undefined || permissionId == ""
							|| permissionId == "Select a permission") {
						Pages.Prompts.showMessage(
								"Type a permission.",
								Pages.Prompts.ERROR, true);
						return false;
					}
					if (permissionId.length >= 50) {
						Pages.Prompts.showMessage(
								"Too long name, name can not be longer then 50 characters",
								Pages.Prompts.ERROR, true);
						$("#addPermission").attr("value", "");
						return false;
					}
					if ((/[a-zA-Z0-9]/.test(permissionId)) == false) {
						Pages.Prompts.showMessage("Invalid input.",
								Pages.Prompts.ERROR, true);
						return false;
					}
					if (permissionId != undefined && permissionId != ""
							&& permissionId != "Select a permission")
						if (componentId != "Select a component...")
							addPermission(componentId, permissionId, false);
					$("#addPermission").attr("value", "");
//					$("#addPermission").removeAttr('style');
					$("#addPermission").removeAttr('disabled');
					/*$("#existingPermission").removeAttr('style');
					$("#existingPermission").removeAttr('disabled');*/
					$("#notifyAdd").html("");
					Pages.CustomPrompts.hideDiv('customOverlay');
					return false;
				});

		$("#cancelAdd").click(function() {
			Pages.CustomPrompts.hideDiv('customOverlay');
			$("#addPermission").attr("value", "");
//			$("#addPermission").removeAttr('style');
			$("#addPermission").removeAttr('disabled');
			/*$("#existingPermission").removeAttr('style');
			$("#existingPermission").removeAttr('disabled');*/
			$("#notifyAdd").html("");
			return false;
		});

		/*$("#existingPermission").change(function() {
			$("#addPermission").attr('style', "background-color:gray");
			$("#addPermission").attr('disabled', 'disabled');
		});*/

		$('[name="Edit"]').click(
				function() {
					$("#alias").val($(this).attr("value"));
					$("#alias").attr("name", $(this).attr("value"));
					$("#componentEdit").html(
							$(this).parent().parent().children().eq(0).html());
					Pages.CustomPrompts.showDiv('editOverlay');
					return false;
				});

		$("#saveEdit").click(function() {
			var newPermission = $('#alias').val();
			if ((/[a-zA-Z0-9]/.test(newPermission)) == false) {
				Pages.Prompts.showMessage("Invalid input.",
							Pages.Prompts.ERROR, true);		
				return false;
			}
			if (newPermission.length >= 50) {
				Pages.Prompts.showMessage(
						"Too long name, name can not be longer then 50 characters",
						Pages.Prompts.ERROR, true);
				$("#alias").attr("value", "");
				return false;
			}
			if ((/[a-zA-Z0-9]/.test(newPermission)) == false) {
				Pages.Prompts.showMessage("Invalid input.",
						Pages.Prompts.ERROR, true);
				return false;
			}
			var permissionId = $("#alias").attr("name");
			var componentId = $("#componentEdit").html();
			if (newPermission != undefined && newPermission != "")
				if (componentId != undefined && componentId != "")
					editPermission(componentId, permissionId, newPermission);
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

		$("#componentList").change(function() {
			// TODO Sajib/Shiva The selector used below is not right.
			var componentId = $("#componentList	option:selected").text();
			if (componentId == "Select a component...")
				return false;
			var url = getRedirectUrl(componentId);
			Pages.takeToUrl(url, true);
			return false;
		});

		$("[name='Delete']").click(
				function() {
					var componentId = $(this).parent().parent().children()
							.eq(0).html();
					var permisionId = $(this).attr("value");
					var row = $(this).parent().parent();
					var buttons = [];
					buttons.push({
						'text' : StringUtils.format('Yes, delete "{0}"',
								[ permisionId ]),
						'eventHandler' : function() {
							deleteHandler(componentId, permisionId, row);
						}
					});
					Pages.Prompts.showMessage(
							"Are you sure, you want to delete Permission?",
							Pages.Prompts.WARNING, true, buttons);
					return false;
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

		$("#addPermission").keypress(function(e) {
			if (Validation.isValid(e.which) == false) {
				Pages.Prompts
						.showMessage(
								"Invalid character. \"#$%&+,?\\\`|~ not allowed",
								Pages.Prompts.ERROR, true);
				return false;
			}
			$("#notifyAdd").html("There is unsaved change.");
			/*$("#existingPermission").attr('style', "background-color:gray");
			$("#existingPermission").attr('disabled', 'disabled');*/
		});

		addPermission = function(componentId, permissionId, more) {
			try {
				var url = getAddPermissionUrl(componentId, permissionId);
				// showing the busy spinner
				Pages.showBusy(StringUtils.format('Adding permission "{0}"',
						[ permissionId ]));

				var successHandler = function(data, requestObject) {
					if ("FAILURE" == data.status) {
						Pages.Prompts.showMessage(data.message,
								Pages.Prompts.ERROR);
					} else if ("SUCCESS" == data.status) {
						Pages.Prompts.showMessage(StringUtils.format(
								'Added permission "{0}"', [ permissionId ]),
								Pages.Prompts.SUCCESS, true);

						var component = $("#componentList").val();

						if (more) {
							Pages
									.takeToUrl(StringUtils
											.format(
													"{0}/permissions.xhtml?addMore=true&component={1}&permission={2}&popComponent={3}",
													[ Permission.baseUrl,
															component,
															permissionId,
															componentId ]));
						} else
							Pages.takeToUrl(StringUtils.format(
									"{0}/permissions.xhtml?component={1}", [
											Permission.baseUrl, component ]));
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

		editPermission = function(componentId, permissionId, newPermission) {
			try {
				var url = getEditPermissionUrl(componentId, permissionId,
						newPermission);
				// showing the busy spinner
				Pages.showBusy(StringUtils.format('Editing permission "{0}"',
						[ permissionId ]));

				var successHandler = function(data, requestObject) {
					if ("FAILURE" == data.status) {
						Pages.Prompts.showMessage(data.message,
								Pages.Prompts.ERROR);
					} else if ("SUCCESS" == data.status) {
						Pages.Prompts.showMessage(StringUtils.format(
								'Edited permission "{0}"', [ permissionId ]),
								Pages.Prompts.SUCCESS, true);
						var component = $("#componentList").val();
						Pages.takeToUrl(StringUtils.format(
								"{0}/permissions.xhtml?component={1}", [
										Permission.baseUrl, component ]));
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

		deleteHandler = function(componentId, permisionId, row) {
			try {
				var url = getDeleteUrl(componentId, permisionId);
				// showing the busy spinner
				Pages.showBusy(StringUtils.format('Deleting Permission "{0}"',
						[ permisionId ]));

				var successHandler = function(data, requestObject) {
					if ("FAILURE" == data.status) {
						Pages.Prompts.showMessage(data.message,
								Pages.Prompts.ERROR);
					} else if ("SUCCESS" == data.status) {
						Pages.Prompts.hideMessage();
						TableUtils.deleteRow(row);
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

		getEditPermissionUrl = function(componentId, permissionId,
				newPermission) {
			return StringUtils
					.format(
							"{0}/rest/permission?component={1}&permission={2}&newPermission={3}",
							[ Permission.baseUrl, componentId, permissionId,
									newPermission ]);
		};
		getAddPermissionUrl = function(componentId, permissionId) {
			return StringUtils.format(
					"{0}/rest/permission?component={1}&permission={2}", [
							Permission.baseUrl, componentId, permissionId ]);
		};

		getDeleteUrl = function(componentId, permissionId) {
			return StringUtils.format(
					"{0}/rest/permission?component={1}&permission={2}", [
							Permission.baseUrl, componentId, permissionId ]);
		};

		getRedirectUrl = function(componentId) {
			return StringUtils.format("{0}/permissions.xhtml?component={1}", [
					Permission.baseUrl, componentId ]);
		};

	};
})();

$(document).on(
		"pageLoad",
		function() {
			Pages.Permissions.attachEventHandlers();

			if (QueryParameters["permission"] != undefined)
				$("#lastAction").html(
						StringUtils.format("Permission '{0}' was added.",
								[ QueryParameters["permission"] ]));
			if ("true" == QueryParameters["addMore"])
				$("#addNew").click();
			$(".slide-menu").show();
			$(".menuli .selected").removeClass("selected");
			$("#permissionLink").addClass("selected");
		});

/*
 * $("select").change(function() { var str = ""; str = $("select
 * option:selected").text(); // $("[var='list']").attr("value",""); //
 * $(document.body).append(str); }).change();
 */