export default () => ({
  port: parseInt(process.env.BACKEND_APP_PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  // TODO @yashmurty : Populate this via env file, to support CircleCI env params
  // instead of a serviceAccount JSON file.
  firebase: {
    /*eslint-disable */
    type: '',
    project_id: '',
    private_key_id: '',
    private_key: '',
    client_email: '',
    client_id: '',
    auth_uri: '',
    token_uri: '',
    auth_provider_x509_cert_url: '',
    client_x509_cert_url: '',
    /*eslint-enable */
  },
})
