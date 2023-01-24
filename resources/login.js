var Jibo = require('../srv-jibo-server-client/');

var newAccountDetails;
var oobe_token;

function login(){
    var username = document.getElementById("jibo-username").value;
    var password = document.getElementById("jibo-password").value;
    
    var newAccountPayload = {
      email: username,
      password: password
    };

    Jibo.config.update({
        region: document.getElementById("region").value
      });
    
    accountClient = new Jibo.Account();

    accountClient.login(newAccountPayload, function(err, result) {
        if(err){
            console.log(err.message);
            if(err.message.indexOf("password") > -1 || err.message.indexOf("found") > -1){
              $('#modal-error-message').html('Wrong username or password.');
            }else if(err.message.indexOf("email") > -1){
              $('#modal-error-message').html('Email cannot be empty.');
            }
            else{
              $('#modal-error-message').html('Something went wrong.\nPlease try again.');
            }
            $('#errorModal').modal('toggle');
        }else{
            console.log(result);
            newAccountDetails = result;
            accessKeyId = newAccountDetails["accessKeyId"];
            secretAccessKey = newAccountDetails["secretAccessKey"]
            if(newAccountDetails.isActive){
              console.log("Active account, generating oobe token");
              document.getElementById('account').style.display='none';
              $('#account').hide();
              $('#oobe_selection').show();
              oobe();
            }else{
              $('#modal-info-message').html('Please activate your account before loging in.');
              $('#messageModal').modal('toggle');
           }
        }
      });
}

function oobe(){
    Jibo.config.update({
        region: document.getElementById("region").value
      });

    oobeClient = new Jibo.OOBE(newAccountDetails);

    return oobeClient.prepareRobot().promise().then(result => {
      oobe_token = result.token;
      document.getElementById("oobe_token").innerHTML = oobe_token;
    });
}

function signin(){
  var username = document.getElementById("jibo-new-username").value;
  var password = document.getElementById("jibo-new-password").value;

  var newAccountPayload = {
    email: username,
    password: password
  };

  Jibo.config.update({
      region: document.getElementById("account_creation_region").value
    });

  accountClient = new Jibo.Account();
  accountClient.create(newAccountPayload, function(err, account) {
    if(err){
      console.log(err.message);
      if(err.message.indexOf("valid") > -1 || err.message.indexOf("contain") > -1){
        $('#modal-error-message').html('Password must contain at least one lowercase, one uppercase and one number.');
      }else if(err.message.indexOf("length") > -1){
        $('#modal-error-message').html('Password must be at least 8 characters in length.');
      }else if(err.message.indexOf('exists') > -1){
        $('#modal-error-message').html('An account already exists with that email.');
      }else{
        $('#modal-error-message').html('Something went wrong.\nPlease try again.');
      }
      $('#accountCreationModal').modal('toggle');
      $('#errorModal').modal('toggle');
    }else{
      newAccountDetails = account;
      $('#modal-info-message').html('Your account was succesfuly created.\nPlease check your email for activating it.');
      $('#accountCreationModal').modal('toggle');
      $('#messageModal').modal('toggle');
    }
  });

}

window.login =function(){
    login();
};

window.signin =function(){
    signin();
}

window.oobe =function(){
  oobe();
}
