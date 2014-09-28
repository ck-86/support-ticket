var MailListener = require("mail-listener2");
var request = require("request");

var options = {
  url : 'https://api.built.io/v1/classes/tickets/objects/',
  headers : {
    'application_api_key' : 'bltc3c58bccdff3fcc7',
    'application_uid' : 'support_ticket',
    'content-type' : 'application/json'
  }
};

var message = {};

var mailListener = new MailListener({
  username: "builtflow@gmail.com",
  password: "raw@1234",
  host: "imap.gmail.com",
  port: 993, // imap port
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
  mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
  attachments: true, // download attachments as they are encountered to the project directory
  attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
});

mailListener.start(); // start listening

// stop listening


mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err){
  console.log(err);
});

mailListener.on("mail", function(mail, seqno, attributes){
  // do something with mail object including attachments
  /*console.log("Received Mail From : ", mail.headers.from);
  console.log("Subject : ", mail.headers.subject);
  console.log(Object.keys(mail));*/

  message.sender_name = mail.from[0].name;
  message.sender_email = mail.from[0].address;
  message.subject = mail.subject;
  message.message = mail.html;

  request.post(options, 
    function(error, res, body){
      // console.log("Error : ", error);
      // console.log("Response : ", res);

      var ack = JSON.parse(body);
      console.log("Body : ", ack.object.uid);
  })
  .form({object:message});

  console.log( JSON.stringify(message) );
  console.log("-x-x-x-"); 
  // mail processing code goes here
});

//mailListener.stop();