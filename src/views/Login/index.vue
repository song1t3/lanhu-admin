<template>
  <div id="login">
    <div class="login-warp">
      <ul class="menu-tab">
        <li
          :class="{ ' current': item.current }"
          v-for="item in menuTab"
          :key="item.id"
          @click="toggleMenu(item)"
        >
          {{ item.txt }}
        </li>
      </ul>
      <!-- 表单 start -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label>邮箱</label>
          <el-input
            type="tetx"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label>密码</label>
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="passwords"
          class="item-form"
          v-show="model === 'register'"
        >
          <label>重复密码</label>
          <el-input
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="11">
            <el-col :span="15">
              <div class="grid-content bg-purple">
                <el-input
                  v-model="ruleForm.code"
                  minlength="6"
                  maxlength="6"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="grid-content bg-purple">
                <el-button
                  type="success"
                  class="block"
                  @click="getSms()"
                  :disabled="codeButtonStatus.status"
                  >{{ codeButtonStatus.text }}</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            class="login-btn block"
            type="danger"
            :disabled="loginButtonStatus"
            @click="submitForm('loginForm')"
            >{{ model === "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 表单 end -->
    </div>
  </div>
</template>

<script>
import sha1 from "js-sha1";
import { GetSms, Register } from "@/api/login";
import { reactive, ref, onMounted } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVCode
} from "@/utils/validate";
export default {
  name: "login",
  // setup(props, context){
  // context.attrs 3.0
  // context.slots
  // context.parent
  // context.root
  // context.emit
  // context.refs
  setup(props, { refs, root }) {
    // 验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    // 验证密码
    let validatePassword = (rule, value, callback) => {
      // 过滤后的数据
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6至20位数字+字母"));
      } else {
        callback();
      }
    };
    // 验证重复密码
    let validatePasswords = (rule, value, callback) => {
      // 如果模块值为login，则直接通过
      if (model.value === "login") {
        callback();
      }
      // 过滤后的数据
      value = ruleForm.passwords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };
    // 验证验证码
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入验证码"));
      } else if (validateVCode(value)) {
        return callback(new Error("验证码有误"));
      } else {
        callback();
      }
    };

    // 这里放置data数据、生命周期、自定义的函数
    // 声明数据
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    // 模块值
    const model = ref("login");
    // 登录按钮禁用状态
    const loginButtonStatus = ref(true);
    // 获取验证码按钮状态以及内容文字
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });
    // 倒计时
    const timer = ref(null);
    // 表单绑定数据
    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: ""
    });

    // 表单的验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });

    // 声明函数
    // 切换登录注册页面
    const toggleMenu = data => {
      menuTab.forEach(ele => {
        ele.current = false;
      });
      // 高光
      data.current = true;
      // 修改模块值
      model.value = data.type;
      resetFromData();
      // 切换还原登录注册按钮以及获取验证码按钮的初始状态
      clearCountDown();
    };
    // 清除表单数据
    const resetFromData = () => {
      //切换重置情况表单内容
      refs["loginForm"].resetFields();
    };
    // 更新按钮状态
    const updataButtonStatus = params => {
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    };
    // 获取验证码
    const getSms = () => {
      // 进行提示
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能为空！！");
        return false;
      }
      // console.log(validateEmail(ruleForm.username));
      if (validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式有误，请重新输入！！");
        return false;
      }
      // 声明登录获取验证码的参数
      let requestData = {
        username: ruleForm.username,
        module: model.value
      };
      // 修改获取验证码按钮状态以及文字内容
      updataButtonStatus({
        status: true,
        text: "发送中"
      });
      // 请求的接口,获取验证码
      GetSms(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          // 启用登陆或注册按钮
          loginButtonStatus.value = false;
          // 调定时器，倒计时
          countDown(60);
        })
        .catch(error => {
          console.log(error);
          updataButtonStatus({
            status: false,
            text: "获取验证码"
          });
        });
      codeButtonStatus.value = false;
    };

    // 表单提交
    const submitForm = formName => {
      refs[formName].validate(valid => {
        // 表单验证通过
        if (valid) {
          // 判断是登录还是注册
          model.value === "login" ? login() : register();
          // if(model.value === 'login'){
          //     login()
          // }else{
          //     register()
          // }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    // 登录
    const login = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      root.$store
        .dispatch("app/login", requestData)
        .then(response => {
          // console.log(response);
          // 页面跳转
          root.$router.push({
            name: "Console"
          });
          clearCountDown();
        })
        .catch(error => {
          console.log(error);
        });
    };
    // 注册
    const register = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
        module: "register"
      };
      // 注册接口
      Register(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          // 注册成功跳转到登录页
          toggleMenu(menuTab[0]);
          clearCountDown();
        })
        .catch(error => {
          //失败执行代码
          console.log(error);
        });
    };

    // 倒计时
    const countDown = number => {
      let time = number;
      // 判断定时器是否存在，存在则清除
      if (timer.value) {
        clearInterval(timer.value);
      }
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value);
          // 修改获取验证码按钮状态以及文字内容
          updataButtonStatus({
            status: false,
            text: "再次发送"
          });
          // 禁用登陆或注册按钮
          loginButtonStatus.value = false;
        } else {
          codeButtonStatus.text = `倒计时${time}秒`;
        }
      }, 1000);
    };
    // 清除倒计时
    const clearCountDown = () => {
      // 还原验证码默认状态以及禁用登录注册按钮
      updataButtonStatus({
        status: false,
        text: "获取验证码"
      });
      loginButtonStatus.value = true;
      // 清除倒计时
      clearInterval(timer.value);
    };

    // 生命周期
    // 挂在完成后
    onMounted(() => {});
    return {
      menuTab,
      model,
      loginButtonStatus,
      codeButtonStatus,
      ruleForm,
      rules,
      timer,
      toggleMenu,
      submitForm,
      resetFromData,
      updataButtonStatus,
      getSms
    };
  }
};
</script>

<style lang="scss" scoped>
#login {
  width: 100%;
  height: 100%;
  background-color: #344a5f;
  position: absolute;
}
.login-warp {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #ffffff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: #2f4255;
  }
}

// 表单 start
.login-form {
  margin-top: 27px;
  label {
    display: block;
    font-size: 14px;
    color: #ffffff;
    margin-bottom: 5px;
  }
  .item-form {
    margin-bottom: 12px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 20px;
  }
}
// 表单 end
</style>
