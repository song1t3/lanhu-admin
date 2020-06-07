<template>
  <div id="main-wrap">
    <div class="main-content">
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#main-wrap {
  height: 100vh;
  // position: fixed;
  // top: 75px;
  // left: $navMenu;
  // right: 0;
  // bottom: 0;
  // margin: 30px 30px 0 30px;
  // background-color: #fff;
  // -webkit-box-sizing: border;
}
.main-content {
  width: 100%;
  height: 100%;
  padding: $layoutHeader + 30px 30px 0 $navMenu + 30px;
  @include webkit(box-sizing, border-box);
  @include webkit(transition, all 0.3s ease 0s);
  box-sizing: border-box;
}
.open {
  .main-content {
    padding-left: $navMenu + 30px;
  }
}
.close {
  .main-content {
    padding-left: $navMenuMin + 30px;
  }
}
.content {
  width: 100%;
  height: 100%;
  padding: 30px 30px 0;
  @include webkit(box-sizing, border-box);
  box-sizing: border-box;
  background-color: #fff;
}
</style>
