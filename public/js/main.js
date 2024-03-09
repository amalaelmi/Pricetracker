
document.getElementById('itemForm').addEventListener('submit', e => {
    e.preventDefault()

    submitItem()
})

async function submitItem() {
    const itemName = document.getElementById('itemName').value
    const itemPrice = document.getElementById('itemPrice').value

    const data = {
        itemName,
        itemPrice
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    const response = await fetch('/submit-product', options)
    const outcome = await response.json()

    if (response.status === 200) {
        console.log('Item submited')
        getProducts()
    }
    else {
        console.log('Item not submitted')
    }
}


async function getProducts() {
    const response = await fetch('/get-products')
    const data = await response.json()
    console.log(data)
    makeGraph(data)
    drawList(data)
}

getProducts()


function populateList(products) {
    const itemList = document.getElementById('itemList')
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        itemList.innerHTML = "";
        const li = document.createElement("li");
        li.innerHTML = `${product.itemName} - KES ${product.itemPrice} (${item.timestamp.toDateString()}) <button onclick="deleteItem(${index})">Delete</button>`;
        itemList.appendChild(li);

    }
}

function makeGraph(products) {
    const labels = products.map(product => product.itemName)

    const prices = []

    const dataSet = []
    dataSet.push

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const price = []

        Object.entries(product.itemPrice).forEach(
            ([key, value]) => price.push(value)
        )

        dataSet.push({
            label: product.itemName,
            data: price,
            borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
            backgroundColor: 'transparent',
        })
    }

    const data = {
        datasets: dataSet
    }

    const config = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          stacked: false,
          plugins: {
            title: {
              display: true,
              text: 'Chart.js Line Chart - Multi Axis'
            }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
      
              // grid line settings
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
            },
          }
        },
      };
    new Chart("chart", config)
}


  
  function drawList(data) {
    // Clear the 'item-details' div to ensure no previous content is displayed
    document.getElementById("item-details").innerHTML = "";
  
    // Create the main unordered list
    const itemList = document.createElement("ul");
    itemList.classList.add("price-list");
  
    // Loop through each item in the 'data' array and add a list item to the main unordered list
    data.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item.itemName;
  
      const priceList = document.createElement("ul");
  
      for (const [key, value] of Object.entries(item.itemPrice)) {
        const priceItem = document.createElement("li");
        priceItem.textContent = `${value}`;
        priceItem.setAttribute('key',key)
        priceList.appendChild(priceItem);

        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete this item'
        deleteButton.addEventListener('click',e =>{
            deleteItem(item.itemName,key)
        })


        const updateButton = document.createElement('button')
        updateButton.textContent = "Update this item's price"
        updateButton.addEventListener('click',e =>{
            setModalUpdate(item.itemName,key)
            $('#updatePriceModal').modal('toggle')
            document.getElementById('itemSelected').innerText = item.itemName
            document.getElementById('new_price').value = value
            document.getElementById('new_price').setAttribute('key',key)
        })



        priceItem.appendChild(deleteButton) 
        priceItem.appendChild(updateButton)


    
        
      }
  
      // Append the nested unordered list to the list item
      listItem.appendChild(priceList);
  
      // Append the list item to the main unordered list
      itemList.appendChild(listItem);
    });
  
    // Append the main unordered list to the 'item-details' div
    document.getElementById("item-details").appendChild(itemList);
  }
  
  
async function deleteItem(itemName,itemPrice){
    console.log(itemName)
    console.log(itemPrice)

    const response = await fetch(`/delete-item/${itemName}/${itemPrice}`, {method: 'DELETE'})
    const data = await response.json()

    if(response.status === 200){
        getProducts()
    }
}

async function setModalUpdate(itemName,itemPrice,key){
    console.log(itemName)
    console.log(itemPrice)
    console.log(key)

    document.getElementById('updatingPriceForm').addEventListener('submit',e=>{
        e.preventDefault()

         updateItem()
    })

}


async function updateItem(){
    const itemName = document.getElementById('itemSelected').innerText
    const itemPrice = document.getElementById('new_price').value
    const itemKey = document.getElementById('new_price').getAttribute('key')

    console.log(itemName)
    console.log(itemPrice)
    console.log(itemKey)

    const response = await fetch(`/update-price/${itemName}/${itemPrice}/${itemKey}`, {method:'PUT'})
    const data =await response.json()

    
    if(response.status === 200){
        getProducts()
        $('#updatePriceModal').modal('toggle')

    }
}