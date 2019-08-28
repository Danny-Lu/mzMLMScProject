$(document).ready(function () {
    $('.submit').click(function () {
        FileUpload();

    });

});

function FileUpload() {
    var form_data = new FormData();

    var file_info = $('#file_upload')[0].files[0];
    var chk_value = jqchk();
    if(file_info && (chk_value.length != 0) && ($('#file_upload').val().split('.')[1] === "mzML")){
        form_data.append('motifs_name', chk_value);
        form_data.append('file', file_info);
        var label1 = ".a-upload"
        var label2 = ".select"
        alert(chk_value);
        alert("file upload");
        // addProgress();
        changeColorWhite(label1);
        changeColorWhite(label2)
        shortLink(form_data);


    }
    else{
        var label1 = ".a-upload";
        var label2 = ".select";
        changeColorRed(label1);
        changeColorRed(label2);
    }
    if(!file_info){
        alert("mzMLFile not Found!!!");
        var label = ".a-upload";
        changeColorRed(label);

    }else{
        var label = ".a-upload";
        changeColorWhite(label)
    }


    if(chk_value.length == 0){
        alert("Motits not Found!!!");
        var label = ".select";
        changeColorRed(label);
    }else{
        var label = ".select";
        changeColorWhite(label);
    }
    if ($('#file_upload').val().split('.')[1] !== 'mzML'){
        alert("mzMLFile only!!!")
    }





}
//请求并发送文件和查询的数据库
function shortLink(form_data){
     $.ajax({
        url:"/search/data_analyse/" ,
        type: 'POST',
        dataType: 'json',
        data: form_data,
        processData: false,
        contentType: false,
        success: function (data) {
             showPage(data) ;
             saveAs();
             scatter();
             langLink();

        },
        error: function (err) {
            alert("ajax错误代码："+err.status);
        }
    });
     // langLink();
}
//ajax轮询
function langLink(){
    $.ajax({
        url:"/search/data_analyse/" ,
        type: "POST",
        dataType: 'json',
        data: "1",
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            showData(data) ;
            langLink();
        },
    });
}
//jquery获取复选框值
function jqchk() {
 var chk_value = [];
 $('.select input[name="checkbox"]:checked').each(function () {
            chk_value.push($(this).val());
 });
 return chk_value;
}
//动态增加显示textarea
function showPage(data) {
            $(".return").css({
                width: "1600px",
                height: "740px",
                backgroundColor: "#353b43",
                marginTop: "60px"
            });
            $(".return").append("<textarea class='show'></textarea>")

            $(".show").css({
                margin: "20px 68px auto",
                width: "1000px",
                height: "450px",
                backgroundColor: "transparent",
                border: "1px solid #ddd",
                color: "#ddd",
                fontSize: "20px",
                borderRadius: "4px",
                position: "absolute",
                top: "866px",
                left: "215px"

            });
            showData(data)
            var scroll_offset = $(".show").offset();
            $("body, html").animate({
                scrollTop: scroll_offset.top,
            }, 0);


}

//动态加载数据至前端
function showData(data) {
    $(".show").append(data["info"]+"<br>");
}


//提醒
function changeColorRed(html){
    $(html).css({
        border: "1px solid #DD3231"
    });
}

function changeColorWhite(html) {
    $(html).css({
        border: "1px solid #ddd"
    });
}
//动态加载save标签
function  saveAs() {
    $(".return").append("<div class='save'>save</div>");
    $(".save").css({
        width: "230px",
        height: "60px",
        lineHeight: "60px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "30px",
        textAlign: "center",
        color: "#ddd",
        position: "relative",
        top: "575px",
        left: "696px",
        // backgroundColor: "transparent",

    });
    $(".save").hover(function () {
        $(".save").css({
            color: "#444",
            backgroundColor: "#eee",
            borderColor: "#ccc",
            textDecoration: "none",
            cursor: "pointer"
        });
    },function () {
        $(".save").css({
            color: "#eee",
            backgroundColor: "transparent",
            borderColor: "#ddd",
            textDecoration: "none"
        });
    });

    var eleTextarea = document.querySelector('.show');
    var eleButton = document.querySelector('.save');
if ('download' in document.createElement('a')) {

    // 下载内容
    eleButton.addEventListener('click', function () {
        var content = eleTextarea.value.replace(/<br>/g, "\n");

        funDownload( content,'data.txt');
    });
} else {
    eleButton.onclick = function () {
        alert('浏览器不支持');
    };
}
}

// 下载textarea 内容
var funDownload = function (content, filename) {

    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
}
function  scatter() {
    $(".return").append("<div class='scatter'>ms scatter</div>");
    $(".scatter").css({
        width: "230px",
        height: "60px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "30px",
        textAlign: "center",
        color: "#ddd",
        position: "relative",
        top: "613px",
        left: "696px",
        lineHeight: "60px"
        // backgroundColor: "transparent",

    });
    $(".scatter").hover(function () {
        $(".scatter").css({
            color: "#444",
            backgroundColor: "#eee",
            borderColor: "#ccc",
            textDecoration: "none",
            cursor: "pointer"
        });
    },function () {
        $(".scatter").css({
            color: "#eee",
            backgroundColor: "transparent",
            borderColor: "#ddd",
            textDecoration: "none"
        });
    });
    $(".scatter").click(function () {
        $.ajax({
        url:"/search/data_analyse/" ,
        type: 'GET',
        dataType: 'json',
        data: {"data":1},
        processData: false,
        contentType: false,
        success: function (data) {
            // var script = data['script']
            // var div = data['div']
            window.open("/search/ms_scatter/","_blank");
            // $("body").append(div)
            // $("body")
        },
        error: function (err) {
            alert("ajax错误代码："+err.status);
        }
        })
    })
}

