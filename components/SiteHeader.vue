<template>
  <div class="header-container flex py-2 mb-4">
    <p class="header-image my-auto">
      <img
        width="288"
        height="288"
        class="mx-auto rounded-full h-16 w-16"
        src="/image/profile.webp"
        alt="Kosuke Saigusa"
      />
    </p>
    <div class="header-text my-auto pl-4">
      <h1 class="site-title font-bold text-lg">Kosuke Saigusa</h1>
      <div class="social-icons flex">
        <span class="text-gray-600 pr-2">Software developer</span>
        <a
          href="https://github.com/KosukeSaigusa"
          class="social-icon pr-2"
          target="_blank"
          rel="noopener"
          aria-label="GitHub のアカウントページ"
        >
          <font-awesome-icon
            :icon="['fab', 'github']"
            style="font-size: 24px"
          />
        </a>
        <a
          href="https://twitter.com/KosukeSaigusa"
          class="social-icon pr-2"
          target="_blank"
          rel="noopener"
          aria-label="Twitter のアカウントページ"
        >
          <font-awesome-icon
            :icon="['fab', 'twitter']"
            style="font-size: 24px"
          />
        </a>
      </div>
      <h2 class="site-subtitle">ポートフォリオ、技術・雑記ブログ</h2>
    </div>
  </div>
</template>
