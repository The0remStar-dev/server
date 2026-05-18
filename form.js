const name_div = document.getElementById("nameInput")
const text_name = document.getElementById("texte_name")
const identifie = document.getElementById("identifie")
const error = document.querySelector(".error-msg")
const radio = document.getElementById("radio_option")
const form = document.querySelector("#contactForm")
const message = document.getElementById("message")
const feedback = document.getElementById("feedback")
const anonyme = document.getElementById("anonymous")

identifie.addEventListener("click", function () {
    name_div.style.display = "inline-block"
}
)

anonyme.addEventListener("click", function () {

    name_div.style.display = "none"
    text_name.value = ""
})


async function postData(data) {
    const donnee = await fetch('/form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const json = await donnee.json();
    console.log(json);
    return json;
}


form.addEventListener("submit", async (e) => {

    e.preventDefault()
    const data = Object.fromEntries(new FormData(form))
    if ((data.mode == "anonyme_value" && data.message != "") || (data.mode == "identifie" && data.name != "" && data.message != "")) {
        console.log(data)
        const res = await postData({...data, date: new Date().toISOString()})
        if (res && res.status === 'success') {
            message.value = ""
            text_name.value = ""
            feedback.textContent = 'Message envoyé avec succès.'
            feedback.style.display = 'block'
            feedback.style.color = '#008279'
            error.style.display = "none"
        } else {
            error.style.display = "inline-block"
            error.textContent = "Erreur lors de l'envoi. Réessayez."
            feedback.style.display = 'none'
        }
    }
    else {
        error.style.display = "inline-block"
        error.textContent = "Veuillez renseignez tous les champs"
        feedback.style.display = 'none'

