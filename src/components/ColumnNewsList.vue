<template>
  <ul class="column-con">
    <li v-for="item in content" :key="item.id">
      <router-link :to="{path: '/content/' + item.newsId}" class="clearfix">
        <div class="con-left">
          <p> {{item.title}} </p>
          <div class="source-date clearfix">
            <span class="source"> {{item.sourceName}} </span>
            <span class="date"> {{item.date}} </span>
          </div>
        </div>
        <div class="con-right">
          <img :src="item.imageList[0]">
        </div>
      </router-link>
    </li>
  </ul>
</template>
<script>
export default {
  props: ['content']
}
</script>
<style lang="scss">
  .column-con {
    li {
      height: 210px;
      padding: 26px 38px;
      border-bottom: 2px solid #F5F5F5;
      a {
        display: block;
      }
      .con-left {
        float: left;
        width: 450px;
        p {
          font-size: 32px;
          color: #000;
          line-height: 42px;
          margin-bottom: 38px;
          height: 84px;
        }
        .source-date {
          font-size: 24px;
          .source {
            float: left;
            color: rgba(0, 0, 0, 0.22);
          }
          .date {
            float: right;
            color: rgba(0, 0, 0, 0.22);
          }
        }
      }
      .con-right {
        float: right;
        width: 210px;
        img {
          width: 210px;
          height: 158px;
        }
      }
    }
    li.noImage {
      height: auto;
      .con-left {
        width: 100%;
        p {
          font-size: 30px;
          color: #000;
          line-height: 42px;
          margin-bottom: 38px;
          height: auto;
          max-height: 84px;
          display: -webkit-box;    
          -webkit-box-orient: vertical;    
          -webkit-line-clamp: 2;    
          overflow: hidden;
        }
      }
      .con-right {
        display: none;
      }
    }
    li:last-child {
      border-bottom: 0;
    }
  }
</style>