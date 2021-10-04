
//	company	: precedent
//	author	: kevin wilde
//	project	: univercity of york - 50 years

var uoy;

(function (uoy, WIN, DOC, $) {

	var car,
		miniCar,
		pagination,
		slide,
		slideHolder,
		length,
		index = 0,
		width = 935,
		offset = 468,
		animating = false;

	function init () {
		if($('.carousel').is('.carousel') && !$('.carousel').hasClass('static-car')) carousel();
		if ($('.mini-car').is('.mini-car')) miniCarousel();
		quoteTruncate();
		tabs();

		$('a.video').click(function (e) {
			e.preventDefault();
			addVideo($(this).attr('href'));			
		})

		if($('audio.small').is('audio')) {
			$('audio.small').mediaelementplayer({
				// width of audio player
				audioWidth: 204,
				// height of audio player
				audioHeight: 29,
				// useful for <audio> player loops
				loop: false,
				// the order of controls you want on the control bar (and other plugins below)
				features: ['playpause','progress','duration'],
				// when this player starts, it will pause other players
				pauseOtherPlayers: true
			});
		}

		if($('audio.normal').is('audio')) {
			$('audio').mediaelementplayer({
				// width of audio player
				audioWidth: 282,
				// height of audio player
				audioHeight: 29,
				// useful for <audio> player loops
				loop: false,
				// the order of controls you want on the control bar (and other plugins below)
				features: ['playpause','progress','current','duration'],
				// when this player starts, it will pause other players
				pauseOtherPlayers: true
			});
		}

		$('.static-state').click(function(){
			$(this).next().css({'visibility':'visible'});
			$(this).remove();
		});
	}

	/*function miniCarousel() {
		miniCar = $('.mini-car');

		var miniLength = miniCar.find('.slide').length;

		miniCar.find('.slide').hide();

		for (var i = 0; i < miniLength; i++) {
			var src = miniCar.find('img').eq(i).attr('src');
			miniCar.append('<a href="#"><img src="'+ src +'" /><span></span></a>');
		};

		miniCar.find('.slide:first').show();
		miniCar.find('a:first').addClass('current');
		miniCar.find('a:last').addClass('last');

		miniCar.find('a').click(function(e){
			e.preventDefault();
			var index = miniCar.find('a').index($(this));
			miniCar.find('.slide').hide().eq(index).show();
			miniCar.find('a').removeClass('current').eq(index).addClass('current');
		});
	}*/

	function miniCarousel() {
		$('.mini-car').each(function(index){
			var miniCar = $(this);
			var miniLength = miniCar.find('.slide').length;

			miniCar.find('.slide').hide();

			for (var i = 0; i < miniLength; i++) {
				var src = miniCar.find('img').eq(i).attr('src');
				miniCar.append('<a href="#"><img src="'+ src +'" /><span></span></a>');
			};

			miniCar.find('.slide:first').show();
			miniCar.find('a:first').addClass('current');
			miniCar.find('a:last').addClass('last');

			miniCar.find('a').click(function(e){
				e.preventDefault();
				var index = miniCar.find('a').index($(this));
				miniCar.find('.slide').hide().eq(index).show();
				miniCar.find('a').removeClass('current').eq(index).addClass('current');
			});
		});
	}

	function addVideo (path) {
		$('body').append(
			'<div class="overlay"></div>' +
			'<iframe class="video-player" width="560" height="315" src="' + path + '" frameborder="0" allowfullscreen></iframe>'
		);

		$('.overlay').click(function () {
			$(this).remove();
			$('iframe.video-player').remove();
		});
	}

	function tabs () {
		var tabbed = $('.tabbed'),
			titles = tabbed.find('h3'),
			content = tabbed.find('.tab-content'),
			text,
			index;

		tabbed.prepend('<ul></ul>');		
		content.hide();
		content.eq(0).show();

		for (var i = 0; i < titles.length; i++) {
			text = titles.eq(i).text();
			tabbed.find('ul').append('<li>' + text + '</li>');
		}

		titles.remove();
		tabbed.find('li:first').addClass('current');

		tabbed.find('li').click(function() {
			index = tabbed.find('li').index($(this));
			tabbed.find('.current').removeClass('current');
			$(this).addClass('current');
			content.hide();
			content.eq(index).show();
		})
	}

	function quoteTruncate() {
		var _this,
			text,
			height;

		$('.tabbed .quote').each(function () {
			_this = $(this);
			text = _this.html();
			height = _this.height();

			if (text.length >= 240) {
				_this.data({'text': text, 'height': height});
				_this.html('' + text.slice(0, 240) + '...<span>”</span>');
				_this.after('<a href="#" class="quote-trigger more">Read the full quote</a>');
				_this.css({'height': 68});
			}
		});

		$('.tabbed a.quote-trigger').click(function(e){
			e.preventDefault();

			if ($(this).hasClass('more')) {
				$(this).removeClass('more').addClass('less').text('Hide full quote');

				$(this).parent().find('p.quote').animate({'height':$(this).parent().find('p.quote').data('height')});
				$(this).parent().find('p.quote').html($(this).parent().find('p.quote').data('text'));
			} else {
				$(this).removeClass('less').addClass('more').text('Read the full quote');
				$(this).parent().find('p.quote').animate({'height':68}, function() {
					$(this).html('' + $(this).text().slice(0, 240) + '...<span>”</span>');
				});
			}
		});
	}

	function carousel () {
		car = $('.carousel');
		pagination = $('.pagination');
		slide = $('.slide');
		slideHolder = $('.slide-holder')
		length = slide.length;

		setState();
		buildPagination();

		pagination.show();
		events();
	}

	function events () {
		pagination.find('a.left').click(function(e) {
			e.preventDefault();

			if (!animating) {
				animating = true;
				slideLeft();
			}
		}).hover(
			function () {
				$('.white.left').stop(true).animate({ 'opacity': 0 });
			},
			function () {
				$('.white.left').stop(true).animate({ 'opacity': 0.75 });
			}
		);

		pagination.find('a.right').click(function(e) {
			e.preventDefault();

			if (!animating) {
				animating = true;
				slideRight();
			}
		}).hover(
			function () {
				$('.white.right').stop(true).animate({ 'opacity': 0 });
			},
			function () {
				$('.white.right').stop(true).animate({ 'opacity': 0.75 });
			}
		);

		$('.white.left').click(function() {
			if (!animating) {
				animating = true;
				slideLeft();
			}
		});

		$('.white.right').click(function() {
			if (!animating) {
				animating = true;
				slideRight();
			}
		});

		$('.white').hover(
			function () {
				$(this).stop(true).animate({ 'opacity': 0 });
				if ($(this).hasClass('left')) pagination.find('a.left').addClass('active');
				else pagination.find('a.right').addClass('active');
			},
			function () {
				$(this).stop(true).animate({ 'opacity': 0.75 });
				pagination.find('a').removeClass('active');
			}
		)

		slide.hover(
			function () {
				//do nothing
			},
			function () {
				$(this).find('.rollover').stop(true).animate({ 'opacity': 0 });
			}
		)

		car.find('.panel').hover(
			function () {
				$(this).parent().find('.rollover').stop(true).animate({ 'opacity': 0.4 });
				$(this).find('.rollover').stop(true).animate({ 'opacity': 0 }, function	() {
					if ($(this).parent().hasClass('audio')) $(this).hide();
				});				
			},
			function () {
				$(this).find('.rollover').show().stop(true).animate({ 'opacity': 0.4 });
			}
		)
	}

	function slideLeft () {
		if ( index - 2 < 0 ) slide.eq((index - 2) + length).css({'right': width * 2 + 10}).show();
		else slide.eq(index - 2).css({'right': width * 2 + 10}).show();

		slideHolder.animate({'margin-left': width - offset + 6}, 1000, function(){
			index--;
			if(index < 0) index = length - 1;
			
			updatePagination();
			setState();
		});
	}

	function slideRight () {
		if ( index + 2 > length - 1 ) slide.eq((index + 2) - length).css({'left': width * 2 + 10}).show();
		else slide.eq(index + 2).css({'left': width * 2 + 10}).show();

		slideHolder.animate({'margin-left': (width + offset + 4) * -1}, 1000, function(){
			index++;
			if(index + 1 > length) index = 0;

			updatePagination();
			setState();
		});
	}

	function setState() {
		slide.removeAttr('style');
		slideHolder.removeAttr('style');

		slide.eq(index).show();

		if ( index >= length - 1 ) slide.eq(0).css({'left': width + 5}).show();
		else slide.eq(index + 1).css({'left': width + 5}).show();

		if ( index >= 1 ) slide.eq(index - 1).css({'right': width + 5}).show();
		else slide.eq(length - (index + 1)).css({'right': width + 5}).show();

		animating = false;
	}

	function buildPagination () {
		for (var i = 0; i < length; i++) {
			pagination.find('ul').append('<li></li>');
		};

		pagination.show();
		updatePagination();
	}

	function updatePagination () {
		pagination.find('.current').removeClass('current');
		pagination.find('li').eq(index).addClass('current');
	}

	//document ready function, "There can be only one!" ~The Highlander
	$(function () { init();	});

	return uoy;

}(uoy = uoy || {}, window, document, jQuery));


// University of York additions
$("blockquote.quote p:first-child").addClass("quote"); 

$(".captionedimage.right, .captionedimage.left ").each(function(){
	var imgWidth = $(this).children("img").attr("width"); 
	$(this).css("width", imgWidth); 
}) ; 

//Number each of the slides in a carousel
$(".slide").each(function(i) {
	$(this).attr("id","slide-"+(i+1)); 
}); 

//Add a click event to each carousel link to register an event with Google Analytics
$("a[class='rollover']").click(function() {
	var slideNumber = $(this).closest("div[id^='slide-']").attr("id");  
	var url = $(this).attr("href"); 
	var position = $(this).parent("div[class*='panel']").attr("class"); 
	trackOutboundLink(this, 'Carousel', slideNumber+' clicked', url + ' - ' + position); 
	return false; 
}); 

// Left and right pagination buttons
$(".pagination a.left").click(function() {
	pageTracker._trackEvent('Carousel', 'Pagination' , 'Left'); 
}); 

$(".pagination a.right").click(function() {
	pageTracker._trackEvent('Carousel', 'Pagination' , 'Right'); 
}); 

// Left and right carousel overflow
$(".carousel .left").click(function() {
	pageTracker._trackEvent('Carousel', 'Overflow' , 'Left'); 
}); 
$(".carousel .right").click(function() {
	pageTracker._trackEvent('Carousel', 'Overflow' , 'Right'); 
}); 


//Delay the outbound click by a fraction of a second so that the event has time to register
function trackOutboundLink(link, category, action, label) { 
	try { 
		pageTracker._trackEvent(category, action , label); 
	} catch(err){}
 
	setTimeout(function() {
		document.location.href = link.href;
	}, 100);
}

