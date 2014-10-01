var chkBox = [];
var invalidChars = [];

Pages.Roles = new (function() {
	var that = this;

	this.attachEventHandlers = function() {

		$("#addNew").click(function() {
			Pages.CustomPrompts.showDiv('customOverlay');
			return false;
		});

		$("#saveAddMore")
				.click(
						function() {
							var roleId = $('#newRole').val();

							if ((/[a-zA-Z0-9]/.test(roleId)) == false) {
								Pages.Prompts.showMessage("Invalid input.",
										Pages.Prompts.ERROR, true);
								return false;
							}
							if (roleId.length >= 50) {
								Pages.Prompts
										.showMessage(
												"Too long name, name can not be longer then 50 characters",
												Pages.Prompts.ERROR, true);
								$("#newRole").attr("value", "");
								return false;
							}

							if (roleId != undefined && roleId != "")
								addRole(roleId, true);
							$("#newRole").attr("value", "");
							$("#notifyAdd").html("");
							return false;
						});

		$("#saveAdd")
				.click(
						function() {
							var roleId = $('#newRole').val();

							if ((/[a-zA-Z0-9]/.test(roleId)) == false) {
								Pages.Prompts.showMessage("Invalid input.",
										Pages.Prompts.ERROR, true);
								return false;
							}
							if (roleId.length >= 50) {
								Pages.Prompts
										.showMessage(
												"Too long name, name can not be longer then 50 characters",
												Pages.Prompts.ERROR, true);
								$("#newRole").attr("value", "");
								return false;
							}

							if (roleId != undefined && roleId != "")
								addRole(roleId, false);
							$("#newRole").attr("value", "");
							$("#notifyAdd").html("");
							Pages.CustomPrompts.hideDiv('customOverlay');
							return false;
						});

		$("#cancelAdd").click(function() {
			Pages.CustomPrompts.hideDiv('customOverlay');
			$("#newRole").attr("value", "");
			$("#notifyAdd").html("");
			return false;
		});

		$('[name="edit"]').click(function() {
			$("#alias").val($(this).attr("value"));
			$("#alias").attr("name", $(this).attr("value"));
			Pages.CustomPrompts.showDiv('editOverlay');
			return false;
		});

		$("#saveEdit")
				.click(
						function() {
							var newRole = $('#alias').val();

							if ((/[a-zA-Z0-9]/.test(newRole)) == false) {
								Pages.Prompts.showMessage("Invalid input.",
										Pages.Prompts.ERROR, true);
								return false;
							}
							if (newRole.length >= 50) {
								Pages.Prompts
										.showMessage(
												"Too long name, name can not be longer then 50 characters",
												Pages.Prompts.ERROR, true);
								Pages.CustomPrompts.hideDiv('customOverlay');
								return false;
							}

							var roleId = $("#alias").attr("name");
							if (newRole != undefined && newRole != "")
								editRole(roleId, newRole);
							$("#alias").attr("value", "");
							Pages.CustomPrompts.hideDiv('editOverlay');
							$("#notifyEdit").html("");
							return false;
						});

		$("#cancelEdit").click(function() {
			Pages.CustomPrompts.hideDiv('editOverlay');
			$("#notifyEdit").html("");
			return false;
		});

		$('[type="checkbox"]').change(function() {
			chkBox.push($(this));
			$("#notifySave").html("Warning: There are unsaved changes");
		});

		$("#alias")
				.keypress(
						function(e) {
							if (Validation.isValid(e.which) == false) {
								Pages.Prompts
										.showMessage(
												"Invalid character. \"#$%&+,?\\\`|~ not allowed",
												Pages.Prompts.ERROR, true);
								return false;
							}
							$("#notifyEdit").html("There is unsaved change.");
						});

		$("#newRole")
				.keypress(
						function(e) {
							if (Validation.isValid(e.which) == false) {
								Pages.Prompts
										.showMessage(
												"Invalid character. \"#$%&+,?\\\`|~ not allowed",
												Pages.Prompts.ERROR, true);
								return false;
							}
							$("#notifyAdd").html("There is unsaved change.");
						});

		$("#saveAll").click(function() {
			while (chkBox.length > 0) {
				var chkbox = chkBox.pop();
				changeEntity(chkbox);
			}
			$("#notifySave").html("");
			return false;
		});

		$("#cancel").click(
				function() {
					Pages.takeToUrl(StringUtils.format("{0}/roles.xhtml",
							[ Permission.baseUrl ]));
					return false;
				});

		$("[name='delete']").click(
				function() {
					// first show a prompt.
					var roleId = $(this).attr("value");
					var buttons = [];
					buttons.push({
						'text' : StringUtils.format('Yes, delete "{0}"',
								[ roleId ]),
						'eventHandler' : function() {
							deleteHandler(roleId);
						}
					});
					Pages.Prompts.showMessage(
							"Are you sure, you want to delete this role?",
							Pages.Prompts.WARNING, true, buttons);
					return false;
				});
	};

	/*
	 * $(document).keypress(function(e) { if (e.which == 13 || e.which == 0) {
	 * if ($("#overlayMessages").css("display") == "block") {
	 * $("#closePopupMessage").click(); } else if
	 * ($("#editOverlay").css("display") == "block") { if (e.which == 13)
	 * $("#saveEdit").click(); else $("#cancelEdit").click(); } else if
	 * ($("#customOverlay").css("display") == "block") { if (e.which == 13)
	 * $("#saveAdd").click(); else $("#cancelAdd").click(); } } });
	 */

	changeEntity = function(chkbox) {
		var chkIndex = chkbox.parent().index();
		var entity = $("th").eq(chkIndex).html();
		var roleId = chkbox.parent().parent().attr("name");
		var isChecked = chkbox.attr("checked");
		if (isChecked == undefined)
			editEntity(roleId, entity, false);
		else
			editEntity(roleId, entity, true);
	};

	addRole = function(roleId, more) {
		try {
			var url = getAddRoleUrl(roleId);
			// showing the busy spinner
			Pages.showBusy(StringUtils.format('Adding role "{0}"', [ roleId ]));

			var successHandler = function(data, requestObject) {
				if ("FAILURE" == data.status) {
					Pages.Prompts
							.showMessage(data.message, Pages.Prompts.ERROR);
				} else if ("SUCCESS" == data.status) {
					Pages.Prompts.showMessage(StringUtils.format(
							'Added role "{0}"', [ roleId ]),
							Pages.Prompts.SUCCESS, true);
					if (more)
						Pages.takeToUrl(StringUtils.format(
								"{0}/roles.xhtml?addMore=true&role={1}", [
										Permission.baseUrl, roleId ]));
					else
						Pages.takeToUrl(StringUtils.format("{0}/roles.xhtml",
								[ Permission.baseUrl ]));
				}
				// turn off the busy spinner.
				Pages.hideBusy();
			};

			var errorHandler = function(request, status, error, requestObject) {
				// turn off the busy spinner.
				Pages.hideBusy();
				Pages.Prompts.showMessage(request.message, Pages.Prompts.ERROR,
						true);
			};

			var ajaxRequest = new Permission.io.AjaxRequest(null, url, 'POST',
					successHandler, errorHandler);
			ajaxRequest.send();

		} catch (exception) {
			Pages.Prompts.showMessage(exception, Pages.Prompts.ERROR);
		}
	};

	editRole = function(roleId, newRole) {
		try {
			var url = getEditRoleUrl(roleId, newRole);
			// showing the busy spinner
			Pages
					.showBusy(StringUtils.format('Editing role "{0}"',
							[ roleId ]));

			var successHandler = function(data, requestObject) {
				if ("FAILURE" == data.status) {
					Pages.Prompts
							.showMessage(data.message, Pages.Prompts.ERROR);
				} else if ("SUCCESS" == data.status) {
					Pages.Prompts.showMessage(StringUtils.format(
							'Edited role "{0}"', [ roleId ]),
							Pages.Prompts.SUCCESS, true);
					Pages.takeToUrl(StringUtils.format(
							"{0}/roles.xhtml?role={1}", [ Permission.baseUrl,
									newRole ]));
				}
				// turn off the busy spinner.
				Pages.hideBusy();
			};

			var errorHandler = function(request, status, error, requestObject) {
				// turn off the busy spinner.
				Pages.hideBusy();
				Pages.Prompts.showMessage(request.message, Pages.Prompts.ERROR,
						true);
			};

			var ajaxRequest = new Permission.io.AjaxRequest(null, url, 'PUT',
					successHandler, errorHandler);
			ajaxRequest.send();

		} catch (exception) {
			Pages.Prompts.showMessage(exception, Pages.Prompts.ERROR);
		}
	};

	deleteHandler = function(roleId) {
		try {
			var url = getDeleteUrl(roleId);
			// showing the busy spinner
			Pages.showBusy(StringUtils
					.format('Deleting role "{0}"', [ roleId ]));

			var successHandler = function(data, requestObject) {
				if ("FAILURE" == data.status) {
					Pages.Prompts
							.showMessage(data.message, Pages.Prompts.ERROR);
				} else if ("SUCCESS" == data.status) {
					Pages.Prompts.hideMessage();
					TableUtils.deleteRow($(StringUtils.format("[name='{0}']",
							[ roleId ])));
				}
				// turn off the busy spinner.
				Pages.hideBusy();

			};

			var errorHandler = function(request, status, error, requestObject) {
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

	editEntity = function(roleId, entity, isChecked) {
		try {
			var url = getEditEntityUrl(roleId, entity);
			// showing the busy spinner
			Pages.showBusy(StringUtils.format('Updating Entity "{0}" in {1}', [
					entity, roleId ]));

			var successHandler = function(data, requestObject) {
				if ("FAILURE" == data.status) {
					Pages.Prompts
							.showMessage(data.message, Pages.Prompts.ERROR);
				}
				// turn off the busy spinner.
				Pages.hideBusy();

			};

			var errorHandler = function(request, status, error, requestObject) {
				// turn off the busy spinner.
				Pages.hideBusy();
				Pages.Prompts.showMessage(error, Pages.Prompts.ERROR);
			};

			if (isChecked)
				getPost = 'POST';
			else
				getPost = 'DELETE';
			var ajaxRequest = new Permission.io.AjaxRequest(null, url, getPost,
					successHandler, errorHandler);
			ajaxRequest.send();

		} catch (exception) {
			Pages.Prompts.showMessage(exception, Pages.Prompts.ERROR);
		}

	};

	getAddRoleUrl = function(roleId) {
		return StringUtils.format("{0}/rest/role?role={1}", [
				Permission.baseUrl, roleId ]);
	};

	getEditRoleUrl = function(roleId, newRole) {
		return StringUtils.format("{0}/rest/role?role={1}&newRole={2}", [
				Permission.baseUrl, roleId, newRole ]);
	};

	getDeleteUrl = function(roleId) {
		return StringUtils.format("{0}/rest/role?role={1}", [
				Permission.baseUrl, roleId ]);
	};

	getEditEntityUrl = function(roleId, entity) {
		return StringUtils.format("{0}/rest/entity?role={1}&entity={2}", [
				Permission.baseUrl, roleId, entity ]);
	};

})();

$(document).on(
		"pageLoad",
		function() {
			Pages.Roles.attachEventHandlers();
			// Pages.CustomPrompts.showDiv('customOverlay');
			if (QueryParameters["role"] != undefined)
				$("#lastAction").html(
						StringUtils.format("Role '{0}' was added.",
								[ QueryParameters["role"] ]));
			if ("true" == QueryParameters["addMore"])
				// addMore is true - it means that the user had selected "Save
				// and Add
				// More".
				// and hence we need to show the pop-up again.
				$("#addNew").click();
			$(".slide-menu").show();
			$(".menuli .selected").removeClass("selected");
			$("#roleLink").addClass("selected");

		});