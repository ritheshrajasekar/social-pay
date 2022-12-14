

const toggleLabel = document.querySelector('#flexSwitchLabel');
const toggleType = document.querySelector('#flexSwitchCheckDefault');
toggleType.addEventListener('click', function(event) {

    if (toggleType.value == "on") {
        toggleLabel.innerText = "Business Account";
        toggleType.setAttribute('value', "off");
        
    } else {
        toggleLabel.innerText = "Creator Account";
        toggleType.setAttribute('value', "on");
    }
});

/*==================================================================
[ Validate ]*/
var form = document.querySelector('.validate-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = document.querySelector('#createUsername').value.trim();
    const password = document.querySelector('#createPassword').value;
    document.querySelector('#createUsernameError').classList.remove('alert-validate');
    document.querySelector('#createPasswordError').classList.remove('alert-validate');
    if (username == ''){
        document.querySelector('#createUsernameError').setAttribute('data-validate', "Username is required");
        document.querySelector('#createUsernameError').classList.add('alert-validate');
    } 
    if (password == '') {
        document.querySelector('#createPasswordError').classList.add('alert-validate');
    }
    if (password != '' && username != '') {
        const typeVal = toggleType.value;
        try {
            if (typeVal == 'on') {
                const { data } = await axios.post('/creator/create', { userName: username, password: password})
            } else {
                const { data } = await axios.post('/business/create', { userName: username, password: password})
            }
            window.location.replace("/login");
        } catch(error) {
            const usernameError = document.querySelector('#createUsernameError')
            usernameError.setAttribute('data-validate', "username already exists");
            usernameError.classList.add('alert-validate');
        }
    }

})

