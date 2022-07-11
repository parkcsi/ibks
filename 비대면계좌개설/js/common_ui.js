var common_ui = {
	init : function(){  // 페이지 로드 시 발생할 이벤트 호출 함수 기재
		common_ui.tabScroll();
	},
	reload : function(){   // 동적으로 생성되는 요소에 대한 이벤트 재호출 함수 기재
	},
	modalOpen : function(el){
		$('body').css('overflow','hidden');
		$('.modal'+el).show();
		$('.modal .modal_close').unbind('click').bind({
			'click' : function(ev){
				common_ui.modalClose();
				ev.preventDefault();
			}
		});
		$('#wrap').attr('aria-hidden','true');
	},
	modalClose : function(el){
		$('body').css('overflow','visible');
		if(el){
			$('.modal'+el).hide();
		}else{
			$('.modal:visible').hide();
		}
		if($('.modal:visible').length===0){
			$('#wrap').attr('aria-hidden','false');
		}
	},
	slideOpen : function(el){
		var _this = $('.slide'+el);
		var slideTimer ;
		_this.find('.slide_inner').css({
			transform : 'translateY(100%)'
		});
		$('body').css('overflow','hidden');
		_this.show();
		clearTimeout(slideTimer);
		slideTimer = setTimeout(function(){
			_this.find('.slide_inner').css({
				transform : 'translateY(0)'
			});
		},100);
		$('.slide .slide_close').unbind('click').bind({
			'click' : function(ev){
				common_ui.slideClose();
			}
		});
	},
	slideClose : function(){
		$('body').css('overflow','visible');
		$('.slide:visible').hide();
		$('.slide').find('.slide_inner').removeAttr('style');
	},
	depthOpen : function(el){
		var _this = $(el);
		_this.show();
		_this.closest(".slide_cont").find("> .agree_list").hide();
		_this.closest(".slide_inner").find(".slide_prev").css('display', 'inline-block');
		$('.slide_inner .slide_prev').unbind('click').bind({
			'click' : function(ev){
				common_ui.depthPrev(_this);
			}
		});
	},
	depthPrev : function(el){
		var _this = $(el);
		_this.hide();
		_this.closest(".slide_cont").find("> .agree_list").show();
		_this.closest(".slide_inner").find(".slide_prev").css('display', 'none');
	},
	tabToggle : function(el){
		var _this = $(el);
		var tab_cont = _this.closest(".tab_wrap").find(".tab_cont");
		var num = _this.parent().index();
		_this.parent().addClass("tab_on").siblings().removeClass("tab_on");
		tab_cont.eq(num).show().siblings(".tab_cont").hide();
	},
	listToggle : function(el){
		var _this = $(el);
		var list = _this.closest(".row");
		if(list.hasClass("show")){
			list.removeClass("show");
		}else{
			list.addClass("show");
		}
	},
	tabScroll : function(el){
		var _this = $(".tab_list.scroll_list");
		var list = _this.find(".tab_on");
		if(_this.length>0){
			_this.scrollLeft(list.offset().left - 24)
		}
	}
}

$(function(){
	common_ui.init();
});