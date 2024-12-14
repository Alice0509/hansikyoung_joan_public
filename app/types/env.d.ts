// app/types/env.d.ts

declare namespace NodeJS {
  interface ProcessEnv {
    CONTENTFUL_SPACE_ID: string;
    CONTENTFUL_ACCESS_TOKEN: string;
    // 필요한 다른 환경 변수들...
  }
}
