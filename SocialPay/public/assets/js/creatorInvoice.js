const start = async () => {
    // if the page url has a query string
// if (window.location.search) {
//     // get all url search params from the query string
//     const urlParams = new URLSearchParams(window.location.search);
//     //console.log(urlParams.get('id'));
//     const tid = urlParams.get('id');
//     document.getElementById("schema").innerHTML = "Trasaction ID: " + tid;
//     console.log(tid);
// }
document.querySelector('.logoutBtn').addEventListener('click', (e) => {
    sessionStorage.removeItem('token');
})
try {
   
    // console.log(document.getElementsById('declineTransaction'))
    const urlParams2 = new URLSearchParams(window.location.search);
    const tid2 = urlParams2.get('id');
    console.log(`/transaction/get/?id=${tid2}`);
    console.log('hello world')
    const {data} = await axios.get(`/transaction/get/${tid2}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            }
        })
    console.log(data)
    let dollarUSLocale = Intl.NumberFormat('en-US');
    document.getElementById("tid").innerHTML = "Trasaction ID: " + data.transaction._id;
    document.getElementById("businessName").innerHTML = "Business Name: " + data.transaction.businessUserName;
    document.getElementById("description").innerHTML = ""+data.transaction.businessDescription;
    document.getElementById("validuntil").innerHTML = `This contract is valid until ` + data.transaction.expiryDate.substring(0, 10) +  ` for the amount of $` + dollarUSLocale.format(data.transaction.amount);
    document.getElementById("date").innerHTML = "Transaction Date: " + data.transaction.initialDate.substring(0, 10);
    
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

        const {data1} = await axios.patch(`/transaction/update/${data.transaction._id}`, {status: 'COMPLETE', urlProof: creatorLink, creatorDescription: descrip}, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        })

        //console.log("here")
        let calculatedDate = Date.now();
        const data2 = await axios.patch(`/transaction/update/${data.transaction._id}`, {approvedDate: calculatedDate}, {
          headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        })
        //console.log(data2);

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
    console.log(err)
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
  // window.location.replace("/login");
    //alert however you want if not authorized
    // console.log(e);
    // window.location.replace("/login");
    // alert('Must Login');
}

}


start()