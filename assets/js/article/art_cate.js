$(function () {
  var layer = layui.layer;
  var form = layui.form;
  initArtCateList();
  function initArtCateList() {
    $.ajax({
      method: "get",
      url: "/my/cate/list",
      success: function (res) {
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }
  var indexAdd = null;
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });
  $("body").on("submit", "#form-adit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/cate/add",
      data: $(this).serialize(),
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg("新增分类失败！");
        }
        initArtCateList();
        layer.msg("新增分类成功");
        layer.close(indexAdd);
      },
    });
  });
  // 修改处理
  var indexAdd = null;
  $("body").on("click", ".btn-edit", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });
    var id = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/my/cate/info?id=" + id,
      success: function (res) {
        form.val("form-edit", res.data);
      },
    });
  });
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "put",
      url: "/my/cate/info",
      data: $(this).serialize(),
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg("更新分类数据失败！");
        }
        layer.msg("更新分类成功");
        layer.close(indexAdd);
        initArtCateList();
      },
    });
  });
  $("body").on("click", ".btn-delete", function () {
    var id = $(this).attr("data-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "DELETE",
        url: "/my/cate/del?id=" + id,
        success: function (res) {
          if (res.code !== 0) {
            return layer.msg("删除分类失败！");
          }
          layer.msg("删除分类成功！");
          layer.close(index);
          initArtCateList();
        },
      });
    });
  });
});
