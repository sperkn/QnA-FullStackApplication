// document.getElementById("answer-form").onsubmit = function() {
//   event.preventDefault();
//   console.log('form submit');
// };

const domainUrl = document.getElementById('domainName').innerText;
const answerAPI = axios.create({
  baseURL = domainURL + 'answer'
})

function sendAnswer(){
  answerApi.post({
    speakToRoute: document.getElementById(`speaktoJS`).value
  })
  .then(response => {
      // console.log(response)
      window.location.reload();
  })
  .catch(err =>{
    console.log(err);
    next(err);
    return;
  })
}