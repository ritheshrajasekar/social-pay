

/*==================================================================
[ Validate ]*/
var form = document.querySelector('.validate-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = document.querySelector('#Username').value.trim();
    const password = document.querySelector('#Password').value;
    document.querySelector('#UsernameError').classList.remove('alert-validate');
    document.querySelector('#PasswordError').classList.remove('alert-validate');
    if (username == ''){
        document.querySelector('#UsernameError').classList.add('alert-validate');
    } 
    if (password == '') {
        document.querySelector('#PasswordError').classList.add('alert-validate');
    }
    if (password != '' && username != '') {
        try {
            const { data } = await axios.post('/login', { userName: username, password: password});
            sessionStorage.setItem('token', data.token)
            if (data.type == 'creator') {
                window.location.replace('/creator');
            } else {
                window.location.replace("/business");
            }
        } catch(error) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              
            await Toast.fire({
                icon: 'error',
                title: 'Invalid Username and Password'
              })
        }
    }

})

