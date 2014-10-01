var chkBox = [];

Pages.Mappings = new (function() {
	var that = this;

	this.showGrid = function() {

		var myUrl = StringUtils.format("{0}/rest/mapping",
				[ Permission.baseUrl ]);
		$('#loaderDiv').show();
		$.ajax({
			contentType : "application/json",
			dataType : 'json',
			type : 'GET',
			url : myUrl,
			data : JSON.stringify(null),
			success : function(respData) {
				function insertDataToGrid(mydata, roles) {

					var cols = [];
					cols.push('Component');
					cols.push('Permission');

					var models = [];
					models.push({
						name : 'Component',
						index : 'Component',
						//width : 150,
						sorttype : 'int',
						frozen : true,
						autowidth: true
						
					});
					models.push({
						name : 'Permission',
						index : 'Permission',
						//width : 150,
						sorttype : 'int',
						frozen : true,
						autowidth: true
					});

					for (var i = 0; i < roles.length; i++) {
						cols.push(roles[i].role);
						models.push({
							name : roles[i].role,
							index : roles[i].role,
							title : roles[i].role,
							autowidth: true,
							//width : 120,
							align : 'center',
							formatter : 'checkbox',
							edittype : 'checkbox',
							editoptions : {
								value : 'yes:no',
								defaultValue : 'yes'
							},
							formatoptions : {
								disabled : false
							}
						});

					}

					jQuery("#list").jqGrid({
						datatype : "local",
						loadtext: "Loading...",
						colNames : cols,
						colModel : models,
						shrinkToFit : false,
						viewrecords : true,
						sortorder : "desc",
						caption : "View/Edit Mappings",
						autowidth: true,
						pager: "#pager",
				        rowNum: 20,
				        rowList: [10,20,30],
				        height: "500"
					});
					jQuery("#list").jqGrid('setFrozenColumns');

					for (var i = 0; i <= mydata.length; i++) {
						jQuery("#list").jqGrid('addRowData', i + 1, mydata[i]);
					}
				}
				insertDataToGrid(respData.value.mappings, respData.value.roles);
				that.attachEventHandlers(/* responseData.roles */);
			},
			complete : function() {
				$('#loaderDiv').hide();
			},
			error : function(request, status, error) {
				console.log(error);
			}
		});
	};

	this.attachEventHandlers = function(/* roles */) {

		$('[type="checkbox"]').change(function() {
			chkBox.push($(this));
			$("#notifySave").html("Warning: There are unsaved changes");
		});

		$("#saveAll").click(function() {
			while (chkBox.length > 0) {
				var chkbox = chkBox.pop();
				changeMapping(chkbox);
			}
			$("#notifySave").html("");
			return false;
		});

		$("#cancel").click(
				function() {
					Pages.takeToUrl(StringUtils.format("{0}/mappings.xhtml",
							[ Permission.baseUrl ]));
					return false;
				});

		changeMapping = function(chkbox) {
			var row = chkbox.parent().parent();
			var componentId = row.children().eq(0).attr("title");
			var permissionId = row.children().eq(1).attr("title");
			var chkIndex = chkbox.parent().index();
			var roleId = $("#list").jqGrid("getGridParam", "colModel")[chkIndex].name;
			var isChecked = chkbox.attr("checked");
			if (isChecked == undefined)
				editMapping(componentId, permissionId, roleId, false);
			else
				editMapping(componentId, permissionId, roleId, true);
		};

		editMapping = function(componentId, permissionId, roleId, isChecked) {
			try {
				var url = getEditMappingUrl(componentId, permissionId, roleId);
				// showing the busy spinner
				Pages.showBusy(StringUtils.format(
						'Updating Mapping of "{0}" with "{1}"', [ permissionId,
								roleId ]));

				var successHandler = function(data, requestObject) {
					if ("FAILURE" == data.status) {
						Pages.Prompts.showMessage(data.message,
								Pages.Prompts.ERROR);
					} else if ("SUCCESS" == data.status) {

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
				if(isChecked)
					getPost='POST';
				else
					getPost='DELETE';
				var ajaxRequest = new Permission.io.AjaxRequest(null, url,
						getPost, successHandler, errorHandler);
				ajaxRequest.send();

			} catch (exception) {
				Pages.Prompts.showMessage(exception, Pages.Prompts.ERROR);
			}

		};

		getEditMappingUrl = function(componentId, permissionId, roleId) {
				return StringUtils
						.format(
								"{0}/rest/mapping?component={1}&permission={2}&role={3}",
								[ Permission.baseUrl, componentId,
										permissionId, roleId ]);
		};

	};
})();

$(document).on("pageLoad", function() {
	setTimeout(Pages.Mappings.showGrid, 0);
	// $('[type="checkbox"]').change(function(){
	// var t=null;
	// });
	$(".slide-menu").show();
	$(".menuli .selected").removeClass("selected");
	$("#mappingLink").addClass("selected");
});