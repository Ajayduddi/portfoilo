function sendEmail(){
    Email.send({
        SecureToken:"e58e09d5-7162-4b65-a3b9-ba573a07ad45",
        To : 'ajayprofessional119@gmail.com',
        From : document.getElementById("email").value,
        Subject : "new msg from web developer portfoilo",
        Body : "name: "+ document.getElementById("name").value
                + "<br> Email:" + document.getElementById("email").value
                +"<br> Phone No: " +document.getElementById("phoneno").value
                +"<br> msg: "+document.getElementById("msg").value
    }).then(
      message => alert(message)
    );
}