<template>
  <div id="header-wrap">
    <div class="pull-left header-icon" @click="navMenuState">
      <svg-ico iconName="menu" iconClass="menu" />
    </div>
    <div class="pull-right">
      <div class="user-info pull-left">
        <img class="pull-left" src="../../../assets/images/user.png" alt="" />
        <div class="pull-left">{{ username }}</div>
      </div>
      <div class="header-icon pull-left" @click="exit">
        <svg-ico iconName="exit" iconClass="exit" />
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from "@vue/composition-api";
export default {
  name: "layoutHeader",
  setup(props, { root }) {
    const username = computed(() => root.$store.state.app.username);
    const navMenuState = () => {
      root.$store.commit("app/SET_COLLAPSE");
    };
    const exit = () => {
      root.$store.dispatch("app/exit").then(() => {
        root.$router.push({
          name: "Login"
        });
      });
    };
    return {
      username,
      navMenuState,
      exit
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#header-wrap {
  position: fixed;
  left: $navMenu;
  right: 0;
  top: 0;
  z-index: 10;
  height: $layoutHeader;
  background-color: #fff;
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition, all 0.3s ease 0s);
  line-height: $layoutHeader;
}
.open {
  #header-wrap {
    left: $navMenu;
  }
}
.close {
  #header-wrap {
    left: $navMenuMin;
  }
}
.header-icon {
  padding: 0 32px;
  svg {
    margin-bottom: -8px;
    font-size: 25px;
    cursor: pointer;
  }
}
.user-info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  + .header-icon {
    padding: 0 28px;
  }
  img {
    display: inline-block;
    margin-top: 14px;
    margin-right: 18px;
    border-radius: 50px;
  }
}
</style>
