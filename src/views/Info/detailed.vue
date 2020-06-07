<template>
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="信息分类：">
      <el-select v-model="form.categoryId">
        <el-option
          v-for="item in data.category"
          :key="item.id"
          :value="item.id"
          :label="item.category_name"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="新闻标题：">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="缩虐图：">
      <UploadImg :imgUrl.sync="form.imgUrl" :config="uploadImgConfig" />
    </el-form-item>
    <el-form-item label="发布日期：">
      <el-date-picker v-model="form.createDate" type="date" placeholder="选择日期" disabled></el-date-picker>
    </el-form-item>
    <el-form-item label="详细内容：">
      <quillEditor v-model="form.content" ref="myQuillEditor" :options="data.editorOption" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="data.submitLoading" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { onMounted, reactive } from "@vue/composition-api";
import { GetList, EditInfo } from "@/api/news";
import { timestampToTime } from "@/utils/common";
// 富文本编辑器导入
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
// 组件
import UploadImg from "@c/UploadImg/index";
export default {
  name: "infoDetailed",
  components: { quillEditor, UploadImg },
  setup(props, { root }) {
    // 数据
    const uploadImgConfig = reactive({
      action: "http://up-z2.qiniup.com",
      accesskey: "Avh-EZZAa4TxqPQZsEW42fXBUbTMFi-RKSZTRKJj",
      secretkey: "l9AXtnhCVkZexXNRcmHXzmecXiCUiLynwGboMeUw",
      buckety: "webjshtml"
    })
    const data = reactive({
      id: root.$route.params.id || root.$store.getters["infoDetailed/infoId"],
      category: [],
      editorOption: {},
      submitLoading: false
    });

    // form表单数据
    const form = reactive({
      categoryId: "",
      title: "",
      createDate: "",
      content: "",
      imageUrl: ""
    });

    // let id =
    //   root.$route.params.id || root.$store.getters["infoDetailed/infoId"];
    // let title =
    //   root.$route.params.title || root.$store.getters["infoDetailed/infoTitle"];
    // console.log(id);
    // console.log(title);

    // methods
    // 获取信息分类
    const getInfoCategory = () => {
      root.$store
        .dispatch("common/getInfoCategory")
        .then(response => {
          // console.log(response);
          data.category = response;
        })
        .catch(error => {});
    };

    // 获取当前ID信息
    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: data.id
      };
      GetList(requestData)
        .then(response => {
          let responseData = response.data.data.data[0];
          // console.log(responseData);
          form.categoryId = responseData.categoryId;
          form.title = responseData.title;
          form.createDate = timestampToTime(responseData.createDate);
          form.content = responseData.content;
          form.imageUrl = responseData.imageUrl;
        })
        .catch(error => {});
    };

    // 保存(修改数据)
    const submit = () => {
      let requestData = {
        id: data.id,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        imageUrl: form.imageUrl
      };
      data.submitLoading = true;
      EditInfo(requestData)
        .then(response => {
          let data = response.data;
          // console.log(data)
          root.$message({
            message: data.message,
            type: "success"
          });
          data.submitLoading = false;
        })
        .catch(error => {
          data.submitLoading = false;
        });
    };
    
    onMounted(() => {
      getInfoCategory();
      getInfo();
    });

    return {
      // 数据
      uploadImgConfig,
      data,
      form,
      // methods
      getInfoCategory,
      getInfo,
      submit
    };
  }
};
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>