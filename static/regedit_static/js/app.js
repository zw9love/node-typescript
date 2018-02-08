/**
 * Created by zengwei on 2017/12/28
 */

/**
 * @description 原生ajax
 * @param url
 * @param data
 * @param fnSucc
 * @param fnFaild
 */
function getAjax(url, data, fnSucc, fnFaild) {
    //1，创建Ajax对象
    //这个是非IE6的
    var oAjax;
    if (window.XMLHttpRequest) {
        oAjax = new XMLHttpRequest();
    }
    else {
        oAjax = new ActiveXObject("Microsoft.XMLHTTP");
    }

    //2,连接服务器
    oAjax.open('post', url, true);

    // *设置请求头
    oAjax.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    oAjax.setRequestHeader("token", "debug");

    //3,发送数据
    // var data = 'name=yang';
    oAjax.send(data)

    //4.接收返回
    oAjax.onreadystatechange = function () {
        if (oAjax.readyState === 4) {
            if (oAjax.status === 200) {
                var json = eval('(' + oAjax.responseText + ')');
                fnSucc(json);
            }
            else {
                if (fnFaild) {
                    fnFaild(oAjax.status);
                }
            }
        }else {
            if (fnFaild) {
                fnFaild(oAjax.status);
            }
        }
    }
}

/**
 * @description jquery的ajax
 * @param url
 * @param data
 * @param fnSucc
 * @param fnFaild
 */
function getAjaxJquery(url, data, fnSucc, fnFaild) {
    // ie6 jquery的ajax抽风，麻蛋，不能带请求头
    $.ajax({
        type: "POST",
        // url: "/regedit/getFileList",
        url: url,
        contentType: 'application/json; charset=UTF-8',
        data: data,
        // headers: {
        //     "token": "debug",
        // },
        success: function (res) {
            if(fnSucc){
                fnSucc(res)
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // 通常 textStatus 和 errorThrown 之中
            // 只有一个会包含信息
            //this; // 调用本次AJAX请求时传递的options参数
            if(fnFaild){
                fnFaild()
            }
            alert('网络错误');

        },
        // complete: function(){
        //     alert('反正就是完成了');
        // },
        dataType: 'json'
    })
}

/**
 * @description 当文档加载完毕
 */
$(document).ready(function () {
    var name = ''
    // 未来按钮点击事件
    $('.tbd').on('click', 'a', function () {
        $('.checkCode').val('')
        name = $(this).attr('data-name')
        $('.cell-name').val(name)
        $('.modal').css({'display': 'block'})
        $('.shadow').css({'display': 'block'})
        $('.modal').animate({
            opacity: 1
        }, 'fast');
        // $('.shadow').animate({
        //     opacity: 1
        // }, 'fast');
    })

    $('.tbd').on('mouseenter', 'tr', function (e, o) {
        if($(this).index() % 2 !== 0){
            $(this).toggleClass('odd')
        }
    })

    $('.tbd').on('mouseleave', 'tr', function () {
        if($(this).index() % 2 !== 0){
            $(this).toggleClass('odd')
        }
    })

    $('.sure').click(function () {
        // 检查检验码
        var checkCode = $('.checkCode').val()
        getAjaxJquery('/regedit/checkCode/' + checkCode, null, function (res) {
            switch (res) {
                // 成功
                case 710:
                    // 下载
                    $('.shadow').css({'display': 'none'})
                    $('.modal').animate({
                        opacity: 0
                    }, 0, function () {
                        $('.modal').css({'display': 'none'});
                        var link = document.createElement('a');
                        link.href = '/regedit/download/' + name;
                        document.body.appendChild(link);
                        link.click()
                        document.body.removeChild(link);
                        // 新开页面下载
                        // window.open('/regedit/download/' + name);
                    });
                    break
                // 失败
                case 711:
                    alert('您的校验码有误，请重新输入。')
                    break
            }

            // js对象
            // $('.modal').css({'display': 'none'});
            // var link = document.createElement('a');
            // link.href = '/regedit/download/' + name;
            // document.body.appendChild(link);
            // link.click()
            // document.body.removeChild(link);

            // jquery对象
            // $('.modal').css({'display': 'none'});
            // $('html').append('<a href="/regedit/download/ ' + name +'" class="link" id="link"></a>');
            // // $('.link').get(0).click(); //ie6下无法触发点击
            // $('.link').remove();
        })


    })

    $('.cancel').click(function () {
        $('.modal').animate({
            opacity: 0
        }, 'fast', function () {
            $(this).css({'display': 'none'});
        });
        $('.shadow').css({'display': 'none'})
        // $('.shadow').animate({
        //     opacity: 0
        // }, 'fast', function () {
        //     $(this).css({'display': 'none'});
        // });
    })

    var postData = '';
    var url = 'regedit/getFileList';
    // var url = '/host/get';
    // 原生ajax
    // getAjax(url, postData, function (res) {
    //     var list = res.data
    //     $('.total').text(list.length)
    //     for (var i = 0; i < list.length; i++) {
    //         // $('<tr><td style="border-bottom:1px solid #fff">'+ list[i]["login_name"] + '</td><td style="border-bottom:1px solid #fff"><a class="btn" href="/regedit/download/' + list[i]["login_name"] + '">下载</a></td></tr>').appendTo(".tbd");
    //         $('<tr><td style="border-bottom:1px solid #fff">' + list[i]["login_name"] + '</td><td style="border-bottom:1px solid #fff"><a class="btn" data-name="' + list[i]["login_name"] + '">下载</a></td></tr>').appendTo(".tbd");
    //     }
    // }, function () {
    //     alert('网络错误');
    // })

    // jQuery的ajax
    getAjaxJquery(url, postData, function(res){
        // var list = res.data || res
        var list = res
        if(list.length > 0){
            $('.main-placeholder').css({'display': 'none'})
            $('.main').css({'display': 'block'})
            $('.total').text(list.length)
            for (var i = 0; i < list.length; i++) {
                if(i % 2 === 0){
                    $('<tr><td style="border-bottom:1px solid #fff">' + list[i] + '</td><td style="border-bottom:1px solid #fff"><a class="btn" data-name="' + list[i] + '">下载</a></td></tr>').appendTo(".tbd");
                }else{
                    $('<tr class="odd"><td style="border-bottom:1px solid #fff">' + list[i] + '</td><td style="border-bottom:1px solid #fff"><a class="btn" data-name="' + list[i] + '">下载</a></td></tr>').appendTo(".tbd");
                }
                // $('<tr><td style="border-bottom:1px solid #fff">'+ list[i]["login_name"] + '</td><td style="border-bottom:1px solid #fff"><a class="btn" href="/regedit/download/' + list[i]["login_name"] + '">下载</a></td></tr>').appendTo(".tbd");

            }
        }else{
            $('.main').css({'display': 'none'})
            $('.main-placeholder').css({'display': 'block'})
        }
    })

    // 初始化一下dom
    var modal = $('.modal');
    var shadow = $('.shadow');
    var top = ($(window).height() - modal.height()) / 2;
    var left = ($(window).width() - modal.width()) / 2;
    modal.css({top: top, left: left});
    shadow.css({width: $(window).width(), height: $(window).height()})
    // alert(navigator.appVersion)
    if(navigator.appVersion.toLowerCase().indexOf('msie 6.0') !== -1){
        // alert('我是ie6')
        $(window).scroll(function () {
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            // console.log(parseInt(scrollTop) + top)
            modal.css({top: parseInt(scrollTop) + top});
            shadow.css({top: scrollTop});
            // $('.modal').css({top: parseInt(scrollTop) + n});
        })
    }

})
