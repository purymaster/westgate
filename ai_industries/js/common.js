$(function () {

    /******************** 리사이징 초기화 ********************/

    $(window).on('load resize', function () {
        close_menu();
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

    var move_el = $('[data-animation]'), //무빙 요소
        move_name, //무빙 정의
        move_delay, //순차무빙 딜레이
        move_duration, //순차무빙 시간
        scroll, //스크롤 값
        start_point = $(window).height() * 0.95, //애니메이션 시작 높이(밑에서부터 화면 높이의 5%)
        top_btn = $('.move_top'), //TOP 버튼
        top_btn_flag = 0; //TOP 버튼 상태

    move_el.addClass('wait-animation');
    $(window).on('load scroll', function () {
        scroll = $(this).scrollTop();

        //순차 애니메이션 제어
        move_el.each(function () {
            move_name = $(this).data('animation');
            move_delay = $(this).data('delay') * 100; //단위 0.1초
            move_duration = $(this).data('duration') * 1000; //단위 1초
            $(this).addClass('animated ' + move_name);
            if (move_delay >= 0)
                $(this).css({
                    '-webkit-animation-delay': move_delay + 'ms',
                    'animation-delay': move_delay + 'ms'
                });
            if (move_duration >= 0)
                $(this).css({
                    '-webkit-animation-duration': move_duration + 'ms',
                    'animation-duration': move_duration + 'ms'
                });
            if (scroll > $(this).offset().top - start_point)
                $(this).removeClass('wait-animation');
        });

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

});