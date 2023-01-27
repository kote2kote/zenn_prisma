<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk}のToDo | Todo - トゥドゥ` : 'Todo | Todo - トゥドゥ';
  },
});
onMounted(() => {
  //
});
</script>
<template>
  <div>
    <Html>
      <Head>
        <!-- <Script src="https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js"></Script> -->
        <!-- <Link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" /> -->
      </Head>
    </Html>
    <div class="out_default">
      <div class="inner min-h-screen flex flex-col justify-between">
        <div class="">
          <Header />
          <slot />
        </div>

        <Footer />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use 'element-plus/dist/index.css';
@use 'element-plus/theme-chalk/index.css' as theme;
a {
  transition: all 0.3s ease;
  text-decoration: underline;
  color: rgb(0, 134, 196);
  opacity: 1;
  &:hover,
  &:active {
    opacity: 0.7;
  }
}

// -- page -------------- //
.out_default {
  .min-h-screen {
    min-height: 100svh;
  }
}
</style>
