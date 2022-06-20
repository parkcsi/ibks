var common_ui = {
	init : function(){  // ������ �ε� �� �߻��� �̺�Ʈ ȣ�� �Լ� ����
	},
	reload : function(){   // �������� �����Ǵ� ��ҿ� ���� �̺�Ʈ ��ȣ�� �Լ� ����
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
	}
}

$(function(){
	common_ui.init();
});