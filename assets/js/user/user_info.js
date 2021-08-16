$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称长度必须在 1 ~ 6 个字符之间！";
      }
    },
  });
  initUserInfo();
  //初始化基本用户
  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        // console.log(res);
        if (res.code !== 0) {
          return layer.msg("获取用户信息失败！");
        }
        // console.log(res);
        form.val("formUserInfo", res.data);
      },
    });
  }
  $("#btnReset").on("click", function (e) {
    e.preventDefault();
    initUserInfo();
  });
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "PUT",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.code !== 0) {
          return layer.msg("更新密码失败！");
        }
        layer.msg("更新成功");
        window.parent.getUserInfo();
      },
    });
  });
});
