(function($){
	scrollElementFn = {
		directions: ['right', 'left', 'top', 'bottom'],
		/*
		 * 	Check if there is vertical and/or horizontal scrolling
		 *  and show shadows accordingly
		 *  @param $(.scrollElement)
		 */
		setOnLoadShadowVis: function(scrollElementInner) {
			var c = scrollElementFn.getConfig(scrollElementInner);
			var shadows = scrollElementFn.getShadows(c.wrapper);

			// Vertical
			if (c.scrollHeight > c.clientHeight) {
				shadows.bottom.show();
			}

			// Horizontal
			if (c.scrollWidth > c.clientWidth) {
				shadows.right.show();
			}
		},
		/*
		 * 	Set the height/width and position of the shadows
		 *	Checks if there are scroll bars present and adjusts
		 *	the position of the shadows accordingly
		 *  @param $(.scrollElement .inner), top|right|bottom|left
		 */
		setShadowSizePosition: function(scrollElementInner, direction) {
			var c = scrollElementFn.getConfig(scrollElementInner);
			var shadows = scrollElementFn.getShadows(c.wrapper);
			var shadowPosition, shadowHeight, shadowWidth;

			switch (direction) {
				case 'right':
					shadowPosition = c.verScrollbar - c.borderWidth;
					shadowHeight = c.leftRightHeight;
					break;
				case 'left':
					shadowPosition = 0;
					shadowHeight = c.leftRightHeight;
					break;
				case 'top':
					shadowPosition = 0;
					shadowWidth = c.topBottomWidth;
					break;
				case 'bottom':
					shadowPosition = c.horScrollbar - c.borderHeight;
					shadowWidth = c.topBottomWidth;
					break;
			}

			shadows[direction].css({
				width: shadowWidth ? shadowWidth : shadows[direction].width(),
				height: shadowHeight ? shadowHeight : shadows[direction].height()
			});
			shadows[direction].css(direction, shadowPosition);

		},
		/*
		 * 	Detects when to fade in/out shadows depending on the scrolling
		 *  @param $(.scrollElement .inner)
		 */
		setOnScrollShadowVis: function(scrollElementInner) {
			var c = scrollElementFn.getConfig(scrollElementInner);
			var shadows = scrollElementFn.getShadows(c.wrapper);

			// Bottom shadow
			if (c.scrollHeight == c.dynamicHeight) {
				shadows.bottom.fadeOut();
			}
			if (c.scrollHeight > c.dynamicHeight && shadows.bottom.is(':hidden')) {
				shadows.bottom.fadeIn();
			}

			// Top shadow
			if (c.scrollTop > 0 && shadows.top.is(':hidden')) {
				shadows.top.fadeIn();
			}
			if (c.scrollTop == 0 && shadows.top.is(':visible')) {
				shadows.top.fadeOut();
			}

			// Right shadow
			if (c.scrollWidth == c.dynamicWidth) {
				shadows.right.fadeOut();
			}
			if (c.scrollWidth > c.dynamicWidth && shadows.right.is(':hidden')) {
				shadows.right.fadeIn();
			}

			// Left shadow
			if (c.scrollLeft > 0 && shadows.left.is(':hidden')) {
				shadows.left.fadeIn();
			}
			if (c.scrollLeft == 0 && shadows.left.is(':visible')) {
				shadows.left.fadeOut();
			}
		},
		/*
		 * 	Get the shadow elements
		 *  @param $(.scrollElement)
		 */
		getShadows: function(scrollElementWrapper) {
			var el = $(scrollElementWrapper);
			return {
				right: el.find('.shadowRight'),
				left: el.find('.shadowLeft'),
				top: el.find('.shadowTop'),
				bottom: el.find('.shadowBottom')
			}
		},

		/*
		 * 	Get the different values/calculations of the scroll element that we need
		 *  @param $(.scrollElement .inner)
		 */
		getConfig: function(scrollElementInner) {
			var el = $(scrollElementInner);
			var elementDOM = el.get(0);
			var elementWrapper = el.parent('.scrollElement');

			return {
				el: el,
				dom: elementDOM,
				wrapper: elementWrapper,
				scrollWidth: elementDOM.scrollWidth,
				dynamicWidth: el.scrollLeft() + elementDOM.clientWidth,
				scrollHeight: elementDOM.scrollHeight,
				dynamicHeight: el.scrollTop() + elementDOM.clientHeight,
				clientHeight: elementDOM.clientHeight,
				clientWidth: elementDOM.clientWidth,
				scrollLeft: el.scrollLeft(),
				scrollTop: el.scrollTop(),
				borderHeight: el.outerHeight() - el.innerHeight(),
				borderWidth: el.outerWidth() - el.innerWidth(),
				topBottomWidth: elementDOM.clientWidth + (el.outerWidth() - el.innerWidth()),
				leftRightHeight: elementDOM.clientHeight + (el.outerHeight() - el.innerHeight()),
				verScrollbar: elementWrapper.width() - elementDOM.clientWidth,
				horScrollbar: elementWrapper.height() - elementDOM.clientHeight
			}

		}


	};

	$.fn.scrollElement = function() {
		return this.each(function() {
			var innerContent = $(this).find('.inner');
			$.each(scrollElementFn.directions, function(i) {
				scrollElementFn.setShadowSizePosition(innerContent, scrollElementFn.directions[i]);
			});
			scrollElementFn.setOnLoadShadowVis(innerContent);
			innerContent.scroll(function() {
				scrollElementFn.setOnScrollShadowVis($(this));
			})
		})

	};
}(jQuery));