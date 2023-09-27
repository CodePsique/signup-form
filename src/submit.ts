const signup = (): void => {
  const name = (<HTMLInputElement>document.getElementById("name")).value;
  const email = (<HTMLInputElement>document.getElementById("email")).value;
  const whatsapp = (<HTMLInputElement>document.getElementById("whatsapp")).value;
  const expectations = (<HTMLInputElement>document.getElementById("expectations")).value;
  const discovery = (<HTMLInputElement>document.getElementById("discovery")).value;
  const availability = (<HTMLInputElement>document.querySelector('input[name="availability"]:checked')).value;

  const formData = {
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
    .then((response) => {
      if (response.ok) {
        (<HTMLFormElement>document.getElementById("registration-form")).reset();
        alert("Inscrição enviada com sucesso!");
      } else {
        console.error("Erro ao enviar a inscrição");
      }
    })
    .catch((error) => {
      console.error("Erro de rede ao enviar a inscrição", error);
    });
}

const signupButton = (<HTMLButtonElement>document.getElementById('signup'));

signupButton.addEventListener('click', (event) => {
console.log('teste')
event.preventDefault();
signup();
});