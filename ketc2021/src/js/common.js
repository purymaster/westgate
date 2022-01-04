(function ($) {

	/******************** 네비게이션 제어 ********************/

	function setNav() {

		var isMobile = false, //웹 페이지 미디어쿼리 판별 변수
			isNativeMobile = false, //모바일 판별 변수
			mobileValidator = ['iPhone', 'iPod', 'iPad', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson'], //모바일 판별 useragent 배열
			scroll; // 스크롤 값

		for (var word in mobileValidator) {
			if (navigator.userAgent.match(mobileValidator[word]) !== null) isNativeMobile = true;
		}

		/* 모바일 메뉴 열기 */
		function openMenu() {
			scroll = $(window).scrollTop();
			$('header .menu_wrap').addClass('on');
			$('html,body').addClass('fixed');
			$('body').css('margin-top', -scroll);
		};

		/* 모바일 메뉴 닫기 */
		function closeMenu(flag) {
			$('header .menu_wrap').removeClass('on');
			$('nav .main-menu > li').removeClass('on').find('.sub-menu').hide();
			$('html,body').removeClass('fixed');
			if (flag) $('header nav .sub-menu').show();
			$('body').css('margin-top', 0);
			$(window).scrollTop(scroll);
		};

		/* 모바일 판별 및 네비게이션 초기화 */
		$(window).on('load resize', function () {
			if (isNativeMobile) {
				isMobile = true;
				return false;
			};
			if (window.outerWidth > 1024) {
				isMobile = false;
				closeMenu('flag');
			} else {
				isMobile = true;
				closeMenu();
			}
		});

		/* 모바일 메뉴 제어 */
		$('header').on('click', '.open_menu', function () {
			openMenu();
		}).on('click', '.close_menu', function () {
			closeMenu();
		});

		/* 모바일 2뎁스 메뉴 펼치기 */
		$('nav .main-menu > li > a').on('click', (function () {
			if (!isMobile) return;
			if ($(this).parent().hasClass('on')) {
				$('nav .main-menu li').removeClass('on').find('.sub-menu').stop().slideUp(100)
			} else {
				$('nav .main-menu li').removeClass('on').find('.sub-menu').stop().slideUp(100);
				$(this).parent().addClass('on').find('.sub-menu').stop().slideDown(100)
			}
		}));

	};

	/******************** 탭메뉴 제어 ********************/

	function setTabMenu() {

		var tabMenu = $('[data-tab-menu]'),
			tabPanel = $('[data-tab-panel] .tabpanel'),
			focusCache,
			target;

		function showPanel(obj) {
			focusCache = obj;
			target = obj.attr('href');
			if (target.indexOf("#")) {
				location.href = target;
			} else {
				tabMenu.find('li').attr("aria-selected", false).removeClass('on');
				tabPanel.hide().attr("tabindex", "-1");
				obj.parent().attr("aria-selected", true).addClass('on');
				$('[data-tab-panel]').find(target).show().attr("tabindex", "0");
			};
		};

		focusCache = tabMenu.find('a').eq(0);
		// tabMenu.find('li').attr("aria-selected", false).eq(0).attr("aria-selected", true).addClass('on');
		tabMenu.find('a').attr("tabindex", "-1").eq(0).attr("tabindex", "0")
		tabPanel.attr("tabindex", "-1").eq(0).attr("tabindex", "0").show();
		tabMenu.on('click', 'a', function (e) {
			e.preventDefault();

			/* Youtube 제어 */
			$('[data-movie]').each(function () {
				$(this).find('iframe').attr('src', '').attr('src', $(this).find('iframe').data('src'));
			});

			tabMenu.find('a').attr("tabindex", "-1");
			$(this).attr("tabindex", "0");
			showPanel($(this));
		}).on('keydown', 'a', function (e) {
			switch (e.keyCode) {
				case 32:
					e.preventDefault();
					showPanel($(this));
					break;
				case 37:
					$(this).attr("tabindex", "-1");
					if ($(this).parent().index() === 0) {
						tabMenu.find('li:last-child').find('a').attr("tabindex", "0").focus();
					} else {
						$(this).parent().prev().find('a').attr("tabindex", "0").focus();
					};
					break;
				case 39:
					$(this).attr("tabindex", "-1");
					if ($(this).parent().index() === tabMenu.find('li').length - 1) {
						tabMenu.find('li:first-child').find('a').attr("tabindex", "0").focus();
					} else {
						$(this).parent().next().find('a').attr("tabindex", "0").focus();
					};
					break;
			};
		});
		tabPanel.on('keydown', function (e) {
			if (e.shiftKey && e.keyCode === 9) {
				e.preventDefault();
				focusCache.focus();
			};
		});

	};

	/******************** 파일 업로드 제어 ********************/

	function setFileUpload() {

		var fileUploader = $('[data-file-upload]'),
			limitSize = 5 * 1048576; //5mb

		// 파일 사이즈 체크
		function checkSize(obj) {
			if (obj[0].files[0].size > limitSize) {
				checkError("size", obj);
				return;
			};
			showFileDir(obj);
		};

		// 파일 경로 표시
		function showFileDir(obj) {
			var fileName;

			if (window.FileReader) {
				fileName = obj[0].files[0].name;
			} else {
				fileName = obj.val().split('/').pop().split('\\').pop();
			};
			obj.siblings('.dummy').val(fileName);
		};

		// 에러 체크, 초기화
		function checkError(error, obj) {
			switch (error) {
				case "size":
					// alert("첨부파일은 " + Math.floor(limitSize / 1048576) + "MB까지 업로드 가능합니다.");
					alert("The copy should be readable and not exceed 5MB in size.");
					break;
			};
			obj.val("");
			obj.siblings('.dummy').val("");
			return false;
		};

		// 파일 업로드
		fileUploader.on('change', 'input[type="file"]', function () {
			if ($(this).val() === "") return false;
			checkSize($(this));

			// 파일 삭제 버튼
		}).on('click', '.del', function () {
			checkError(null, $(this).siblings($('input[type="file"]')));
		});
	};

	/******************** 스크롤 애니메이션 제어 ********************/

	function setScrollAnimate() {

		var moveEl = $('[data-animation]'), // 무빙 요소
			moveName, // 무빙 정의
			moveDelay, // 순차무빙 딜레이
			moveDuration, // 순차무빙 시간
			scroll, // 스크롤 값
			startPoint = $(window).height() * 0.95, // 애니메이션 시작 높이(밑에서부터 화면 높이의 5%)
			topBtn = $('.move_top'), // TOP 버튼
			topBtnFlag = 0, // TOP 버튼 상태
			header = $('[data-header] header'),
			isMain = false;

		moveEl.addClass('wait-animation');

		$(window).on('load scroll', function () {
			scroll = $(this).scrollTop();
			isMain = $('.content').hasClass('main_page');
			if (!isMain) header.addClass('on');

			// 순차 애니메이션 제어
			moveEl.each(function () {
				moveName = $(this).data('animation');
				moveDelay = $(this).data('delay') * 100; // 단위 0.1초
				moveDuration = $(this).data('duration') * 1000; // 단위 1초
				$(this).addClass('animated ' + moveName);
				if (moveDelay >= 0)
					$(this).css({
						'-webkit-animation-delay': moveDelay + 'ms',
						'animation-delay': moveDelay + 'ms'
					});
				if (moveDuration >= 0)
					$(this).css({
						'-webkit-animation-duration': moveDuration + 'ms',
						'animation-duration': moveDuration + 'ms'
					});
				if (scroll > $(this).offset().top - startPoint) $(this).removeClass('wait-animation');
			});

			// TOP 버튼 제어
			if (scroll === 0) {
				topBtn.removeClass('on');
				if (isMain) header.removeClass('on');
			} else {
				topBtn.addClass('on');
				header.addClass('on');
			}

			topBtn.find('button').on('click', function () {
				if (topBtnFlag) return false;
				topBtnFlag = 1;
				$('html, body').animate({
					scrollTop: 0
				}, function () {
					topBtnFlag = 0;
					topBtn.removeClass('on');
				});
				return false;
			});

		});

	};

	/******************** 모달 제어 ********************/

	function setModal() {

		var focusCache,
			targetModal,
			isModal,
			modalPosX,
			modalPosY,
			scroll;

		// 팝업 열기
		$(document).on('click', '[data-open-modal]', function (e) {
			e.preventDefault();
			scroll = $(window).scrollTop() || 0;
			isModal = true;
			focusCache = $(this);
			targetModal = $($(this).data('target'));
			$('[data-modal]').removeClass('on');
			targetModal.addClass('on').find('.modal');
			modalPosX = -Math.floor($(targetModal).find('.modal').outerWidth() / 2);
			modalPosY = -Math.floor($(targetModal).find('.modal').outerHeight() / 2);

			switch (targetModal.data('type')) {
				case 'fix':
					targetModal.find('.modal').css('transform', 'translate(' + modalPosX + 'px,' + modalPosY + 'px)');
					$('body').addClass('fixed').css('margin-top', '-' + scroll + 'px').on('touchmove', function (e) {
						e.preventDefault();
					});
					break;
				case 'scroll':
					targetModal.css('height', $(document).outerHeight());
					targetModal.find('.modal').css({
						'top': scroll,
						'transform': 'translateX(' + modalPosX + 'px)'
					});
					break;
			};

			targetModal.attr("tabindex", 0).focus();

			// 팝업 닫기
		}).on('click', '[data-modal] .close', function () {
			isModal = false;
			$('[data-modal]').css('height', '100%').removeClass('on');
			focusCache.focus();
			$('body').css('margin-top', 0).removeClass('fixed').off('touchmove', function (e) {
				e.preventDefault();
			});
			$(window).scrollTop(scroll);

			// 탭 포커스 제어	
		}).on('keydown', '[data-modal] .close', function (e) {
			if (e.shiftKey && e.keyCode === 9) {
				return;
			} else if (e.keyCode === 9) {
				$('[data-modal] .modal').attr("tabindex", 0).focus();
				return false;
			};

			// 역탭 포커스 제어
		}).on('keydown', '[data-modal]', function (e) {
			if (e.shiftKey && e.keyCode === 9 && $(':focus').attr('data-modal') !== undefined) {
				e.preventDefault();
				$('[data-modal]').find('.close').focus();
			};

			// Escape키 제어
		}).on('keydown', function (e) {
			if (isModal && e.keyCode === 27) {
				isModal = false;
				$('[data-modal] .close').trigger('click');
			};
		});

	};

	/******************** 리사이징 초기화 ********************/

	function resizeInit() {

		$(window).on('resize', function () {
			// $('[data-modal] .close').trigger('click'); // 팝업 닫기
		});

	};

	$(function () {
		setNav();
		setTabMenu();
		setScrollAnimate();
		setModal();
		setFileUpload();
		resizeInit();
	});

})(jQuery);