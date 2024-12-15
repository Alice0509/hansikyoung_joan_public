export default ({ config }) => ({
  ...config,
  expo: {
    name: "HansikYoungRecipes",
    slug: "hansikyoungrecipes",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FFFFFF",
    },
    userInterfaceStyle: "automatic",
    extra: {
      googleAnalytics: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || "",
      disqusShortname: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || "",
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
      contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID || "",
      contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
      googleMapsApiKeyClient:
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_CLIENT || "",
      googleMapsApiKeyServer: process.env.GOOGLE_MAPS_API_KEY_SERVER || "",
      ...(config.expo?.extra || {}), // 안전하게 config.expo.extra 병합
      eas: {
        projectId: "84064207-a29f-4ddc-9942-fedd5bf9e6d8",
      },
    },
    jsEngine: "jsc",
    web: {
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-localization"],
    ios: {
      bundleIdentifier: "com.joan.hansikyoungrecipes",
      deploymentTarget: "18.2", // iOS 배포 대상
      infoPlist: {
        NSAppTransportSecurity: {
          NSExceptionDomains: {
            "images.ctfassets.net": {
              // Contentful 이미지 도메인
              NSIncludesSubdomains: true,
              NSTemporaryExceptionAllowsInsecureHTTPLoads: true,
            },
            "img.youtube.com": {
              // YouTube 썸네일 도메인
              NSIncludesSubdomains: true,
              NSTemporaryExceptionAllowsInsecureHTTPLoads: true,
            },
          },
        },
      },
    },
    android: {
      package: "com.joan.hansikyoungrecipes",
    },
  },
});
