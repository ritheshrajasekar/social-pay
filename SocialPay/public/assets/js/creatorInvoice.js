const start = async () => {

document.querySelector('.logoutBtn').addEventListener('click', (e) => {
    sessionStorage.removeItem('token');
})
try {
   
    const urlParams2 = new URLSearchParams(window.location.search);
    const tid2 = urlParams2.get('id');
    const {data} = await axios.get(`/transaction/get/${tid2}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            }
        })
    let dollarUSLocale = Intl.NumberFormat('en-US');
    document.getElementById("tid").innerHTML = "Trasaction ID: " + data.transaction._id;
    document.getElementById("businessName").innerHTML = "Business Name: " + data.transaction.businessUserName;
    document.getElementById("description").innerHTML = ""+data.transaction.businessDescription;
    document.getElementById("validuntil").innerHTML = `This contract is valid until ` + data.transaction.expiryDate.substring(0, 10) +  ` for the amount of $` + dollarUSLocale.format(data.transaction.amount);
    document.getElementById("date").innerHTML = "Transaction Date: " + data.transaction.initialDate.substring(0, 10);


    
    document.getElementById('categoryDetail').innerHTML = ("Category: " + data.transaction.category.charAt(0) + data.transaction.category.substring(1).toLowerCase())
    document.getElementById('platformDetail').innerHTML = "Platform: " + data.transaction.platform.charAt(0) + data.transaction.platform.substring(1).toLowerCase()

    document.getElementById('complete').addEventListener('click', async (e) => {
        e.preventDefault();

        //error checking


        const descrip = document.querySelector('#creatorDescription').value
        const creatorLink = document.querySelector('#creatorLink').value
        const creatorCheck = document.querySelector('#creatorCheck').checked

        if (descrip == '' || creatorLink == '') {
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
                title: 'Invalid Inputs'
                })
            return;
        } else if (!creatorCheck) {
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
                title: 'Must Check Affirm'
                })
            return;
        }

        const randomEngagement = (Math.random() * 12) + 4
        const {data1} = await axios.patch(`/transaction/update/${data.transaction._id}`, {status: 'COMPLETE', urlProof: creatorLink, creatorDescription: descrip, engagementRate: randomEngagement}, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        })

        let calculatedDate = Date.now();
        const data2 = await axios.patch(`/transaction/update/${data.transaction._id}`, {approvedDate: calculatedDate}, {
          headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
            title: 'Transaction Updated'
            })
        window.location.replace("/creator");

    })
    
} catch (err) {
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
      title: 'Please Login'
    })
}

}


start()