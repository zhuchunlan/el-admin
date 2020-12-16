<template>
  <div class="login">
    <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      class="loginForm"
    >
      <h3 class="title">EL-ADMIN 后台管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="账号">
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          placeholder="密码"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="check" class="check">
        <el-input
          v-model="loginForm.check"
          placeholder="验证码"
          style="width: 60%"
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="check-img">
          <img :src="imgUrl" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
      <el-form-item>
        <el-button type="primary" style="width: 100%; margin-top: 20px">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        check: "",
        remember: false,
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        check: [{ required: true, message: "请输入验证码", trigger: "change" }],
      },
      imgUrl: "",
    };
  },
  created() {
    this.getCode();
  },
  methods: {
    getCode() {
      api("login.getCode").then((res) => {
        console.log(res);
        this.imgUrl = res.img;
        this.loginForm.check = res.uuid;
      });
    },
  },
};
</script>

<style lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: url("../assets/images/background.jpg") 100% no-repeat;
  .loginForm {
    width: 385px;
    background-color: #fff;
    padding: 25px 25px 5px;
    border-radius: 6px;
    .title {
      color: #707070;
      margin: 0 auto 30px;
      text-align: center;
    }
    .check-img {
      width: 33%;
      height: 38px;
      float: right;
    }
  }
}
</style>