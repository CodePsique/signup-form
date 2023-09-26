document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registration-form');
    
    const signup = function () {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const whatsapp = document.getElementById("whatsapp").value;
        const expectations = document.getElementById("expectations").value;
        const discovery = document.getElementById("discovery").value;
        const availability = document.querySelector('input[name="availability"]:checked').value;
        const formData = {
            name: name,
            email: email,
            whatsapp: whatsapp,
            expectations: expectations,
            discovery: discovery,
            availability: availability,
        };
        console.log(formData);
        fetch("http://localhost:3333/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Oring": "*",
            },
            body: JSON.stringify(formData),
        })
            .then(function (response) {
                console.log('sucesso');
                form.reset();
                alert("Inscrição enviada com sucesso!");
        })
            .catch(function (error) {
            console.error("Erro de rede ao enviar a inscrição", error);
        });
    };
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        signup();
    });
});
