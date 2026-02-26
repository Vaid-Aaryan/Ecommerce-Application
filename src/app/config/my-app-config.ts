export default {
  auth: {
    domain: "dev-p6xkddb7ovi7sy7c.us.auth0.com",
    clientId: "Kv59NgqZa0WhEvW0zD8xNQIkN1mqXfe9",
    authorizationParams: {
      redirect_uri: "http://localhost:4200/login/callback",
      audience: "http://localhost:8080",
    },
  },
  httpInterceptor: {
    allowedList: [
      'http://localhost:8080/api/orders/**',
      'http://localhost:8080/api/checkout/purchase'
    ],
  },
}