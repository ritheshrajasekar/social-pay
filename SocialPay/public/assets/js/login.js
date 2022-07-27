

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
                console.log('go to creator page');
            } else {
                window.location.replace("/business");
                console.log('go to business page');
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

// if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
//     return false;
// }
