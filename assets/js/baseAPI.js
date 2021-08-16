$.ajaxPrefilter(function (options) {
  options.url = "http://www.liulongbin.top:3008" + options.url;
  //统一为有权限的接口 设置headers 请求头
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }
  options.complete = function (res) {
    if (
      res.responseJSON.code == 1 &&
      res.responseJSON.message === "身份认证失败!"
    ) {
      localStorage.removeItem("token");
      location.href = "/login.html";
    }
  };
});
