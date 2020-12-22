$(function () {

    /******************** 리사이징 초기화 ********************/

    $(window).on('load resize', function () {
        close_menu();
    });

    /******************** 탭메뉴 제어 ********************/

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
    tabMenu.on('click', 'a', function (e) {
        e.preventDefault();
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

    /******************** 네비게이션 제어 ********************/

    /* 모바일 메뉴 열기 */
    $('header .open_menu').on('click', function () {
        $('nav').addClass('on');
    });

    /* 모바일 메뉴 닫기 */
    function close_menu() {
        $('nav').removeClass('on');
    }
    $('header .close_menu').on('click', function () {
        close_menu();
    });

    /******************** 메뉴 스크롤 제어 ********************/

    var header, target, position;

    $(window).on('load resize', function () {
        header = parseInt($('header').css('height'));
    })
    $('.move_link').on('click', function (e) {
        e.preventDefault();
        target = $(this).attr('href');
        position = $(target).offset().top - header;
        $('html,body').animate({
            "scrollTop": position
        }, 500, close_menu());
        return false;
    });


    /******************** 스크롤 애니메이션 정의 ********************/

    var scroll, //스크롤 값
        top_btn = $('.move_top'), //TOP 버튼
        top_btn_flag = 0; //TOP 버튼 상태

    $(window).on('load scroll', function () {
        scroll = $(this).scrollTop();

        //TOP 버튼 제어
        (scroll === 0) ? top_btn.removeClass('on') : top_btn.addClass('on');

        top_btn.find('button').on('click', function () {
            if (top_btn_flag) return false;
            top_btn_flag = 1;
            $('html, body').animate({
                scrollTop: 0
            }, function () {
                top_btn_flag = 0;
                top_btn.removeClass('on');
            });
            return false;
        });

    });

    /******************** 팝업 정의 ********************/

    var popupLength = $('[data-modal]').find('.popup').length,
        popupCnt = 0;

    function getCookie(name) {
        var cookies = document.cookie.split("; ");
        for (var i in cookies) {
            if (cookies[i].search(name) !== -1) {
                return cookies[i].split("=")[1];
            };
        };
        return false;
    };

    function setCookie(name, value, expiredays) {
        var setDay = new Date();
        setDay.setDate(setDay.getDate() + expiredays);
        document.cookie = escape(name) + "=" + escape(value) + "; expires=" + setDay.toUTCString();
    };

    function closePopup(popup, cookie) {
        var $this = popup;
        $this.hide();
        popupCnt++;
        if (cookie) setCookie(cookie, 'y', 1)
        if (popupCnt === popupLength) $('[data-modal]').removeClass('on');
    };

    // (function checkPopup() {
    //     if (getCookie('popup1')) closePopup($('#popup1'));
    //     if (getCookie('popup2')) closePopup($('#popup2'));
    //     if (!getCookie('popup1') || !getCookie('popup2')) $('[data-modal]').addClass('on');
    // })();

    (function checkPopup() {
        if (getCookie('popup1')) closePopup($('#popup1'));
        if (!getCookie('popup1')) $('[data-modal]').addClass('on');
    })();

    $('[data-modal]').on('click', '.close', function () {
        closePopup($(this).parents('.popup'));
    }).on('change', 'input', function () {
        closePopup($(this).parents('.popup'), $(this).parents('.popup').attr('id').toString());
    });

});