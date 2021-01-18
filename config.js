const keys=require("./keys.json")
const port =4000;
credentials={
    client_id: keys.web.client_id,
    project_id: keys.web.project_id, // The name of your project
    auth_uri: keys.web.auth_uri,
    token_uri: keys.web.token_uri,
    auth_provider_x509_cert_url: keys.web.auth_provider_x509_cert_url,
    client_secret: keys.web.client_secret,
    redirect_uris: [keys.web.youtube_url],
    scopes: [keys.web.scope_]
}
module.exports={
    JWTsecret:"",
    port,
    credentials
};