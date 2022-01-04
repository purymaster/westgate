(function($) {

    function setNav() {

        var isMobile = false,
            isNativeMobile = false,
            mobileValidator = ['iPhone', 'iPod', 'iPad', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson'],
            scroll;

        for (var word in mobileValidator) {
            if (navigator.userAgent.match(mobileValidator[word]) !== null) isNativeMobile = true;
        }

        function openMenu() {
            scroll = $(window).scrollTop();
            $('header .menu_wrap').addClass('on');
            $('html').addClass('fixed');
            $('body').css('margin-top', -scroll);
        };

        function closeMenu(flag) {
            $('header .menu_wrap').removeClass('on');
            $('nav .main-menu > li').removeClass('on').find('.sub-menu').hide();
            $('html').removeClass('fixed');
            if (flag) $('header nav .sub-menu').show();
            $('body').css('margin-top', 0);
            $(window).scrollTop(scroll);
        };

        $(window).on('load resize', function() {
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

        $('header').on('click', '.open_menu', function() {
            openMenu();
        }).on('click', '.close_menu', function() {
            closeMenu();
        });

        $('nav .main-menu > li > a').on('click', (function() {
            if (!isMobile) return;
            if ($(this).parent().hasClass('on')) {
                $('nav .main-menu li').removeClass('on').find('.sub-menu').stop().slideUp(100)
            } else {
                $('nav .main-menu li').removeClass('on').find('.sub-menu').stop().slideUp(100);
                $(this).parent().addClass('on').find('.sub-menu').stop().slideDown(100)
            }
        }));

    };

    function setScrollAnimate() {
        var scroll,
            topBtn = $('.move_top'),
            topBtnFlag = 0;
        $(window).on('load scroll', function() {
            scroll = $(this).scrollTop();
            if (scroll === 0) {
                topBtn.removeClass('on')
            } else {
                topBtn.addClass('on');
            };
            topBtn.find('button').on('click', function() {
                if (topBtnFlag) return false;
                topBtnFlag = 1;
                $('html, body').animate({
                    scrollTop: 0
                }, function() {
                    topBtnFlag = 0;
                    topBtn.removeClass('on');
                });
                return false;
            });
        });
    };

    $(function() {
        setNav();
        setScrollAnimate();
    });

})(jQuery);