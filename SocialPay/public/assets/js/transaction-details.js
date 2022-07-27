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
    const urlParams2 = new URLSearchParams(window.location.search);
    const tid2 = urlParams2.get('id');
    console.log(`/transaction/get/?id=${tid2}`);
    const {data} = await axios.get(`/transaction/get/${tid2}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            }
        })
    
    let dollarUSLocale = Intl.NumberFormat('en-US');
    console.log(data.transaction.creatorUserName)
    console.log(data)
    document.getElementById("tid").innerHTML = "Trasaction ID: " + data.transaction._id;
    document.getElementById("businessName").innerHTML = "Business Name: " + data.transaction.businessUserName;
    document.getElementById("description").innerHTML = ""+data.transaction.businessDescription;
    document.getElementById("validuntil").innerHTML = `This contract is valid until ` + data.transaction.expiryDate.substring(0, 10) +  ` for the amount of $` + dollarUSLocale.format(data.transaction.amount);
    document.getElementById("date").innerHTML = "Transaction Date: " + data.transaction.initialDate.substring(0, 10);
    document.getElementById("creatorName").innerHTML = "Creator Name: " + data.transaction.creatorUserName;
    
    if (data.transaction.status == 'COMPLETE') {document.getElementById("status").innerHTML = "The status is currently " + "Complete";}
    else if (data.transaction.status == 'CANCELLED') {document.getElementById("status").innerHTML = "The status is currently " + "Cancelled";}
    else if (data.transaction.status == 'PENDING') {document.getElementById("status").innerHTML = "The status is currently " + "Pending";}
    else if (data.transaction.status == 'AWAITING_APPROVAL') {document.getElementById("status").innerHTML = "The status is currently " + "Awaiting Approval";}

    document.querySelector('#pickDashboard').setAttribute("href", `/${data.type}`);
    
    if (data.transaction.status == 'COMPLETE') {
      document.getElementById("linkProof").innerHTML = "Link Proof: " + data.transaction.urlProof;
      document.getElementById("approvedDate").innerHTML = "Completed Date: " + data.transaction.approvedDate.substring(0,10);
      document.getElementById("creatorDescription").innerHTML = "Creator Description: " + data.transaction.creatorDescription;
    }
    
    if (data.transaction.status == 'CANCELLED') {
        document.getElementById('createDispute').disabled = true
    }

    const dispute = document.getElementById('createDispute').addEventListener('click', async (e) => {
      e.preventDefault();
      html2pdf().from(document.querySelector('#disputePDF')).set({
        margin: [10, 10, 10, 10], 
        filename: data.transaction.businessUserName+":"+data.transaction._id,
      }).save();
      console.log('here');
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