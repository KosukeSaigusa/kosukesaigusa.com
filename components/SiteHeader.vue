<template>
  <div class="header-container flex py-2 mb-4">
    <p class="header-image my-auto">
      <img
        width="124"
        height="128"
        class="mx-auto rounded-full"
        src="/image/profile.webp"
        alt="Kosuke Saigusa"
      />
    </p>
    <div class="header-text my-auto pl-4">
      <h1 class="site-title font-bold text-lg">Kosuke Saigusa</h1>
      <h2 class="site-subtitle">ポートフォリオ、技術・雑記ブログ</h2>
      <div class="social-icons flex">
        <a
          href="https://github.com/KosukeSaigusa"
          class="social-icon p-2"
          target="_blank"
          rel="noopener"
          aria-label="GitHub のアカウントページ"
        >
          <font-awesome-icon class="text-2xl" :icon="['fab', 'github']" />
        </a>
        <a
          href="https://twitter.com/KosukeSaigusa"
          class="social-icon p-2"
          target="_blank"
          rel="noopener"
          aria-label="Twitter のアカウントページ"
        >
          <font-awesome-icon class="text-2xl" :icon="['fab', 'twitter']" />
        </a>
      </div>
    </div>
  </div>
</template>
