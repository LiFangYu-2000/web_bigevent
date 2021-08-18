$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  var q = {
    pagenum: 1, //页码值 默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: "", // 文章分类的 id
    state: "", // 文章的发布状态
  };
  initTable();
  initCate();
  function initTable() {
    $.ajax({
      method: "get",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg("获取分类列表失败");
        }
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        // 获取发表后文章列表的个数
        renderPage(res.total);
      },
    });
    // $.ajax({
    //   method: "GET",
    //   url: "/my/article/list",
    //   data: q,
    //   success: function (res) {
    //     if (res.code !== 0) {
    //       return layer.msg("获取文章列表失败");
    //     }
    //     var htmlStr = template("tpl-table", res);
    //     $("tbody").html(htmlStr);
    //     renderPage(res.total);
    //   },
    // });
  }
  template.defaults.imports.dataFormat = function (date) {
    var dt = new Date(date);
    var y = dt.getFullYear();
    var m = padZero(dt.getUTCMonth() + 1);
    var d = padZero(dt.getDay());
    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());
    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  //   初始化分类数据
  function initCate() {
    $.ajax({
      method: "get",
      url: "/my/cate/list",
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg("获取分类数据失败");
        }
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
    // $.ajax({
    //   method: "get",
    //   url: "/my/cate/list",
    //   success: function (res) {
    //     if (res.code !== 0) {
    //       return layer.msg("获取分类数据失败");
    //     }
    //     var htmlStr = template("tpl-cate", res);
    //     $("[name=cate_id]").html(htmlStr);
    //     form.render();
    //   },
    // });
  }

  //为筛选表单绑定submit事件
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  });
  //   定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: "pageBox",
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 4, 6, 8, 10],
      jump: function (obj, first) {
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      },
    });
  }
  // 通过代理方式 实现文章删除的 功能
  $("body").on("click", ".btn-delete", function () {
    var len = $(".btn-delete").length;
    var id = $(this).attr("data-id");
    layer.confirm("确定要删除么", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "DELETE",
        url: "/my/article/info?id=" + id,
        success: function (res) {
          if (res.code !== 0) {
            return layer.msg("删除失败");
          }
          layer.msg("删除成功");
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        },
      });
      layer.close(index);
    });
  });
});
