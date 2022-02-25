const response=function(data){
  return {
    success:true,
    data:data
  }
}
const errorMsg=function(data){
  return {
    success:false,
    errorMsg:data
  }
}
module.exports = {
  response,
  errorMsg
};
