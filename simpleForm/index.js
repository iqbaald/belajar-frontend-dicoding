document.addEventListener('DOMContentLoaded', function () {
  const inputMaxLengthOnLoad = document.getElementById('inputNama').maxLength;
  document.getElementById('sisaKarakter').innerText = inputMaxLengthOnLoad;
  
  document.getElementById('inputNama').addEventListener('input', function(){
  const jumlahKarakterDiketik = document.getElementById('inputNama').value.length;
  const jumlahKarakterMaksimal = document.getElementById('inputNama').maxLength;

  // console.log(jumlahKarakterDiketik)
  // console.log(jumlahKarakterMaksimal)

  const sisaKarakterUpdate = jumlahKarakterMaksimal - jumlahKarakterDiketik;
  document.getElementById('sisaKarakter').innerText = sisaKarakterUpdate.toString();

  if (sisaKarakterUpdate == 0){
  document.getElementById('sisaKarakter').innerText = 'Batas maksimal tercapai!';
  }else if (sisaKarakterUpdate <= 5){
    document.getElementById('notifikasiSisaKarakter').style.color = 'red';
  }else{
    document.getElementById('notifikasiSisaKarakter').style.color = 'black';
  }
})

document.getElementById('inputNama').addEventListener('focus', function() {
  // console.log('muncul')
  document.getElementById('notifikasiSisaKarakter').style.visibility = 'visible';
})

document.getElementById('inputNama').addEventListener('blur', function() {
  // console.log('hilang')
  document.getElementById('notifikasiSisaKarakter').style.visibility = 'hidden';
})


document.getElementById('inputCaptcha').addEventListener('change', function() {
  const inputChaptcha = document.getElementById('inputCaptcha').value;
  const submitButtonStatus = document.getElementById('submitButton');
  
  if (inputChaptcha == 'PRNU'){
    submitButtonStatus.removeAttribute('disabled')
  }else{
    submitButtonStatus.setAttribute('disabled','')
  }

})

document.getElementById('formDataDiri').addEventListener('submit', function(event){
  const inputChaptcha = document.getElementById('inputCaptcha').value;
  
  if (inputChaptcha == 'PRNU'){
    alert('Selamat! Data anda sudah berhasil terkirim')
  }else{
    alert('Chapcta yang anda masukkan salah!')
    submitButtonStatus.setAttribute('disabled','')
  }
  event.preventDefault();
})


document.getElementById('inputCopy').addEventListener('copy', function(){
  const copyan = document.getElementById('inputCopy').value
  alert('Anda telah mengcopy ' + copyan)
})

document.getElementById('inputPaste').addEventListener('paste', function(){
  const pastein = document.getElementById('inputPaste').value
  alert('Anda telah mengpaste sesuati');
})

});