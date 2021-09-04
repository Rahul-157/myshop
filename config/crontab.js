module.exports.crontab = {
  
  /*
  * The asterisks in the key are equivalent to the
  * schedule setting in crontab, i.e.
  * minute hour day month day-of-week year
  * so in the example below it will run every minute
  */
  
  crons: function()
  {
    var jsonArray = [];
    jsonArray.push({interval:'15 00 */1 * *',method:'any_function'});
    return jsonArray;
    
  },
  

  any_function: function(){
    // code for any future cron job
  } 
};