const table = document.querySelector('#transactionTable');
const wallet = document.querySelector('#wallet');
const invested = document.querySelector('#invested');
let approvalCounter = 0;
let completeCounter = 0;
let cancelledCounter = 0;
let pendingCounter = 0;
let amtInvested = 0;
// {approvalCounter, completeCounter, cancelledCounter, pendingCounter};
document.querySelector('.logoutBtn').addEventListener('click', (e) => {
    sessionStorage.removeItem('token');
})
const start = async () => {

    try {

        const token = sessionStorage.getItem('token');
        const {data} = await axios.get('/transaction/getAll', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        })
        const transactions = data.transactions;
        

        const newCreators = new Map();
        let uniqueCreators = 0;
        transactions.forEach(function(transaction) {
            let row = document.createElement('tr');
            let creatorNamer = document.createElement('td')
            creatorNamer.innerHTML = transaction.creatorUserName;

            if (!newCreators[transaction.creatorUserName]) {
                uniqueCreators += 1
                newCreators[transaction.creatorUserName] = 1
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
            

            
            //span.innerHTML = transaction.status
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
            //transaction/getDetails
            // details.innerHTML = `<a href="/transaction/getDetail?id=${transaction._id}`+`" class="more">View Details</a>`;
            details.innerHTML = `<a href="transaction?id=${transaction._id}`+`" class="more">View Details</a>`;
            // details.innerHTML = `<a href="/transaction-details.html?id=`+transaction._id+`" class="more">View Details</a>`;
            //details.classList.add('more');
            details.href = "index.html"
            row.appendChild(creatorNamer);
            row.appendChild(startDate);
            row.appendChild(expiryDate);
            row.appendChild(status);
            row.appendChild(amount);
            row.appendChild(details);


            table.appendChild(row);

        });
        const businessData = await axios.get('/business/getInfo', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            }
        })

        let dollarUSLocale = Intl.NumberFormat('en-US');
        wallet.innerHTML = "$"+ dollarUSLocale.format(businessData.data.wallet);
        invested.innerHTML = "$"+ dollarUSLocale.format(amtInvested);
        document.querySelector('#cancelledTotal').innerHTML = cancelledCounter
        document.querySelector('#awTotal').innerHTML = approvalCounter
        document.querySelector('#completeTotal').innerHTML = completeCounter
        document.querySelector('#pendingTotal').innerHTML = pendingCounter
        let displayName = businessData.data.userName.charAt(0).toUpperCase() + businessData.data.userName.substring(1)
        //+ creatorData.data.userNameame.substring(1)

        document.querySelector('#businessWelcome').innerHTML = displayName + "'s \n Business Dashboard";
        
        document.querySelector('#totalTransactions').innerHTML = cancelledCounter + approvalCounter + completeCounter + pendingCounter
        document.querySelector('#uniqueCreators').innerHTML = uniqueCreators

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

