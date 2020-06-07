<template>
  <div id="nav-wrap">
    <h1 class="logo">
      <img src="../../../assets/images/logo.png" alt />
    </h1>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <!-- 一级菜单 -->
      <template v-for="(item, index) in routers">
        <el-submenu v-if="!item.hidden" :key="item.id" :index="index + ''">
          <template slot="title">
            <svg-ico :iconClass="item.meta.icon" :className="item.meta.icon" />
            <span slot="title">{{ item.meta.name }}</span>
          </template>
          <!-- 子级菜单 -->
          <template v-for="subItem in item.children">
            <el-menu-item
              :key="subItem.id"
              :index="subItem.path"
              v-if="!subItem.hidden"
              >{{ subItem.meta.name }}</el-menu-item
            >
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
import { onMounted, computed } from "@vue/composition-api";
export default {
  name: "navMenu",
  setup(props, { root }) {
    // data数据
    const routers = root.$router.options.routes;
    // computed监听
    const isCollapse = computed(() => root.$store.state.app.isCollapse);
    // 生命周期
    // 挂在完成后
    onMounted(() => {});
    return {
      isCollapse,
      routers
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
.logo {
  text-align: center;
  img {
    width: 92px;
    margin: 0 auto;
    @include webkit(transition, all 0.3s ease 0s);
  }
}
#nav-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: $navMenu;
  height: 100vh;
  background-color: #344a5f;
  @include webkit(transition, all 0.3s ease 0s);
  svg {
    font-size: 20px;
    margin-right: 10px;
  }
}
.open {
  #nav-wrap {
    width: $navMenu;
  }
}
.close {
  #nav-wrap {
    width: $navMenuMin;
  }
  .logo img {
    width: 60%;
  }
}
</style>
