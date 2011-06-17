/*

	Thumb Reel - Fluid Thumbnail Bar
	Version : 1.0
		
	Author	: Sam Dunn
	Source	: Build Internet (www.buildinternet.com)
	Company : One Mighty Roar (www.onemightyroar.com)
	License : MIT License / GPL License

*/

jQuery(function($){

	/* Variables
	----------------------------*/
	var thumbList = '#thumb-list',
		thumbTray = '#thumb-tray',
		thumbNext = '#thumb-next',
		thumbPrev = '#thumb-prev',
		thumbInterval,
		thumbCurrent = 0,
		thumbPage = 0;
	
	
	/* Setup
	----------------------------*/
	// Adjust to true width of thumb markers
	$(thumbList).width($('> li', thumbList).length * $('> li', thumbList).outerWidth(true));
	
	// Hide thumb arrows if not needed
	if ($(thumbList).width() <= $(thumbTray).width()) $(thumbPrev+","+thumbNext).fadeOut(0);
	
	// Thumb Intervals
	thumbInterval = Math.floor($(thumbTray).width() / $('> li', thumbList).outerWidth(true)) * $('> li', thumbList).outerWidth(true);
	
	//Make first thumb current
	$('li', thumbList).eq(0).addClass('current-thumb');
	
	/* Thumb Navigation
	----------------------------*/	
	$(thumbNext).click(function(){
		if (thumbPage - thumbInterval <= -$(thumbList).width()){
			thumbPage = 0;
			$(thumbList).stop().animate({'left': thumbPage}, {duration:500, easing:'easeOutExpo'});
		}else{
			thumbPage = thumbPage - thumbInterval;
			$(thumbList).stop().animate({'left': thumbPage}, {duration:500, easing:'easeOutExpo'});
		}
	});
	
	$(thumbPrev).click(function(){
		if (thumbPage + thumbInterval > 0){
			thumbPage = Math.floor($(thumbList).width() / thumbInterval) * -thumbInterval;
			if ($(thumbList).width() <= -thumbPage) thumbPage = thumbPage + thumbInterval;
			$(thumbList).stop().animate({'left': thumbPage}, {duration:500, easing:'easeOutExpo'});
		}else{
			thumbPage = thumbPage + thumbInterval;
			$(thumbList).stop().animate({'left': thumbPage}, {duration:500, easing:'easeOutExpo'});
		}
	});
	
	
	/* Window Resize
	----------------------------*/
	$(window).resize(function(){
	
		// Update Thumb Interval & Page
		thumbPage = 0;	
		thumbInterval = Math.floor($(thumbTray).width() / $('> li', thumbList).outerWidth(true)) * $('> li', thumbList).outerWidth(true);
		
		// Adjust thumbnail markers
		if ($(thumbList).width() > $(thumbTray).width()){
			$(thumbPrev+","+thumbNext).fadeIn('fast');
			$(thumbList).stop().animate({'left':0}, 200);
		}else{
			$(thumbPrev+","+thumbNext).fadeOut('fast');
		}
		
	});
	
	/* Thumb Click
	----------------------------*/
	$('li', thumbList).click(function(){
		
		$('.current-thumb').removeClass('current-thumb');
		$('li', thumbList).eq($(this).index()).addClass('current-thumb');
		
		// If list larger than tray, thumb after current, and out of view
		if (
			$(thumbList).width() > $(thumbTray).width() &&
			thumbCurrent <= $(this).index() &&
			$('.current-thumb').offset().left - $(thumbTray).offset().left >= thumbInterval
		){
    		thumbPage = thumbPage - thumbInterval;
    		$(thumbList).stop().animate({'left': thumbPage}, {duration:500, easing:'easeOutExpo'});
		}
		
		thumbCurrent = $(this).index();
		//currentThumb();
		return false;
		
	});
	
	goThumb = function(direction){
		
		$('.current-thumb').removeClass('current-thumb');
		
		//
		if (direction == 'next'){
			
			if(thumbCurrent + 1 < $('li', thumbList).length){
				thumbCurrent++;
				if ($('li', thumbList).eq(thumbCurrent).offset().left - $(thumbTray).offset().left >= thumbInterval){
    				thumbPage = thumbPage - thumbInterval;
				}
			}else{
				thumbCurrent = 0;
				thumbPage = 0;
			}
			
		} else if (direction == 'prev') {
			
			if(thumbCurrent == 0){
				thumbCurrent = $('li', thumbList).length - 1;
				thumbPage = Math.floor($(thumbList).width() / thumbInterval) * -thumbInterval;
				if ($(thumbList).width() <= -thumbPage) thumbPage = thumbPage + thumbInterval;
			}else{
				thumbCurrent--;
				if ($('li', thumbList).eq(thumbCurrent).offset().left - $(thumbTray).offset().left < 0){
					if (thumbPage + thumbInterval > 0) return false;
    				thumbPage = thumbPage + thumbInterval;
				}
			}
			
		}
		
		// Update current thumb and page
		$(thumbList).stop().animate({'left': thumbPage}, {duration:500, easing:'easeOutExpo'});
		$('li', thumbList).eq(thumbCurrent).addClass('current-thumb');
		
	};
	
	/* Keyboard Navigation
	----------------------------*/
	$(document.documentElement).keyup(function (event) {
		
		// Left Arrow or Down Arrow
		if ((event.keyCode == 37) || (event.keyCode == 40)) {
			goThumb('prev');
		// Right Arrow or Up Arrow
		} else if ((event.keyCode == 39) || (event.keyCode == 38)) {
			goThumb('next');
		}
	
	});

	
});
