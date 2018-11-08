<template>
  <div class="myNav">
    <div v-for="(item, index) in list" :key="index" class="myNav_item" @click="$emit('click'+index)">
      <span></span>
      <span>{{item.msg}}</span>
      <i></i>
      <!-- <Icon type="ios-arrow-forward"></Icon> -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: [
        {msg: 'hello'},
        {msg: 'hello'}
      ]
    }
  }
}
</script>
<style lang="scss">
  // @import '../assets/style/common.scss';

  .myNav {
    margin: 20px 0;
  }
  .myNav_item {
    line-height: 92px;
    background: #fff;
    text-align: center;
    font-size: 30px;
    span {
      display: inline-block;
      width: 80%;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    &:last-child span {
      border-bottom: 0;
    }
    i {
      display: inline-block;
      width: 16px;
      height: 29px;
      background: url(../assets/image/icon-arrow.png);
      background-size: 100%;
    }
  }
</style>

