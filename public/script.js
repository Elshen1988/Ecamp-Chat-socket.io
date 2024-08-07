const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
let ul=document.querySelector('ul')
const messages = document.getElementById('messages');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
    location.reload();
  }
});
ul.addEventListener('click',(e)=>{
    socket.emit('deleteData', e.target.id, response => {
      if (response.success) {
        location.reload();
      } else {
        alert('Silinmə xətası: ' + response.message);
      }
    });
    
  })

socket.on('chat message', function(msg,id) {
  
  const item = document.createElement('li');
  let span=document.createElement('span');
  span.setAttribute('id',`${id}`);
  span.textContent='x'
  item.textContent = msg;
  item.append(span)
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
