(function($) {

    /******************** 네비게이션 제어 ********************/

    function setNav() {

        $(window).on('scroll', function() {
            $('[data-header]').css("margin-left", -$(this).scrollLeft());
        });

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
        tabMenu.find('li').attr("aria-selected", false).eq(0).attr("aria-selected", true).addClass('on');
        tabMenu.find('a').attr("tabindex", "-1").eq(0).attr("tabindex", "0")
        tabPanel.attr("tabindex", "-1").eq(0).attr("tabindex", "0").show();
        tabMenu.on('click', 'a', function(e) {
            e.preventDefault();
            showPanel($(this));
        }).on('keydown', 'a', function(e) {
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
        tabPanel.on('keydown', function(e) {
            if (e.shiftKey && e.keyCode === 9) {
                e.preventDefault();
                focusCache.focus();
            };
        });

    };

    /******************** 스크롤 애니메이션 제어 ********************/

    function setScrollAnimate() {

        var moveEl = $('[data-animation]'), // 무빙 요소
            scroll, // 스크롤 값
            topBtn = $('.move_top'), // TOP 버튼
            topBtnFlag = 0; // TOP 버튼 상태

        moveEl.addClass('wait-animation');

        $(window).on('load scroll', function() {
            scroll = $(this).scrollTop();

            // TOP 버튼 제어
            (scroll === 0) ? topBtn.removeClass('on'): topBtn.addClass('on');

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

    /******************** 모달 제어 ********************/

    function setModal() {

        var focusCache,
            targetModal,
            isModal,
            modalPosX,
            modalPosY,
            scroll;

        // 팝업 열기
        $(document).on('click', '[data-open-modal]', function(e) {

            scroll = $(window).scrollTop() || 0;
            isModal = true;
            focusCache = $(this);
            targetModal = $($(this).attr('href'));

            e.preventDefault();
            $('[data-modal]').removeClass('on');
            targetModal.addClass('on').find('.modal');

            modalPosX = -Math.floor($(targetModal).find('.modal').outerWidth() / 2);
            modalPosY = -Math.floor($(targetModal).find('.modal').outerHeight() / 2);

            switch (targetModal.data('type')) {
                case 'fix':
                    targetModal.find('.modal').css('transform', 'translate(' + modalPosX + 'px,' + modalPosY + 'px)');
                    $('body').addClass('fixed').css('margin-top', '-' + scroll + 'px').on('touchmove', function(e) {
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
        }).on('click', '[data-modal] .close', function() {
            isModal = false;
            $('[data-modal]').css('height', '100%').removeClass('on');
            focusCache.focus();
            $('body').css('margin-top', 0).removeClass('fixed').off('touchmove', function(e) {
                e.preventDefault();
            });
            $(window).scrollTop(scroll);

            // 탭 포커스 제어	
        }).on('keydown', '[data-modal] .close', function(e) {
            if (e.shiftKey && e.keyCode === 9) {
                return;
            } else if (e.keyCode === 9) {
                $('[data-modal] .modal').attr("tabindex", 0).focus();
                return false;
            };

            // 역탭 포커스 제어
        }).on('keydown', '[data-modal]', function(e) {
            if (e.shiftKey && e.keyCode === 9 && $(':focus').attr('data-modal') !== undefined) {
                e.preventDefault();
                $('[data-modal]').find('.close').focus();
            };

            // Escape키 제어
        }).on('keydown', function(e) {
            if (isModal && e.keyCode === 27) {
                isModal = false;
                $('[data-modal] .close').trigger('click');
            };
        });

    };

    $(function() {
        setNav();
        setTabMenu();
        setScrollAnimate();
        setModal();
    });

})(jQuery);