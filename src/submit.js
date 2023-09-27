var signup = function () {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var whatsapp = document.getElementById("whatsapp").value;
    var expectations = document.getElementById("expectations").value;
    var discovery = document.getElementById("discovery").value;
    var availability = document.querySelector('input[name="availability"]:checked').value;
    var formData = {
        name: name,
        email: email,
        whatsapp: whatsapp,
        expectations: expectations,
        discovery: discovery,
        availability: availability,
    };
    fetch("http://localhost:3333/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then(function (response) {
        if (response.ok) {
            document.getElementById("registration-form").reset();
            alert("Inscrição enviada com sucesso!");
        }
        else {
            console.error("Erro ao enviar a inscrição");
        }
    })
        .catch(function (error) {
        console.error("Erro de rede ao enviar a inscrição", error);
    });
};
var signupButton = document.getElementById('signup');
signupButton.addEventListener('click', function (event) {
    console.log('teste');
    event.preventDefault();
    signup();
});
