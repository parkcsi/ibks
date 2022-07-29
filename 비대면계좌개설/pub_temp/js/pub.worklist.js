/*
	@ Title : �ۺ��� worklist js
	@ Author : Choi wonhyuk
	@ Desc : 
*/

var ieBlock;;
var startN = 3;   // ��ĭ ä�� �� index ����. ex) 2 �� ��� 0 ~ 2 ����
var containDiv; 
var nodata_msg  = "�˻�� �� �����ִµ�?";   // �˻� ��� ������ ���� �� �ؽ�Ʈ
var htmlLinkIndex = 6,    // html ��ũ �ο� �� �� index
	  dateTxtIndex = 7       // date class �ο� �� �� index , �ش� ���� �Ϸᳯ¥ �Է�
	  schCanIndex = 5;;    // �˻� �� �ؽ�Ʈ ã�� ������ �� index
	  filterInd = 0;
var trLen ,compLen,inCompLen, progressPer;     // publishing staus  �� �� �׸� ���� ����
var columnWid = ['10%','20%','20%','10%','20%','10%','10%'];   // �� ���� ��� width ����  , colgroup�� width �������� ����.
var $filterHtml ='';           // 1depth filtering�� ������ html ���� ����
var $searchHtml = '';     // �˻� ������ ������ html ���� ����
var $statusHtml = '';      // �ۺ��� ��Ȳ ������ ������ html ���� ����
var $stickyHtml = '';       // ���������� ������ html ���� ���� 
var pubGuide= {
	init : function(cDiv){
		containDiv = cDiv;
		trLen = $(containDiv+':visible').find('tbody tr:not(.delete,.not)').length;     // ȭ�� load�� tbody�� tr�� ������ ����.
		this.userAgentCheck();                                    // ie ������ ȭ�� ���� �Ƚ�Ű���� userAgent üũ  -  ����Ϸ� �������� ie�� ����������.
		if(!ieBlock){
			this.fillTd();
			this.dateSet();
			this.linkSet();
			this.guideUtil();
			this.frameView();   // �����or������ worklist �϶��� �����
			//this.popupView();   // ����� worklist �϶��� ����� 
		}else{
			$('body').empty();
		}
	},
	fillTd : function(){
		$(containDiv+':visible').each(function(){ // �� td �� ������ ���� row �� ����� ���Ͽ� ä��
			$('tbody tr:visible',this).each(function() {
				for (var ooo = 0; ooo<=startN ;ooo++ ){
					if((ooo === 0 && $.trim($(this).find('td').eq(ooo).text()) === '') || (ooo>0 && $.trim($(this).find('td').eq(ooo).text()) === '' && $(this).find('td').eq(ooo-1).text() === $(this).prevAll('tr:visible:first').find('td').eq(ooo-1).text())){
						$(this).find('td').eq(ooo).html($(this).prevAll('tr:visible:first').find('td').eq(ooo).text());
					}
				}
			});
		});
		pubGuide.refreshMerge();
	},
	resetMerge : function (){  // td�� ����� rowspan ���� �� hide ��Ų td show
		$(containDiv+':visible').each(function(){
			$('tbody tr',this).each(function(){
				$(this).find('td').removeAttr('rowspan').show();
			});
		});
	},
	refreshMerge : function(){  // ���� text �� ���� td �� rowspan ��Ű�� rowspan �� td�� ��ġ�� td�� hide ó�� or text �� hidden ó��
		pubGuide.resetMerge();
		var that;
		$(containDiv+':visible').each(function(){
			var seen = {};
			$('tbody tr',this).removeClass('odd even line_break');
			$('tbody tr:visible:odd',this).addClass('odd');
			$('tbody tr:visible:even',this).addClass('even');
			for (var i = startN; i>=0 ; i--){
				var rowCnt = 0;
				var rowspan;
				$('tbody tr:visible:not(.nodata)',this).each(function() {
					$(this).find('td:visible').eq(i).each(function(){
						if($(this).find('span').length<=0 && $.trim($(this).text())!=''){
							$(this).html($('<span />').text($(this).text()));
						}
						var rdCnt = 0;
						var index =  $(this).index();
						var txt = $.trim($(this).text());
						for (var ddd = i; ddd >= 0 ; ddd --){
							if($(this).parent().find('td').eq(ddd).text() === $(this).parent().prevAll('tr:visible:first').find('td').eq(ddd).text() && $(this).parent('tr').find('td').eq(ddd).text() != ''){
								rdCnt++;
							}
						}

						if (seen[index] === txt && txt !='' && rdCnt >= i) {
							/*
							rowspan = $(that).attr("rowspan") || 1;
							rowspan = Number(rowspan)+1;
							$(that).attr({
								'rowspan' : rowspan,
							});
							$(this).hide();
							*/
							$('>span',this).css({
								visibility:'hidden'
							});
						}else {
							if(i === 0){
								$(this).parent().addClass('line_break');
							}
							$('>span',this).css({
								visibility:'visible'
							});
							seen[index] = txt;
							that = this;
						}
						if($(this).parent().hasClass('line_break')){
							$(this).parent().find('td span').css({
								visibility:'visible'
							});
						}
					});
				});
			}
		});
	},
	tableFIlter : function(){
		/*
			title : tableFilter
			desc : ��ư Ŭ���� �ش� 1depth ���� ��Ŵ
		*/ 
		var $filterTxt = [];
		//$filterTxt.sort();
		
		$('tbody tr:visible',containDiv+':visible').each(function() {
			$('td:eq('+filterInd+')', this).each(function(){
				if($.trim($(this).text())!=''){
					var insTxt = $(this).text();
				}
				if($filterTxt.indexOf(insTxt)<0){
					$filterTxt.push(insTxt);
				}
			});
		});

		$filterHtml += '<div class="dpFilter">\n';
		$filterHtml += '		<button type="button" class="checked">��ü</button>\n';
		for (var txtN = 0; txtN <= $filterTxt.length-1; txtN++){
			$filterHtml += '		<button type="button">'+$filterTxt[txtN]+'</button>\n';
		}
		$filterHtml += '</div>'
		
		$('.pub_util .pub_util_inner').prepend($filterHtml);

		$('.dpFilter button').click(function(ev){
			$('tbody tr',containDiv+':visible').show();
			$('.pub_status .total').addClass('check').siblings().removeClass('check');
			$(this).addClass('checked').siblings().removeClass('checked')
			if($(this).text() != '��ü'){
				$('.pub_search').hide()
				$('tbody tr',containDiv+':visible').addClass('f_hide').hide();
				filterKeyword($(this).text());
				if($('.pub_status').length>0){
					$('.filter_reset').remove();
					$('.dpFilter').append('<button type="button" class="filter_reset"></button>');
					$('.filter_reset').click(function(){
						$('.dpFilter button:first').trigger('click')
					});
					pubGuide.statusReload($(this).text());
				}
			}else{
				$('tbody tr',containDiv+':visible').removeClass('f_hide');
				$('.pub_status').removeClass('filter');
				$('.pub_search').show();
				$('.filter_reset').remove();
				if($('.pub_status').length>0){
					pubGuide.statusReload();
				}
			}
			pubGuide.refreshMerge();
			$('.pub_search input[type="text"]').val('');
			$('tbody tr.nodata',containDiv+':visible').remove();
		});

		function filterKeyword(keyword){
			$('tbody tr',containDiv+':visible').each(function(){
				if($(this).find('td').eq(filterInd).text() === keyword){
					$(this).removeClass('f_hide').show();
				}
			});
		}
	},
	statusReload : function(text1){
		if(!text1){
			$('.pub_status .total .txt').html('��ü');
			$('.pub_status .total .num').html(trLen)
			$('.pub_status .complete .txt').html('�Ϸ�');
			$('.pub_status .complete .num').html(compLen)
			$('.pub_status .incomplete .txt').html('�̿Ϸ�');
			$('.pub_status .incomplete .num').html(inCompLen)
			$('.pub_status .progress .txt').html('��ô��');
			$('.pub_status .progress .num').html(progressPer);
		}else{
			var stProgress = $('tbody tr.comp:visible',containDiv+':visible').length >0 ?  Math.floor(($('tbody tr.comp:visible',containDiv+':visible').length / $('tbody tr:not(.delete,.not):visible',containDiv+':visible').length)*100)  : 0
			$('.pub_status .total .txt').html('<span class="word">'+text1+'</span>');
			$('.pub_status .total .num').html($('tbody tr:not(.nodata,.delete,.not):visible',containDiv+':visible').length)
			$('.pub_status .complete .txt').html('<span class="word">'+text1+'</span> �Ϸ�');
			$('.pub_status .complete .num').html($('tbody tr.comp:visible',containDiv+':visible').length)
			$('.pub_status .incomplete .txt').html('<span class="word">'+text1+'</span> �̿Ϸ�');
			$('.pub_status .incomplete .num').html($('tbody tr:not(.nodata , .comp , .delete , .not):visible',containDiv+':visible').length)
			$('.pub_status .progress .txt').html('<span class="word">'+text1+'</span> ��ô��');
			$('.pub_status .progress .num').html(stProgress+'% ')
		}
	},
	dateSet : function(){
		/*
			title : dateSet
			desc : ��¥ ���� ��ȿ�� �˻� , YYYY-MM-DD ������ ��¥�� ���� 
					   ��¥�� �ԷµǸ� �Ϸ�� �Ǵ��Ͽ� tr�� comp class �ο�
		*/ 
		var fm = /^(19[7-9][0-9]|20\d{2})[\.\-](0[0-9]|1[0-2])[\.\-](0[1-9]|[1-2][0-9]|3[0-1])$/;    
		$('tbody tr',containDiv+':visible').each(function(){
			if(!$(this).find('td.date').length>0){
				$(this).find('td:eq('+dateTxtIndex+')').addClass('date');
			}
			$('td.date',this).each(function(){
				if($(this).text()&&fm.test($(this).text())&&!$(this).parent().hasClass('delete')){
					$(this).parent().addClass('comp');
				}else if($(this).text()==='����' || $(this).text()==='�۾����ƴ�'){
					$(this).parent().addClass('delete');
					trLen--;
				}
			});
		});
	},
	linkSet : function(){
		/*
			title : linkSet
			desc : td.html �ȿ� ���ִ� text�� a �±� link �� �ο���  
					   td.html�� ������ text �� ���/���ϸ����� set �ϰ� ��� ǥ�� �������� ��ġ�� text�� file name���� ����
		*/ 
		$('tbody tr',containDiv+':visible').each(function(){
			if(!$(this).find('td.html').length>0){
				$(this).find('td:eq('+htmlLinkIndex+')').addClass('html');
			}
			$('td.html',this).each(function(){
				var _htmlLink = $(this).text().replace('.html','');
				var _fileName = _htmlLink.split('/')[_htmlLink.split('/').length-1];
				if($(this).parent().hasClass('delete')){
					$(this).html('<span>'+_fileName+'</span>');
				}else{
					if($(this).text()){
						$(this).html('<a class="page_link" href="'+_htmlLink+'.html" target="_blank">'+_fileName+'</a>')
					};	
				}
			});
		});
	},
	searchTxt : function(){
		$('tbody tr.nodata',containDiv+':visible').remove();
		$('tbody tr:not(.f_hide)',containDiv+':visible').show();
		searchKeyword($('#schTxt').val());
		pubGuide.refreshMerge();

		function searchKeyword(keyword){
			$('tbody tr:not(.f_hide):visible',containDiv+':visible').each(function(){
				if($(this).find('td:contains('+keyword+')').length>0 && $(this).find('td:contains('+keyword+')').index()<=schCanIndex && ! $(this).is('.delete , .not')){
					$(this).removeClass('f_hide').show();
				}else{
					$(this).addClass('f_hide').hide();
				}
			});
			if($('tbody tr:visible',containDiv+':visible').length<=0){
				$('tbody',containDiv+':visible').append('<tr class="nodata"><td colspan="'+$('thead th',containDiv+':visible').length+'"><div>'+nodata_msg+'</div></td></tr>');
			};
		};
	},
	userAgentCheck : function(){
		var userAgent = navigator.userAgent;
		if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("rv:11.0") > -1) {
			return ieBlock = true;
		}else{
			return ieBlock = false;
		}
	},
	frameView : function(){ 
		/*
			frameView 
			Ŭ���� ��ũ�� html�� ��â�� �ƴ� iframe���� �����
			�˻����� ���� ��ư ��ġ�� ���� toggle ó�� ��Ŵ
		*/
		$('.search_wrap').prepend('<button type="button" class="frame_view_btn"></button>');
		$('.frame_view_btn').bind({
			'click' : function (ev){
				if(compLen>0){
					if($(this).attr('data-init') != 'true'){
						$(this).attr('data-init' , 'true');
						$('tbody tr',containDiv+':visible').each(function(){
							var _selFileName = $(this).find('td.html a.page_link');
							if($(this).hasClass('comp')  && !$(this).hasClass('delete') && _selFileName.text()!=''){
								$('.frame_view select#oh').append('<option value="'+_selFileName.attr('href')+'">'+_selFileName.text()+'</option>');
							}
						});
					}
					if(!$(this).hasClass('active')){
						$(this).addClass('active')
						$('tbody td.html',containDiv+':visible').each(function(){
							$(this).find('.frame').remove();
							if($(this).parent().hasClass('comp')){
								$(this).find('a').after('<a href="'+$(this).find('a').attr('href')+'" class="frame"></a>');
							};
							$('tbody td.html .frame',containDiv+':visible').unbind('click').bind({
								'click' : function (ev){
									var frameHref = $(this).attr('href');
									$('.frame_view select#oh option').each(function(){
										if($(this).val() === frameHref){
											
											$('#oh option').eq($(this).index()).prop('selected',true);
											$('.frame_view select#oh').trigger('change');
										}
									});
									$('.frame_wrap').show();
									$('body').css({
										'overflow' : 'hidden'
									});
									ev.preventDefault();
								}
							});
						});
					}else{
						$(this).removeClass('active');
						$('tbody td.html .frame',containDiv+':visible').remove();
					}
				}
				
				ev.preventDefault();
			}
		});
		
		$('.frame_view').find('.resize').bind({
			'mousedown' : function(ev){
				$(document).bind('selectstart',function(){ event.preventDefault();});
				$(document).bind('dragstart',function(){ event.preventDefault();});
				var _this = $(this);
				$(document).bind({
					'mousemove' : function(ev){
						$('.window').show()
						if(_this.hasClass('e')){
							$('.frame_view').css({
								'width' : ev.pageX - $('.frame_view').offset().left
							});
							$('body').css('cursor','e-resize');
						}else if(_this.hasClass('s')){
							$('.frame_view').css({
								'height' : ev.pageY - $('.frame_view').offset().top 
							});
							$('body').css('cursor','s-resize');
						}else if(_this.hasClass('es')){
							$('.frame_view').css({
								'width' : ev.pageX - $('.frame_view').offset().left ,
								'height' : ev.pageY - $('.frame_view').offset().top
							});
							$('body').css('cursor','es-resize');
						}
					},
					'mouseup' : function(){
						$('.window').hide();
						$(document).unbind('mousemove selectstart dragstart');
						$('.frame_view').unbind('mousedown');
						$('body').css('cursor','auto')
					}
				})
			}
		});
		
		$(document).keydown(function(e){
			if($('.frame_view').is(':visible')){
				if(e.keyCode == 37){    //Ű���� ȭ��ǥ ��
					$('.frame_view .prev').focus().trigger('click');
				}else if(e.keyCode == 39){//Ű���� ȭ��ǥ ��
					$('.frame_view .next').focus().trigger('click');
				}else if(e.keyCode == 116){  // Ű���� F5
					$('#oh').trigger('change');
					return false;
				}
			}
		});

		$('.frame_view select#oh').change(function(){
			$('.frame_view select#oh option:selected').prev().prop('selected',false)
			$('.frame_view iframe').attr('src',$('.frame_view select#oh option:selected').val());
			$('.file_name').text($('.frame_view select option:selected').text())
		});
		$('.frame_view .next').click(function(){
			var dd = $('#oh ').prop('selectedIndex');
			if(dd<$('#oh option').length-1){
				dd++
			}else{
				dd = 0
			}
			$('#oh option').eq(dd).prop('selected',true)
			$('#oh').trigger('change');
		});
		$('.frame_view .prev').click(function(){
			var dd = $('#oh ').prop('selectedIndex');
			if(dd<0){
				dd = $('#oh option').length-1
			}else{
				dd--
			}
			$('#oh option').eq(dd).prop('selected',true)
			$('#oh').trigger('change');
		});
		
		$('.dimmed').click(function(){
			$('body').removeAttr('style');
			$('.frame_wrap').hide();
			$(document).unbind('selectstart dragstart');
		});
	},
	popupView : function(){
		$('tbody tr td.html a').click(function(ev){
			openPopUp($(this).attr('href'),$(this).text())
			ev.preventDefault();
		});
		function openPopUp(url, name){
			var options = 'width=375, height=667, top=30, left=30, resizable=yes, scrollbars=no, location=no';
			var dd = window.open(url, name, options);
		}
	},
	guideUtil : function(){
		/*
			title : guideUtil
			desc : ��Ÿ �ʿ��� ��Ҹ� �ش� ������ ����
					   1. head �ȿ� title �� �ִ� text�� ������ h1#title �� �ش� �ؽ�Ʈ ����
					   2. ��ü html�� �� , �Ϸ� html���� , ��ô�� count
					   3. filter, search ���� ����,����
		*/ 
		compLen = $('tbody tr.comp',containDiv+':visible').length
		inCompLen = trLen - compLen;
		progressPer = Math.floor((compLen / trLen)*100)+'%';


		$searchHtml += '<div class="pub_search">\n';
		$searchHtml += '	<form action="" onsubmit="return false;">\n';
		$searchHtml += '		<input type="text" name="" id="schTxt" autocomplete="off">\n';
		$searchHtml += '		<button type="submit"></button>\n';
		$searchHtml += '		<button type="button" class="reset"></button>\n';
		$searchHtml += '	</form>\n';
		$searchHtml += '</div>\n';


		$statusHtml = '<div class="pub_status_wrap">\n'
		$statusHtml += '	<h2>Publishing Status</h2>\n';
		$statusHtml += '	<div class="pub_status">\n';
		$statusHtml += '		<div class="total check"><div class="inner"><div class="txt"></div><div class="num"></div></div></div>\n';
		$statusHtml += '		<div class="complete"><div class="inner"><div class="txt"></div><div class="num"></div></div></div>\n';
		$statusHtml += '		<div class="incomplete"><div class="inner"><div class="txt"></div><div class="num"></div></div></div>\n';
		$statusHtml += '		<div class="progress"><div class="inner"><div class="txt"></div><div class="num"></div></div></div>\n';
		$statusHtml += '	</div>\n';
		$statusHtml += '</div>';

		$(containDiv+':visible').before($statusHtml);
		pubGuide.statusReload();

		$(containDiv+':visible').before('<div class="pub_util_wrap"><div class="pub_util"><div class="pub_util_inner"><div class="search_wrap">'+$searchHtml+'</div></div></div></div>');

		$stickyHtml += '<div class="sticky_header">\n';
		$stickyHtml += '	<div class="sticky_header_inner">\n';
		for (var thNum = 0;thNum<columnWid.length ; thNum++){
			$stickyHtml += '		<div class="sticky_cell" style="width:'+columnWid[thNum]+'">'+$('thead th',containDiv+':visible').eq([thNum]).text()+'</div>';
		}
		$stickyHtml +=	'</div>\n'
		$stickyHtml += '</div>\n'

		$('.pub_util_wrap .pub_util').append($stickyHtml);
		pubGuide.tableFIlter();

		$('#title').text($('title').html());

		$('.pub_status .total').click(function(){
			$(this).addClass('check').siblings().removeClass('check');
			$('tbody tr:not(.f_hide)' , containDiv+':visible').show();
			pubGuide.refreshMerge();
			$('.pub_util').show();
		});

		$('.pub_status .complete').click(function(){
			if($(this).find('.num').text()!='0' && $(this).find('.num').text()!=$('.pub_status .total .num').text()){
				$(this).addClass('check').siblings().removeClass('check');
				$('tbody tr.comp:not(.f_hide , .delete , .not)' , containDiv+':visible').show();
				$('tbody tr:not(.comp , .f_hide, .nodata)' , containDiv+':visible').hide();
				pubGuide.refreshMerge();
			}
		});
		$('.pub_status .incomplete').click(function(){
			if($(this).find('.num').text()!='0' && $(this).find('.num').text()!=$('.pub_status .total .num').text()){
				$(this).addClass('check').siblings().removeClass('check');
				$('tbody tr:not(.f_hide)' , containDiv+':visible').hide();
				$('tbody tr:not(.comp , .f_hide, .delete , .not)' , containDiv+':visible').show();
				pubGuide.refreshMerge();
			}
		});

		$('.pub_search #schTxt').keyup(function(){
			if($.trim($('#schTxt').val())===''){
				$('.pub_search button.reset').hide();
				$('.pub_status .total').addClass('check').siblings().removeClass('check');
				$('tbody tr' , containDiv+':visible').removeClass('f_hide').show();
				$('.dpFilter button').removeAttr('disabled');
				$('tbody tr.nodata' , containDiv+':visible').remove();
				pubGuide.statusReload();
				pubGuide.refreshMerge();
			}else{
				$('.pub_search button.reset').show();
			}
		});
		$('.pub_search form').submit(function(){
			$('.pub_status .total').addClass('check').siblings().removeClass('check');
			$('tbody tr' , containDiv+':visible').removeClass('f_hide').show();
			if($.trim($('#schTxt').val())!=''){
				$('tbody tr.delete ,tbody tr.not' , containDiv+':visible').hide();
				$('.dpFilter button').attr('disabled','disabled');
				pubGuide.searchTxt();
				pubGuide.statusReload($('#schTxt').val()+' ��(��) ���Ե�');
			}
		});
		$('.pub_search button.reset').click(function(){
			$('.pub_search #schTxt').val('').trigger('keyup');
		});

		for (var colmn = 0; colmn<columnWid.length; colmn++){
			$('thead th',containDiv+':visible').eq(colmn).css({
				'width' : columnWid[colmn]
			});
		}

		$(window).scroll(function(){
			if($(window).scrollTop() > $('.pub_util_wrap').offset().top){
				$('.pub_util_wrap').css({
					height : $('.pub_util_wrap .pub_util_inner').outerHeight()
				})
				$('.pub_util_wrap .pub_util').addClass('sticky').css('left',-$(window).scrollLeft());
			}else{
				$('.pub_util_wrap').css({
					height : 'auto'
				})
				$('.pub_util_wrap .pub_util').removeClass('sticky').css('left',-$(window).scrollLeft());
			}
			
		});
	}
}

