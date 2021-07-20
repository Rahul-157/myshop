require('dotenv').config();
const logger = sails.log
module.exports = {

  randomString: function (len) {
    var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return [...Array(len)].reduce(a => a + p[~~(Math.random() * p.length)], '');
  },

  randomNumber: function (len) {
    var p = "0123456789";
    return [...Array(len)].reduce(a => a + p[~~(Math.random() * p.length)], '');
  },

  

  uploadPicture: async function (picture, path,done) {
    
    let allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    let imageType = typeof picture._files[0]!='undefined'?picture._files[0].stream.headers[
      'content-type'
    ]:"unknown";
    var return_value;
    if(allowedTypes.indexOf(imageType)==-1){
      picture.upload({maxBytes: 100},function whenDone(err,files){
        return 
      })
      return done("Invalid Image Type",null)
    }
    logger.log("Incomming file Upload request");
    await picture.upload({
      dirname: '../../assets/'+path,
      maxBytes: 1000000000
    }, function whenDone(err, uploadedFiles) {
      if (uploadedFiles) {
        logger.log(uploadedFiles)
        return done(null, uploadedFiles);
      } else {
        if(typeof picture._files[0]=='undefined')
        return done("code:1",null);
        return done(err, null);
      }
    });

  },

  isJson: function (str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  },

 generateTags : function(str){
   return str.split(" ").join(" ").toUpperCase() + str.split(" ").join(" ").toLowerCase()
 },
 generateId : function(str){
  return str.split(" ").join("-").toLowerCase()
}

}