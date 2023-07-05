// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  endpoint: 'https://squid-app-bfky7.ondigitalocean.app/api/',
  //endpoint: 'http://localhost:4201/api/',
  endpoint2:'',
  endpointLocalImg: 'http://localhost:4201/api/',
  AH_url: 'https://goo.su/api/links/create',
  goo_su_token: 'xGLjj9ZqbkwElpzhUEMPIGQsSzUSfZcN40F5uHFVg0X5nzrf9RkBwhkIlp3t',
  stripe_public_key: 'pk_test_Wj915HLpr6PpdvzQMuzq8idv',
  sentry_key: null,
  google_provider: 'GOOGLE_ID',
  fb_provider: 'FB_ID',
  tawk: '',
  intercom: '',
  country: 'ES'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
