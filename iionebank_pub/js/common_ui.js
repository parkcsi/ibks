var common_ui = {
	init : function(){  // 페이지 로드 시 발생할 이벤트 호출 함수 기재
		this.infoHashCtrl();
		this.tooltip();
		this.fixedBtnCtrl();
		this.quickMenu();
		this.stockFixTitle();
	},
	reload : function(){   // 동적으로 생성되는 요소에 대한 이벤트 재호춣 함수 기재
		this.infoHashCtrl();
	},
	recommendShow : function(){
		/*
			title : recommendShow 
			desc :자동완성 영역 보여주기, 팝업 전체 스크롤 방지 , 입력단어 초기화 버튼 보여주기
		*/
		if($.trim($('.search_wrap input[type="text"]').val()) != ''){
			$('.search_box .search_recommend').show();
			$('.search_box .btn_del').show();
			$('.pop_contents.search').scrollTop(0).css({
				'overflow' : 'hidden'
			});
			$('#grid').pqGrid('refresh');
		}else{
			this.recommendHide();
		}
	},
	recommendReset : function(){
		$('.search_wrap input[type="text"]').val('');
		this.recommendHide();
	}, 
	recommendHide : function(){
		/*
			title : recommendHide 
			desc :자동완성 영역 감추기, 팝업 전체 스크롤 방지 해제, 입력단어 초기화 버튼 감추기
		*/
		$('.search_box .search_recommend').hide();
		if($.trim($('.search_wrap input[type="text"]').val()) != ''){
			$('.search_box .btn_del').show();
		}else{
			$('.search_box .btn_del').hide();
		}
		$('.pop_contents.search').css({
			'overflow' : 'auto'
		});
	},
	stockFixTitle : function(){
		var titleTimer;
		if($('.info_wrap').length>0){
			$(window).scroll(function(){
				clearTimeout(titleTimer);
				if(($(window).scrollTop() > $('.info_box .info_name').offset().top)){
					$('.info_box .fixed_title').show()
					titleTimer = setTimeout(function(){
						$('.info_box .fixed_title').css({
							transform : 'translateY(0)'
						});
					},100)
				}else if($(window).scrollTop() < $('.info_box .info_name').offset().top){
					$('.info_box .fixed_title').css({
						transform : 'translateY(-100%)'
					});
					titleTimer = setTimeout(function(){
						$('.info_box .fixed_title').hide()
					},300)
				}
			});
		}
	},
	datePickerDefault : function(){
		$.datepicker.regional['kr'] = {
			closeText : '닫기',
			monthNames : ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
			monthNamesShort : ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
			dayNames :['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
			dayNamesShort :['일','월','화','수','목','금','토'],
			dayNamesMin :['일','월','화','수','목','금','토'],
			dateFormat : 'yy-mm-dd',
			showMonthAfterYear : true,
			yearSuffix : '년'
		}
		$.datepicker.setDefaults($.datepicker.regional['kr']);
	},
	quickMenu : function(){
		$('.util_menu .opener').bind({
			'click' : function(ev){
				if($(this).parent('.util_menu').hasClass('active')){
					$('body').removeClass('util');
					$('.util_menu .inner a').css('bottom',0);
					$(this).parent('.util_menu').removeClass('active');
				}else{
					$('body').addClass('util');
					$(this).parent('.util_menu').addClass('active');
					$('.util_menu .inner a').css('bottom',0);
					setTimeout(function(){
						$('.util_menu .inner a').removeAttr('style');
					},100);
				}
				
				ev.preventDefault();
			}
		})
	},
	fixedBtnCtrl : function(){
		if($('.contents .btn_fixed:visible').length>0){
			$('footer').css({
				'padding-bottom' : '110px'
			});
			$('.util_menu').css({
				'bottom' : '70px'
			});
		}
		/*$(window).scroll(function(){
			var scrPos = $(window).scrollTop() + $(window).outerHeight();
			if(($('footer:visible').length > 0 && $('.contents .btn_fixed:visible').length>0) && scrPos >= $('footer').offset().top){
				$('.contents .btn_fixed .btn_area').css({
					'bottom' : scrPos - $('footer').offset().top
				});
			}else{
				$('.contents  .btn_fixed .btn_area').removeAttr('style')
			}
		});*/
	},
	infoHashCtrl : function(){
		/*
			title : infoHashCtrl 
			desc : info_hash 영역 접기/펴기 기능
		*/
		var orgHeight = 36;
		$('.info_hash .info_hash_opener').remove();
		if($('.info_hash ul li').length>1 && ($('.info_hash ul').outerHeight() > $('.info_hash').outerHeight())){
			$('.info_hash').removeClass('active').css('height',orgHeight);
			$('.info_hash').append('<button type="button" class="info_hash_opener"  />');
			$('.info_hash_opener').unbind('click').bind({
				'click' : function (ev){
					if($('.info_hash').hasClass('active')){
						$('.info_hash').removeClass('active').css('height',orgHeight);
					}else{
						$('.info_hash').addClass('active').css('height',$('.info_hash ul').outerHeight());
					}
					ev.preventDefault();
				}
			});
		};
	},
	tooltip : function(){
		var _el = $('[data-role="tooltip"]');
		_el.each(function(){
			$('>button',this).unbind('click').bind({
				'click' : function(){
					_el.toggleClass('active');
				}
			});
			$('.tip_close' , this).unbind('click').bind({
				'click' : function(){
					_el.removeClass('active');
				}
			});
		});
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
	messageOpen : function(type,title,text){
		var msgTimer = 500;;
		$('body .message_wrap:visible').empty();
		if($('body .message_wrap').length<=0){
			$('body').append('<div class="message_wrap" />');
		}
		var msgHtml = '<div class="message" style="display:none;">\n'
        msgHtml += '	<strong class="title_type'+type+'">'+title+'</strong>\n'
        msgHtml += '	<p>'+text+'</p>\n'
        msgHtml += '	<button type="button" class="message_close"><span class="hidden">메시지 닫기</span></button>\n'
        msgHtml += '</div>'
		$('.message_wrap').prepend(msgHtml);
		$('.message_wrap .message').fadeIn(msgTimer);
		$('.message_close').click(function(){
			$('.message').fadeOut(msgTimer,function(){
			});
		});
	},
	fontSizeFit : function(el){
		var elmtSel = $(el)
		elmtSel
	}
}

$(function(){
	common_ui.init();
	common_ui.fontSizeFit('.main_info .info_num strong');
});