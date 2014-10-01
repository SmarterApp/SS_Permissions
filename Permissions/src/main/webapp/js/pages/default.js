Pages.Default = new (function() {
	var that = this;

	this.attachEventHandlers = function() {
		$("#roleBtn").click(function() {
			Pages.takeToUrl(Permission.baseUrl + '/roles.xhtml', false);
			});
		$("#componentBtn").click(function() {
			Pages.takeToUrl(Permission.baseUrl + '/components.xhtml', true);
		});
		$("#permissionBtn").click(function() {
			 Pages.takeToUrl(Permission.baseUrl + '/permissions.xhtml', true);
		});
		$("#mappingBtn").click(function() {
			Pages.takeToUrl(Permission.baseUrl + '/mappings.xhtml', true);
		});
	};
})();

$(document).on("pageLoad", function() {
	// we will first load up the publishers from the rest URL.
	Pages.Default.attachEventHandlers();
	// Pages.showBusy("pop ups are working");
//	Pages.Prompts.showMessage("prompts are working", "warning!");
});
