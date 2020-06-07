<template>
  <el-upload
    class="avatar-uploader"
    :action="config.action"
    :data="data.uploadKey"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    >
    <img v-if="data.images" :src="data.images" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>
<script>
import { reactive, onMounted, watch } from '@vue/composition-api';
import { QiniuToken } from "@/api/common";
export default {
  name: "uploadimg",
  props: {
    imageUrl: {
      type: String,
      default: ""
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup(props,{ root }) {
    console.log(props.config)
    // 数据
    const data = reactive({
      images: "",
      uploadKey: {
        token: "",
        key: ""
      }
    });

    // methods
    // 图片上传
    const handleAvatarSuccess = (res, file) => {
      // root.imageUrl = URL.createObjectURL(file.raw);
      let img = `${root.$store.getters["common/qiniuUrl"]}${res.key}`;
      form.imageUrl = img;
      emit("update:imgUrl", img);
    };
    const beforeAvatarUpload = file => {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        root.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        root.$message.error("上传头像图片大小不能超过 2MB!");
      }
      // 文件名转码
      let suffix = file.name;
      let key = encodeURI(`${suffix}`);
      data.uploadKey.key = key;
      return isJPG && isLt2M;
    };

    // 获取七牛云的token
    const getQiniuToken = () => {
      let requestData = {
        accesskey: props.config.accesskey,
        secretkey: props.config.secretkey,
        buckety: props.config.buckety
      };
      QiniuToken(requestData)
        .then(response => {
          // console.log(response.data.data)
          data.uploadKey.token = response.data.data.token;
        })
        .catch(error => {});
    };

    // 监听
    watch(() => props.imageUrl, (value) => {
      // console.log(value);
      data.images = value;
    });

    onMounted(() => {
      getQiniuToken();
    });

    return {
      //数据
      data,
      //methods
      handleAvatarSuccess,beforeAvatarUpload,getQiniuToken
    }
  }
}
</script>
<style lang="scss" scoped>

</style>