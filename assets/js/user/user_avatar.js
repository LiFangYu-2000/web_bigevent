$(function () {
  var layer = layui.layer;
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $("#image");
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };
  $image.cropper(options);
  $("#btnChooseImage").on("click", function () {
    $("#file").click();
  });
  $("#file").on("change", function (e) {
    // 获取用户选择的文件
    var filelist = e.target.files;
    if (filelist.length === 0) {
      return layer.msg("请选择照片！");
    }
    // 1. 拿到用户选择的文件
    var file = e.target.files[0];
    // 2. 将文件，转化为路径
    var imgURL = URL.createObjectURL(file);
    $image.cropper("destroy").attr("src", imgURL).cropper(options); // 销毁旧的裁剪区域
  });
  $("#btnUpload").on("click", function () {
    var dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png");
    $.ajax({
      method: "PATCH",
      url: "/my/update/avatar",
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg("更换头像失败!");
        }
        layer.msg("更换头像成功!");
        window.parent.getUserInfo();
      },
      // success: function (res) {
      //   if (res.code !== 0) {
      //     return layer.msg("更换头像失败！");
      //   }
      //   layer.msg("更换头像成功！");
      //   window.parent.getUserInfo();
      // },
    });
  });
});
