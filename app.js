const express=require("express");
const ejs=require("ejs");
const google=require("googleapis");
const cookieParser=require("cookie-parser");
const config=require("./config.js");
const app=express();
const jwt=require("jsonwebtoken");
// const bodyParser=require("body-parser");

// view engine
app.set("view engine","ejs");
// middleware
app.use(express.static("public"));
app.use(cookieParser());
const Oauth2=google.google.auth.OAuth2;
const oauth2Client= new Oauth2(
    config.credentials.client_id,
    config.credentials.client_secret,
    config.credentials.redirect_uris[0]
)
const link = oauth2Client.generateAuthUrl({
    access_type: "offline", // Indicates that we need to be able to access data continously without the user constantly giving us consent
    scope: config.credentials.scopes // Using the access scopes from our config file
  });
app.get("/",(req,res)=>{
    res.render("login",{link:link});
});
app.get("/oauth2callback",(req,res)=>{
    if(req.query.error)
    {
        res.render("/");
    }
    else {
        oauth2Client.getToken(req.query.code,(err,token)=>{
            if(err)
            {
                res.redirect("/");
            }
            else{
                res.cookie("jwt", jwt.sign(token, config.JWTsecret));
                res.redirect("/data");
            }
            
        })
    }
    
});
app.get("/data",(req,res)=>{

    if(!req.cookies.jwt)
    {
      return  res.redirect("/");
    }
    oauth2Client.credentials = jwt.verify(req.cookies.jwt, config.JWTsecret);
        const service = google.google.youtube("v3");

  // Get five of the user's subscriptions (the channels they're subscribed to)
  service.subscriptions
    .list({
      auth: oauth2Client,
      mine: true,
      part: "snippet,contentDetails,subscriberSnippet",
      maxResults: 1000,
    //   mySubscribers:true
    })
    .then(response => {
      //console.log(response.data.items)
      console.log(response.data)
      //console.log(response.data.items[0].snippet.thumbnails.medium.url)
      // Render the data view, passing the subscriptions to it
      return res.render("data", { subscriptions: response.data.items ,pageInfo:response.data});
    }).catch(err=>{console.log(err);
    });
});
app.get("/details",(req,res)=>{
    const ID=req.query.buttonID;
    if(!req.cookies.jwt)
    {
        res.redirect("/");
    }
    oauth2Client.credentials = jwt.verify(req.cookies.jwt, config.JWTsecret);
        const service = google.google.youtube("v3");

  // Get five of the user's subscriptions (the channels they're subscribed to)
  service.subscriptions
    .list({
      auth: oauth2Client,
      mine: true,
    //   myRecentSubscribers:true,
      part: "snippet,contentDetails,subscriberSnippet",
      maxResults: 1000,
    //   mySubscribers:true
    })
    .then(response => {
    //   console.log(response.data.items[0].snippet)
    //   console.log(response.data.items[0].snippet.resourceId)
      //console.log(response.data.items[0].snippet.thumbnails.medium.url)
      // Render the data view, passing the subscriptions to it
      
      return res.render("detail",{result:response.data.items,ID:ID});
    });
    
})
app.listen(config.port,(err)=>{
    if(err)
    {
        console.log(err);
        
    }
    else{
        console.log(`connected to port ${config.port}`);
        
    }
})