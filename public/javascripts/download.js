/**
 * Created by flyman on 16-8-29.
 */
$(function () {
    $(".download").on("click", function (event) {
        var brothers = $(event.target).parents("td").parent().children();
        var name = $(brothers[0]).text();
        var type = $(brothers[1]).text().toLowerCase();
        var size = $(brothers[3]).text();
        var isOk = confirm("Download " + name + "(" + size + ")");
        if (isOk) {
            var time = parseInt($(brothers[4]).text()) + 1;
            $(brothers[4]).text(time);
            return true;
        }
        return false;
    });

    $("#back").on("click", function () {
        window.history.back();
    })
});