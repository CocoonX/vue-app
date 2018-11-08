<template>
  <div class="bg-share">
    <img class="bg" src="../assets/image/bg-share.png">
    <img class="code" src="../assets/image/share-code.png">
  </div>
</template>
<style lang="scss">
  .bg-share {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 1000;
    img.bg {
      width: 100%;
      height: 100%;
    }
    img.code {
      position: absolute;
      bottom: 70px;
      left: 50%;
      margin-left: -150px;
      width: 300px;
      height: 292px;
    }
  }
</style>

