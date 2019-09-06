$(document).ready(function () {
    $('.submit').click(function () {
        FileUpload();
    });
});
//File Upload
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
//Request and send a file to the query database
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
            alert("ajax error code："+err.status);
        }
    });
}
//AJAX polling
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
//jQuery gets the checkbox value
function jqchk() {
 var chk_value = [];
 $('.select input[name="checkbox"]:checked').each(function () {
            chk_value.push($(this).val());
 });
 return chk_value;
}
//Dynamic display(increase) of textarea
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
//Dynamically load data to the front end.
function showData(data) {
    $(".show").append(data["info"]+"<br>");
}
//Notification
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
//Dynamically loading save tags
function  saveAs() {
    $(".return").append("<div class='save'>Save as TXT</div>");
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

//Download content
    eleButton.addEventListener('click', function () {
        var content = eleTextarea.value.replace(/<br>/g, "\n");
        funDownload( content,'data.txt');
    });
} else {
    eleButton.onclick = function () {
        alert('Browser does not support');
    };
}
}
//Download textarea content
var funDownload = function (content, filename) {

    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    //Convert character content to blob address
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    //Trigger click
    document.body.appendChild(eleLink);
    eleLink.click();
    //Then remove
    document.body.removeChild(eleLink);
}
//Dynamically loading scatter tags
function  scatter() {
    $(".return").append("<div class='scatter'>MS Scatter</div>");
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
            window.open("/search/ms_scatter/","_blank");
        },
        error: function (err) {
            alert("ajax error code："+err.status);
        }
        })
    })
}

