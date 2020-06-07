<template>
  <div id="InfoCategory">
    <el-button type="danger" @click="addFirst({ type: 'category_first_add' })">添加一级分类</el-button>
    <hr />
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category-wrap">
            <div class="category" v-for="firstItem in category.item" :key="firstItem.id">
              <!-- 一级分类 -->
              <h4>
                {{ firstItem.category_name }}
                <svg-ico iconClass="minus" class="minus" />
                <div class="button-group">
                  <el-button
                    type="danger"
                    size="mini"
                    round
                    @click="editCategory({ data: firstItem, type: 'category_first_edit' })"
                  >编辑</el-button>
                  <el-button
                    type="success"
                    size="mini"
                    round
                    @click="handlerAddChildren({ data: firstItem, type: 'category_children_add' })"
                  >添加子级</el-button>
                  <el-button size="mini" round @click="deleteCategoryComfirm(firstItem.id)">删除</el-button>
                </div>
              </h4>
              <!-- 子级分类 -->
              <ul v-if="firstItem.children">
                <li v-for="childrenItem in firstItem.children" :key="childrenItem.id">
                  {{ childrenItem.category_name }}
                  <div class="button-group">
                    <el-button
                      type="danger"
                      size="mini"
                      round
                      @click="editChildrenCategory({ data: childrenItem, type: 'category_children_edit' })"
                    >编辑</el-button>
                    <el-button
                      size="mini"
                      round
                      @click="deleteCategoryChildrenComfirm({childrenId: childrenItem.id, parentId: firstItem.id})"
                    >删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <h4 class="menu-title">一级分类编辑</h4>
          <el-form label-width="142px" class="form-wrap" ref="categoryFrom">
            <el-form-item prop="categoryName" label="一级分类名称：" v-if="category_first_input">
              <el-input v-model="form.categoryName" :disabled="category_first_disabled"></el-input>
            </el-form-item>
            <el-form-item prop="secCategoryName" label="二级分类名称：" v-if="category_children_input">
              <el-input v-model="form.secCategoryName" :disabled="category_children_disabled"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                @click="submit"
                :loading="submit_button_loading"
                :disabled="submit_button_disabled"
              >确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
import {
  AddFirstCategory,
  GetCategory,
  DeleteCategory,
  EditCategory,
  AddChildrenCategory
} from "@/api/news";
import { global } from "@/utils/global";
import { common } from "@/api/common";
export default {
  name: "InfoCategory",
  setup(props, { root, refs }) {
    // 数据
    // global
    const { confirm } = global();
    //common
    const { categoryItem, getInfoCategory, getInfoCategoryAll } = common();
    // ref
    const category_first_input = ref(true);
    const category_children_input = ref(true);
    const submit_button_loading = ref(false);
    const category_first_disabled = ref(true);
    const category_children_disabled = ref(true);
    const submit_button_disabled = ref(true);
    // 删除一级分类id
    const deleteId = ref("");
    // 删除子级分类id
    const deleteChildrenId = ref("");
    const submit_button_type = ref("");
    // reactive
    const form = reactive({
      categoryName: "",
      secCategoryName: ""
    });
    const category = reactive({
      item: [],
      current: []
    });
    // methods
    const submit = () => {
      // 判断提交的类型（新增/编辑）
      if (submit_button_type.value == "category_first_add") {
        addFirstCategory();
      } else if (submit_button_type.value == "category_first_edit") {
        editFirstCategory();
      } else if (submit_button_type.value == "category_children_add") {
        addChildrenCategory();
      } else if (submit_button_type.value == "category_children_edit") {
        EditChildrenCategory();
      }
    };
    // 添加一级分类
    const addFirstCategory = () => {
      if (!form.categoryName) {
        root.$message.error("分类名称不能为空");
        return false;
      }
      // 按钮加载状态
      submit_button_loading.value = true;
      AddFirstCategory({ categoryName: form.categoryName })
        .then(response => {
          let data = response.data;
          if (data.resCode === 0) {
            root.$message({
              message: data.message,
              type: "success"
            });
            category.item.push(response.data.data);
          }
          submit_button_loading.value = false;
          form.categoryName = "";
          form.secCategoryName = "";
        })
        .catch(error => {
          submit_button_loading.value = false;
          // 清除表单内容
          // refs.categoryFrom.resetFields();
          form.categoryName = "";
          form.secCategoryName = "";
        });
    };
    // 添加一级分类按钮
    const addFirst = params => {
      // 改变确认按钮的类型
      submit_button_type.value = params.type;
      // 一级分类输入框显示，子级隐藏
      category_first_input.value = true;
      category_children_input.value = false;
      // 将input和按钮解除禁用
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
    };
    // 添加子级
    const handlerAddChildren = params => {
      // console.log(params);
      // 更新确定按钮类型
      submit_button_type.value = params.type;
      // 存储数据
      category.current = params.data;
      // 禁用一级输入框
      category_first_disabled.value = true;
      // 解除子级input和按钮的禁用状态
      category_children_disabled.value = false;
      submit_button_disabled.value = false;
      // 显示子级输入框
      category_children_input.value = true;
      // 显示一级分类文本内容
      form.categoryName = params.data.category_name;
    };
    const addChildrenCategory = () => {
      if (!form.categoryName) {
        root.$message.error("子级分类名称不能为空！！");
        return false;
      }
      // 按钮加载状态
      submit_button_loading.value = true;
      let requestDate = {
        categoryName: form.secCategoryName,
        parentId: category.current.id
      };
      AddChildrenCategory(requestDate)
        .then(response => {
          let responseDate = response.data;
          root.$message({
            message: responseDate.message,
            type: "success"
          });
          // 调用分类列表接口
          getInfoCategoryAll();
          // 按钮加载状态
          submit_button_loading.value = false;
          // 清空子级input框
          form.secCategoryName = "";
        })
        .catch(error => {});
    };
    // 删除一级分类信息
    const deleteCategoryComfirm = categoryID => {
      deleteId.value = categoryID;
      confirm({
        content: "确认删除当前信息，确认后将无法恢复！！！",
        tips: "警告",
        fn: deleteCategory,
        catchFn: () => {
          deleteId.value = "";
        }
      });
    };
    // 删除子级分类信息提示
    const deleteCategoryChildrenComfirm = categoryID => {
      deleteChildrenId.value = categoryID.childrenId;
      deleteId.value = categoryID.parentId;
      confirm({
        content: "确认删除当前信息，确认后将无法恢复！！！",
        tips: "警告",
        fn: deleteCategoryChildren,
        catchFn: () => {
          deleteId.value = "";
          deleteChildrenId.value = "";
        }
      });
    };
    // 删除一级分类信息
    const deleteCategory = parentId => {
      DeleteCategory({ categoryId: deleteId.value })
        .then(response => {
          // 删除category.item数组指定数据
          let index = category.item.findIndex(
            item => item.id == deleteId.value
          );
          category.item.splice(index, 1);
          deleteId.value = "";
        })
        .catch(error => {
          deleteId.value = "";
        });
    };
    // 删除子级分类信息
    const deleteCategoryChildren = childrenId => {
      DeleteCategory({ categoryId: deleteChildrenId.value })
        .then(response => {
          // 删除category.item数组指定数据
          // 先找到对于的一级分类
          let parentIndex = category.item.findIndex(
            item => item.id == deleteId.value
          );
          // console.log(category.item[parentIndex]);
          // 通过一级分类下标再往下找到其下的对于子级分类下标
          let childrenIndex = category.item[parentIndex].children.findIndex(
            item => item.id == deleteChildrenId.value
          );
          // 删除子级分类数组
          category.item[parentIndex].children.splice(childrenIndex, 1);
          // 清空id值
          deleteId.value = "";
          deleteChildrenId.value = "";
        })
        .catch(error => {
          // 清空id值
          deleteId.value = "";
          deleteChildrenId.value = "";
        });
    };
    // 点击一级编辑按钮
    const editCategory = params => {
      submit_button_type.value = params.type;
      // 显示一级input框
      category_first_input.value = true;
      // 将二级分类input框隐藏,一级分类input和确认按钮的禁用解除
      category_children_input.value = false;
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
      // 将一级类名同步到input框中
      form.categoryName = params.data.category_name;
      // 存储当前的数据对象
      category.current = params.data;
    };
    // 点击子级编辑按钮
    const editChildrenCategory = params => {
      submit_button_type.value = params.type;
      // 显示子级input框
      category_children_input.value = true;
      // 将一级分类input隐藏，子级分类input和确认按钮的禁用解除
      category_first_input.value = false;
      category_children_disabled.value = false;
      submit_button_disabled.value = false;
      // 将子级级类名同步到input框中
      form.secCategoryName = params.data.category_name;
      // 存储当前的数据对象
      category.current = params.data;
    };
    // 修改一级分类名称
    const editFirstCategory = () => {
      // 判断输入框内容是否为空
      if (!form.categoryName) {
        root.$message({
          message: "一级分类名称不能为空！！",
          type: "error"
        });
        return false;
      }
      let requestDate = {
        id: category.current.id,
        categoryName: form.categoryName
      };
      EditCategory(requestDate)
        .then(response => {
          // console.log(response.data);
          let responseDate = response.data;
          root.$message({
            message: responseDate.message,
            type: "success"
          });
          // 同步修改category中item的数据
          category.current.category_name = responseDate.data.data.categoryName;
          // let data = category.item.filter(item => item.id == category.current.id);
          // data[0].category_name = responseDate.data.data.categoryName;
          // 清空输入框内容和category.current数组
          form.categoryName = "";
        })
        .catch(error => {});
    };
    // 修改子级分类名称
    const EditChildrenCategory = () => {
      // 判断输入框内容是否为空
      if (!form.secCategoryName) {
        root.$message({
          message: "二级分类名称不能为空！！",
          type: "error"
        });
        return false;
      }
      let requestDate = {
        id: category.current.id,
        categoryName: form.secCategoryName
      };
      EditCategory(requestDate)
        .then(response => {
          // console.log(response.data);
          let responseDate = response.data;
          root.$message({
            message: responseDate.message,
            type: "success"
          });
          // 同步修改category中item的数据
          category.current.category_name = responseDate.data.data.categoryName;
          // let data = category.item.filter(item => item.id == category.current.id);
          // data[0].category_name = responseDate.data.data.categoryName;
          // 清空输入框内容和category.current数组
          form.secCategoryName = "";
        })
        .catch(error => {});
    };
    // 生命周期
    // 挂载完成执行
    onMounted(() => {
      getInfoCategoryAll();
    });
    // watch监听
    watch(
      () => categoryItem.item,
      value => {
        category.item = value;
      }
    );
    return {
      // ref
      category_first_input,
      category_children_input,
      submit_button_loading,
      category_first_disabled,
      category_children_disabled,
      submit_button_disabled,
      deleteId,
      submit_button_type,
      // reactive
      form,
      category,
      // methods
      submit,
      addFirstCategory,
      addFirst,
      handlerAddChildren,
      addChildrenCategory,
      deleteCategoryComfirm,
      deleteCategoryChildrenComfirm,
      deleteCategoryChildren,
      deleteCategory,
      editCategory,
      editChildrenCategory,
      EditChildrenCategory,
      editFirstCategory
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
#InfoCategory {
  hr {
    margin: 30px -30px 30px -30px;
    border: none;
    border-top: 1px solid #e9e9e9;
  }
}
.category-wrap {
  div:first-child {
    &:before {
      top: 20px;
    }
  }
  div:last-child {
    &:before {
      bottom: 21px;
    }
  }
  cursor: pointer;
}
.category {
  position: relative;
  line-height: 44px;
  &:before {
    content: "";
    position: absolute;
    left: 22px;
    top: 0;
    bottom: 0;
    border-left: 1px dotted #000;
  }
  h4 {
    position: relative;
    padding-left: 40px;
    svg {
      position: absolute;
      left: 14px;
      top: 13px;
      font-size: 17px;
      background-color: #fff;
    }
  }
  li {
    position: relative;
    padding-left: 36px;
    margin-left: 24px;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 21px;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  h4,
  li {
    @include webkit(transition, all 0.5s ease 0s);
    &:hover {
      background-color: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
  .button-group {
    display: none;
    position: absolute;
    top: -1px;
    right: 11px;
    z-index: 2;
    button {
      font-size: 12px;
    }
  }
}
.menu-title {
  line-height: 44px;
  padding-left: 22px;
  background-color: #f3f3f3;
}
.form-wrap {
  width: 410px;
  padding-top: 26px;
}
</style>
