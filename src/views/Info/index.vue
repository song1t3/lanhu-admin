<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-row :gutter="14">
        <el-col :span="4">
          <div class="label-wrap category">
            <label for>类型：</label>
            <div class="warp-content">
              <el-select v-model="category_value" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in options.category"
                  :key="item.id"
                  :label="item.category_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="label-wrap date">
            <label for>日期：&nbsp;&nbsp;</label>
            <div class="warp-content">
              <el-date-picker
                v-model="data_value"
                type="datetimerange"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['12:00:00']"
                align="right"
                style="width:100%;"
              ></el-date-picker>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="label-wrap key-work">
            <label for>关键字：&nbsp;&nbsp;</label>
            <div class="warp-content">
              <el-select v-model="search_key" style="width:100%;">
                <el-option
                  v-for="item in search_option"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <el-input v-model="search_keyWork" placeholder="请输入内容" style="width:100%;"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="danger" style="width:100%;" @click="getList">搜索</el-button>
        </el-col>
        <el-col :span="3" style="height:40px;">&nbsp;</el-col>
        <el-col :span="2">
          <el-button
            type="danger"
            class="pull-right"
            style="width:100%;"
            @click="dialog_info = true"
          >新增</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="black-space-30"></div>
    <!-- 表格数据 -->
    <el-table
      :data="table_data.item"
      border
      style="width: 100%"
      v-loading="loadingData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column prop="title" label="标题" width="750"></el-table-column>
      <el-table-column prop="categoryId" label="类型" width="130" :formatter="toCategory"></el-table-column>
      <el-table-column prop="createDate" label="日期" width="237" :formatter="toDate"></el-table-column>
      <el-table-column prop="user" label="管理员" width="115"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteItem(scope.row.id)">删除</el-button>
          <el-button type="success" size="mini" @click="editInfo(scope.row.id)">编辑</el-button>
          <el-button type="success" size="mini" @click="detailed(scope.row)">编辑详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <div class="black-space-30"></div>
    <el-row>
      <el-col :span="12">
        <el-button size="medium" @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination
          class="pull-right"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 新增弹窗 -->
    <DialogInfo
      :flag.sync="dialog_info"
      :category="options.category"
      ref="addInfoForm"
      @getListAdd="getList"
    />
    <!-- 修改弹窗 -->
    <DialogEditInfo
      :id="infoId"
      :flag.sync="dialog_info_edit"
      :category="options.category"
      @getListEmit="GetListEmit"
      ref="editForm"
    />
  </div>
</template>
<script>
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
import DialogInfo from "./dialog/info";
import DialogEditInfo from "./dialog/edit";
import { global } from "@/utils/global";
// import { common } from "@/api/common";
import { GetCategory, GetList, DeleteInfo } from "@/api/news";
import { timestampToTime } from "@/utils/common";
export default {
  name: "infoIndex",
  components: { DialogInfo, DialogEditInfo },
  setup(props, { root, refs }) {
    // const { categoryItem, getInfoCategory } = common();
    // 信息弹窗标记
    const { confirm } = global();
    // 数据
    // watch(() => { console.log(aaa.value) });
    // 新增和修改的弹窗开关
    const dialog_info = ref(false);
    const dialog_info_edit = ref(false);
    const search_key = ref("id");
    const category_value = ref("");
    const data_value = ref("");
    const search_keyWork = ref("");
    const total = ref(0);
    const loadingData = ref(false);
    const infoId = ref(""); //数据id
    const deleteInfoId = ref(""); //删除数据的id
    const options = reactive({
      category: []
    });
    //搜索关键字
    const search_option = reactive([
      {
        value: "id",
        label: "ID"
      },
      {
        value: "title",
        label: "标题"
      }
    ]);
    // 表格数据
    const table_data = reactive({
      item: []
    });
    // 页码
    const page = reactive({
      pageNumber: 1,
      pageSize: 10
    });
    // 方法
    const handleSizeChange = val => {};
    const handleCurrentChange = val => {
      page.pageNumber = val;
      getList();
    };
    // 删除数据
    const deleteItem = id => {
      deleteInfoId.value = [id];
      confirm({
        content: "确认删除此信息？",
        tip: "警告",
        fn: confirmDelete
      });
    };
    // 删除全部数据
    const deleteAll = () => {
      if (!deleteInfoId.value || deleteInfoId.value.length == 0) {
        root.$message({
          message: "请选择要删除的数据！！",
          type: "error"
        });
        return false;
      }
      confirm({
        content: "确认删除选择的数据，确认后将无法回复！！",
        tip: "警告",
        fn: confirmDelete,
        id: "11111"
      });
    };
    const confirmDelete = value => {
      DeleteInfo({ id: deleteInfoId.value })
        .then(response => {
          // 清空要删除数据的id
          deleteInfoId.value = "";
          getList();
          // 删除成功提示
          root.$message({
            message: response.data.message,
            type: "success"
          });
        })
        .catch(error => {});
    };
    // 获取分类
    const getCategory = () => {
      GetCategory({})
        .then(response => {
          // console.log(response.data);
          let data = response.data.data.data;
          options.category = data;
        })
        .catch(error => {});
    };
    const getInfoCategory = () => {
      root.$store
        .dispatch("common/getInfoCategory")
        .then(response => {
          // console.log(response);
          options.category = response;
        })
        .catch(error => {});
    };
    // 搜索条件处理
    const formData = () => {
      let requestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      //分类ID
      if (category_value.value) {
        requestData.categoryId = category_value.value;
      }
      // 日期
      if (data_value.value.length > 0) {
        requestData.startTiem = data_value.value[0];
        requestData.endTime = data_value.value[1];
      }
      // 关键字
      if (search_keyWork.value) {
        requestData[search_key.value] = search_keyWork.value;
      }
      return requestData;
    };
    // 获取信息列表
    const getList = () => {
      // 单独处理数据
      let requestData = formData();
      // 加载状态
      loadingData.value = true;
      GetList(requestData)
        .then(response => {
          // console.log(response.data.data.data)
          let data = response.data.data;
          // 更新表格数据
          table_data.item = data.data;
          // 更新页码
          total.value = data.total;
          // 加载状态
          loadingData.value = false;
        })
        .catch(() => {
          loadingData.value = false;
        });
    };
    // 将时间戳转换为正常时间
    const toDate = (row, column, cellValue, index) => {
      return timestampToTime(row.createDate);
    };
    // 匹配类型
    const toCategory = row => {
      let categoryId = row.categoryId;
      let categoryData = options.category.filter(
        item => item.id == categoryId
      )[0];
      return categoryData.category_name;
    };
    // 绑定目前所勾选的
    const handleSelectionChange = val => {
      // console.log(val);
      let id = val.map(item => item.id);
      deleteInfoId.value = id;
    };
    // 编辑修改信息
    const editInfo = id => {
      infoId.value = id;
      dialog_info_edit.value = true;
    };
    // 修改信息后，更新表格数据内容
    const GetListEmit = () => {
      // 将修改的内容覆盖到table_data下item对应的地方
      let data = table_data.item.filter(item => item.id == infoId.value);
      data[0].categoryId = refs.editForm.form.category;
      data[0].content = refs.editForm.form.content;
      data[0].title = refs.editForm.form.title;
    };
    // 跳转详情页
    const detailed = (data) => {
      root.$store.commit("infoDetailed/UPDATE_STATE_VALUE", {
        id: {
          value: data.id,
          sessionKey: "infoId",
          session: true
        },
        title: {
          value: data.title,
          sessionKey: "infoTitle",
          session: true
        }
      })
      root.$router.push({
        name: "InfoDetailed",
        params: {
          id: data.id,
          title: data.title
        }
      });
    };
    // 生命周期
    onMounted(() => {
      // 获取分类
      getInfoCategory();
      // 获取列表
      getList();
    });
    // watch监听
    // watch(() => refs.edit.form, (value) => {
    //     options.category = value;
    // })
    return {
      // ref
      dialog_info,
      dialog_info_edit,
      search_key,
      category_value,
      data_value,
      search_keyWork,
      total,
      infoId,
      loadingData,
      // reactive
      options,
      search_option,
      table_data,
      // methdos
      handleSizeChange,
      handleCurrentChange,
      deleteItem,
      deleteAll,
      confirmDelete,
      getCategory,
      getInfoCategory,
      getList,
      toDate,
      toCategory,
      handleSelectionChange,
      editInfo,
      GetListEmit,
      detailed
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-wrap {
  &.category {
    @include labelDom(left, 60, 40);
  }
  &.date {
    @include labelDom(right, 93, 40);
  }
  &.key-work {
    @include labelDom(right, 100, 40);
  }
}
</style>
