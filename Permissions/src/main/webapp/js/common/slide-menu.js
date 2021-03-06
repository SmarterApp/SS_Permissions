Pages.SlideMenu = new (function() {
	  var that = this;
	  
	  this.attachEventHandlers = function() {
			$("#roleLink").click(function() {
				Pages.takeToUrl(Permission.baseUrl + '/roles.xhtml', false);
				});
			$("#componentLink").click(function() {
				Pages.takeToUrl(Permission.baseUrl + '/components.xhtml', true);
			});
			$("#permissionLink").click(function() {
				 Pages.takeToUrl(Permission.baseUrl + '/permissions.xhtml', true);
			});
			$("#mappingLink").click(function() {
				Pages.takeToUrl(Permission.baseUrl + '/mappings.xhtml', true);
			});
		
		var selectLi = function(el){
			$('.menuli.selected').removeClass('selected');
			$('#' + el.id).addClass('selected');
		};
		
		function menuClick(){
			var target = $('.slider-arrow');
			if(target.hasClass('show')){
			    $( ".slider-arrow, .secondary .nav" ).animate({
		          left: "+=221"
				  }, 700, function() {
		            // Animation complete.
		          });
				
				
				  $(".secContent").animate({'margin-left': "240px"}, 700, function(){});
				
				  target.html('&laquo;').removeClass('show').addClass('hide');
		        }
		    else {   	
		    $( ".slider-arrow, .secondary .nav" ).animate({
		      left: "-=221"
			  }, 700, function() {
		        // Animation complete.
		      });
			  
			  $(".secContent").animate({'margin-left': "0px"}, 700, function(){});
			  
			  target.html('&raquo;').removeClass('hide').addClass('show');    
		    }
			// remove the inline style to adjust the table width accordingly
			$('.dataTable').removeAttr('style');
		};
		
		$(".slider-arrow").click(menuClick);
		
	  };
	  
	  this.addSelected = function(){
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1);
		if(hashes.indexOf('copy') > -1){
			$('.menuli.copyPubLink').addClass('selected');
		}else if(hashes.indexOf('view') > -1){
			$('.menuli.viewPubLink').addClass('selected');
		}else if(hashes.indexOf('import') > -1){
			$('.menuli.createPubLink').addClass('selected');
		}else{
			
		}
	  };
})();

$(document).on("pageLoad", function() {
  // we will first load up the publishers from the rest URL.
  Pages.SlideMenu.attachEventHandlers();
  Pages.SlideMenu.addSelected();
	
});
