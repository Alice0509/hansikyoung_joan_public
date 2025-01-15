export default ({ config }) => ({
  ...config,
  expo: {
    name: 'HansikYoungRecipes', // 앱 이름
    slug: 'hansikyoungrecipes', // 앱 슬러그
    version: '1.0.0', // 앱 버전
    orientation: 'portrait', // 앱 화면 방향
    icon: './assets/images/icon.png', // 앱 아이콘
    splash: {
      image: './assets/images/splash.png', // 스플래시 이미지
      resizeMode: 'contain', // 스플래시 화면 이미지 크기 조정
      backgroundColor: '#FFFFFF', // 배경 색
    },
    userInterfaceStyle: 'automatic', // UI 스타일 (자동)
    extra: {
      googleAnalytics: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || '',
      disqusShortname: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || '',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
      contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID || '',
      contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
      googleMapsApiKeyClient:
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_CLIENT || '',
      googleMapsApiKeyServer: process.env.GOOGLE_MAPS_API_KEY_SERVER || '',
      ...(config.expo?.extra || {}),
      eas: {
        projectId: '84064207-a29f-4ddc-9942-fedd5bf9e6d8', // EAS 프로젝트 ID
      },
    },
    jsEngine: 'hermes', // JS 엔진 설정
    updates: {
      fallbackToCacheTimeout: 0, // 업데이트 시 캐시 대기 시간 설정
    },
    assetBundlePatterns: ['**/*'], // 에셋 번들 패턴
    web: {
      favicon: './assets/images/favicon.png', // 웹 파비콘
    },
    plugins: ['expo-localization'], // 추가 플러그인
    ios: {
      bundleIdentifier: 'com.joan.hansikyoungrecipes1', // iOS 번들 식별자
      deploymentTarget: '16.0', // iOS 배포 대상 버전
      supportsTablet: true, // 태블릿 지원 여부
      infoPlist: {
        NSAppTransportSecurity: {
          NSExceptionDomains: {
            'images.ctfassets.net': {
              NSIncludesSubdomains: true,
              NSTemporaryExceptionAllowsInsecureHTTPLoads: true,
            },
            'img.youtube.com': {
              NSIncludesSubdomains: true,
              NSTemporaryExceptionAllowsInsecureHTTPLoads: true,
            },
          },
        },
        NSLocationWhenInUseUsageDescription:
          'We need your location to provide location-based content.',
        NSCameraUsageDescription:
          'We need access to your camera to take photos.',
        NSPhotoLibraryUsageDescription:
          'We need access to your photo library to select images.',
        ITSAppUsesNonExemptEncryption: false, // 암호화 사용 여부
        NSSpeechRecognitionUsageDescription:
          'Control recipe steps using voice recognition.',
        NSMicrophoneUsageDescription:
          'Recognize voice commands using a microphone.',
      },
    },
    android: {
      package: 'com.joan.hansikyoungrecipes', // Android 패키지 이름
      permissions: ['RECORD_AUDIO'], // Android 권한 설정
    },
    newArchEnabled: false, // 새로운 아키텍처 사용 설정
    devClient: true, // Expo Dev Client 활성화
  },
});
