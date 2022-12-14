const creatorNameError = document.querySelector('#creatorNameNewTransactionError');
const amountError = document.querySelector('#amountNewTransactionError');
const dateError = document.querySelector('#dateNewTransactionError');
const descriptionError = document.querySelector('#descriptionNewTransactionError');

document.querySelector('.logoutBtn').addEventListener('click', (e) => {
    sessionStorage.removeItem('token');
})

document.querySelector('.validate-form').addEventListener('submit', async (e) => {
    const creatorName = document.querySelector('#creatorNameNewTransaction').value.trim();
    const amount = document.querySelector('#amountNewTransaction').value;
    const date = document.querySelector('#dateNewTransaction').value;
    const description = document.querySelector('#descriptionNewTransaction').value;
    e.preventDefault();
    creatorNameError.classList.remove('alert-validate');
    amountError.classList.remove('alert-validate');
    dateError.classList.remove('alert-validate');
    descriptionError.classList.remove('alert-validate');
    
    let valid = true;

    if (creatorName == '') {
        creatorNameError.setAttribute('data-validate', "Creator name is required");
        creatorNameError.classList.add('alert-validate');
        valid = false;
    }

    if (amount == '' || isNaN(amount)) {
        amountError.setAttribute('data-validate', "Amount required");
        amountError.classList.add('alert-validate');
        valid = false;
    }
    
    if (date == '') {
        dateError.classList.add('alert-validate');
        valid = false;
    }

    if (description == '') {
        descriptionError.classList.add('alert-validate');
        valid = false;
    }

    try {
        if (valid == false) {
            return;
        }

        const businessData = await axios.get('/business/getInfo', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            }
        })
        if (Number(businessData.data.wallet) - Number(amount) < 0) {
            amountError.setAttribute('data-validate', "Required amount not in wallet");
            amountError.classList.add('alert-validate');
            return;
        }
        const category = document.querySelector('#categorySelect').value
        const platform = document.querySelector('#platformSelect').value
        if (category == 'DEFAULT' || platform == 'DEFAULT') {
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
                title: 'invalid input'
              })
              return;
        }
        
        const token = sessionStorage.getItem('token');
        const {data} = await axios.post('/transaction/create', {creatorUserName: creatorName, businessDescription: description, amount: amount, expiryDate: date, category: category, platform: platform}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
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
            icon: 'success',
            title: 'Created Transaction'
          })
          window.location.replace("/business");
        

    } catch (error) {
        creatorNameError.setAttribute('data-validate', "Creator does not exist");
        creatorNameError.classList.add('alert-validate');
    }
})
