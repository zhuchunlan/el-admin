<template>
  <!--用于加载网络svg-->
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-on="$listeners"
  />
  <!--用于加载本地svg-->
  <!-- 
    aria-hidden="true"
    作用：https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/ARIA_Techniques/%E4%BD%BF%E7%94%A8aria-hidden%E5%B1%9E%E6%80%A7
   -->
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :href="iconName" />
  </svg>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { isExternal } from "@/utils/validate";

export default {
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
  },
  computed: {
    //正则匹配是否是https开头的网络svg，我们在使用svg的时候不一定全是本地的svg
    isExternal() {
      return isExternal(this.iconClass);
    },
    // 要加载的svg地址
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    // 默认给svg-icon添加了样式，见style，svg图标的大小跟父元素的字体大小有关，1:1的，因为是em单位，子元素svg的宽高就等于父元素的字体大小
    //比如父元素的字体大小为30px，那么这个svg的宽高就是30px * 30px
    //但是有时候父元素的字体大小使得svg的大小在页面显示的时候不合适，所以我们需要重新给svg设置字体大小
    //就采用了class-name传递一个属性过来，在父组件中写classname的样式
    svgClass() {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        "-webkit-mask": `url(${this.iconClass}) no-repeat 50% 50%`,
      };
    },
  },
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
