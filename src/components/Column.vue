<template>
  <div class="column">
    <div class="column-title clearfix">
      <span class="bar" :class="{ blue : columnId === 2}"></span>
      <span class="title">{{title}}</span>
      <router-link class="more" :to="link" v-if="link">更多 <i></i></router-link>
    </div>
    <column-news-list :content="content"></column-news-list>
  </div>
</template>
<script>
import ColumnNewsList from '../components/ColumnNewsList.vue'
export default {
  props: ['content', 'title', 'link', 'columnId'],
  data () {
    return {
      image: true
    }
  },
  components: {
    ColumnNewsList
  }
}
</script>

<style lang="scss">
  .column {
    background: #fff;
  }
  .column-title {
    height: 80px;
    border-bottom: 2px solid #F5F5F5;
    padding: 0 34px 0 32px;
    .bar {
      float: left;
      width: 4px;
      height: 34px;
      background: #DF3135;
      border-radius: 2px;
      margin: 28px 15px 0 0;
    }
    .blue {
      background: #01ACAA;
    }
    .title {
      float: left;
      color: #111111;
      font-size: 34px;
      margin-top: 20px;
      font-weight: bold;
    }
    .more {
      float: right;
      height: 38px;
      line-height: 38px;
      text-align: center;
      margin-top: 24px;
      color: #A1A1A1;
      font-size: 24px;
      i {
        display: inline-block;
        width: 10px;
        height: 19px;
        background: url(../assets/image/icon-more.png) no-repeat;
        background-size: 100%;
      }
    }
  }
</style>

