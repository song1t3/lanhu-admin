<template>
  <el-dialog
    title="新增"
    :visible.sync="dialog_info_flag"
    @close="close"
    width="580px"
    @opened="openDialog"
  >
    <el-form :model="form" ref="addInfoForm">
      <el-form-item label="类型：" :label-width="formLabelWidth" prop="category">
        <el-select v-model="form.category" placeholder="请选择活动区域">
          <el-option 
            v-for="item in categoryOption.item"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" :label-width="formLabelWidth" prop="title">
        <el-input v-model="form.title" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="概况：" :label-width="formLabelWidth" prop="content">
        <el-input type="textarea" v-model="form.content" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="danger" :loading="submitLoading" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { ref, reactive, watchEffect } from "@vue/composition-api";
import { AddInfo } from "@/api/news";
export default {
  name: "dialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit, root, refs }) {
    // 数据
    const dialog_info_flag = ref(false);
    const formLabelWidth = ref("70px");
    // 确认按钮加载状态
    const submitLoading = ref(false);
    const form = reactive({
      category: "",
      title: "",
      content: ""
    });
    const categoryOption = reactive({
      item: []
    });
    const close = () => {
      dialog_info_flag.value = false;
      emit("update:flag", false);
      // 重置表单
      resetForm();
    };
    // watchEffect
    watchEffect(() => dialog_info_flag.value  = props.flag);

    const openDialog = () => {
      categoryOption.item = props.category;
    };
    // 重置表单
    const resetForm = () => {
      refs.addInfoForm.resetFields();
    };
    // 确认提交
    const submit = () => {
      if(!form.category) {
        root.$message({
          message: "分类不能为空！！",
          type: "error"
        });
        return false;
      }else if(!form.title) {
        root.$message({
          message: "标题不能为空！！",
          type: "error"
        });
        return false;
      }else if(!form.content) {
        root.$message({
          message: "概况不能为空！！",
          type: "error"
        });
        return false;
      }
      submitLoading.value = true;
      let requestData = {
        category: form.category,
        title: form.title,
        content: form.content
      }
      AddInfo(requestData).then(response => {
        let data = response.data;
        // console.log(data)
        root.$message({
          message: data.message,
          type: "success"
        });
        // 刷新表格数据
        emit("getListAdd");
        submitLoading.value = false;
        // 重置表单
        resetForm();
      }).catch(error => {
        submitLoading.value = false;
      });
    };
    return {
      //ref
      dialog_info_flag,
      formLabelWidth,
      submitLoading,
      //reactive
      form,
      categoryOption,
      //methods
      close,
      openDialog,
      submit,
      resetForm
    };
  }

  //   watch: {
  //     flag: {
  //       handler(newValue, oldValue) {
  //         this.dialog_info_flag = newValue;
  //       }
  //     }
  //   }
};
</script>
<style scoped>
</style>