const table = document.querySelector('#transactionTable');
const wallet = document.querySelector('#wallet');
let approvalCounter = 0;
let completeCounter = 0;
let cancelledCounter = 0;
let pendingCounter = 0;
let amtInvested = 0;
const start = async () => {
    try {

        const token = sessionStorage.getItem('token');
        const {data} = await axios.get('/transaction/getAll', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        })
        const transactions = data.transactions;
        
        const newBusinesses = new Map();
        let uniqueBusinesses = 0;
        transactions.forEach(function(transaction) {
            let row = document.createElement('tr');
            let businessNamer = document.createElement('td')
            businessNamer.innerHTML = transaction.businessUserName;

            
            if (!newBusinesses[transaction.businessUserName]) {
                uniqueBusinesses += 1
                newBusinesses[transaction.businessUserName] = 1
            }



            let startDate = document.createElement('td')
            startDate.innerHTML = transaction.initialDate.substring(0, 10);
            startDate.classList.add("d-none")
            startDate.classList.add('d-xl-table-cell');
            
            let expiryDate = document.createElement('td')
            expiryDate.innerHTML = transaction.expiryDate.substring(0, 10);
            expiryDate.classList.add('d-none')
            expiryDate.classList.add('d-xl-table-cell')

            let status = document.createElement('td');

            let span = document.createElement('span')
            
            if (transaction.status == 'AWAITING_APPROVAL') {
                span.innerHTML = 'Awaiting Approval';
                approvalCounter++;
            }
            
            else if (transaction.status == 'COMPLETE') {
                span.innerHTML = 'Complete'
                completeCounter++;
            }
            else if (transaction.status == 'CANCELLED') {
                span.innerHTML = 'Cancelled'
                cancelledCounter++;
            }
            else if (transaction.status == 'PENDING') {
                span.innerHTML = 'Pending';
                pendingCounter++;
            }
            

            
            span.classList.add('badge')
            if (transaction.status == 'COMPLETE') {span.classList.add('bg-success')}
            else if (transaction.status == 'CANCELLED') {span.classList.add('bg-danger')}
            else if (transaction.status == 'PENDING') {span.classList.add('bg-warning')}
            else if (transaction.status == 'AWAITING_APPROVAL') {span.classList.add('bg-secondary')}
            status.appendChild(span);
            let amount = document.createElement('td');
            if (transaction.status != 'CANCELLED') {
                amtInvested += transaction.amount;

            }
            
            let dollarUSLocale1 = Intl.NumberFormat('en-US');
            amount.innerHTML = `$${dollarUSLocale1.format(transaction.amount)}`;
            amount.classList.add('d-none')
            amount.classList.add('d-md-table-cell');

            let details = document.createElement('td')
            if (transaction.status == 'CANCELLED' || transaction.status == 'COMPLETE') {
                details.innerHTML = `<a href="transaction?id=${transaction._id}`+`" class="more">View Details</a>`;
            } else if (transaction.status == 'AWAITING_APPROVAL') {
                details.innerHTML = `<a href="approve-transaction?id=${transaction._id}`+`" class="more">View Details</a>`;
            } else {
                details.innerHTML = `<a href="creator-invoice?id=${transaction._id}`+`" class="more">View Details</a>`;
            }
            
            // details.innerHTML = `<a href="/transaction-details.html?id=`+transaction._id+`" class="more">View Details</a>`;
            //details.classList.add('more');
            details.href = "index.html"
            row.appendChild(businessNamer);
            row.appendChild(startDate);
            row.appendChild(expiryDate);
            row.appendChild(status);
            row.appendChild(amount);
            row.appendChild(details);


            table.appendChild(row);
            

        });
        const creatorData = await axios.get('/creator/getInfo', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            }
        })

        let dollarUSLocale = Intl.NumberFormat('en-US');
        wallet.innerHTML = "$"+ dollarUSLocale.format(creatorData.data.wallet);

        let displayName = creatorData.data.userName.charAt(0).toUpperCase() + creatorData.data.userName.substring(1)
        //+ creatorData.data.userNameame.substring(1)

        document.querySelector('#creatorWelcome').innerHTML = displayName + "'s Creator Dashboard";
        // invested.innerHTML = "$"+ dollarUSLocale.format(amtInvested);
        document.querySelector('#cancelledTotal').innerHTML = cancelledCounter
        document.querySelector('#awTotal').innerHTML = approvalCounter
        document.querySelector('#completeTotal').innerHTML = completeCounter
        document.querySelector('#pendingTotal').innerHTML = pendingCounter
        
        
        document.querySelector('#totalTransactions').innerHTML = cancelledCounter + approvalCounter + completeCounter + pendingCounter
        document.querySelector('#uniqueCreators').innerHTML = uniqueBusinesses

        let arr = []
        arr[0] = completeCounter
        arr[1] = pendingCounter
        arr[2] = approvalCounter
        arr[3] = cancelledCounter
        // Pie chart
        new Chart(document.getElementById("chartjs-dashboard-pie"), {
            type: "pie",
            data: {
                labels: ["Complete",  "Pending", "Awaiting Approval", "Cancelled"],
                datasets: [{
                    data: arr,
                    backgroundColor: [
                        window.theme.success,
                        window.theme.warning,
                        window.theme.gray,
                        window.theme.danger
                    ],
                    borderWidth: 5
                }]
            },
            options: {
                responsive: !window.MSInputMethodContext,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                cutoutPercentage: 75
            }
        });

    
    } catch (e) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 800,
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
        window.location.replace("/login");
    }
}



start();

