const port = 3000
const express = require('express')
const app = express()
const fs = require('fs')
const uudi4 = require('uuid4')
const rawData = fs.readFileSync('products.json')
let data = JSON.parse(rawData)
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', 'views')
app.set('view engine', 'hbs')
app.use(express.static('public'))

app.get('/', (request, response) => {
    response.render('home')
})

app.get('/get-products', (request, response) => {
    response.send(data)
})

app.post('/submit-product', (request, response) => {
    console.log(request.body)
    const { itemName, itemPrice } = request.body

    //  Look inside the data if the item alread exists
    const found = data.filter(product => product.itemName.toLowerCase() === itemName.toLowerCase())
    console.log(found)

    // if the item already exists
    if (found.length > 0) {
        
    
        console.log(found[0].itemPrice)

        // append the price to the existing prices already
        found[0].itemPrice = {
            ...found[0].itemPrice,
            [uudi4()]: parseInt(itemPrice)
        }
    
       

        //update the product price with
        data.forEach(product => {
            if (product.itemName.toLowerCase() == itemName.toLowerCase()) {
                product = found[0]
            }
        });

        console.log(data)

        fs.writeFileSync('products.json', JSON.stringify(data, null, 2))
        return response.status(200).json({
            message: 'Prodct updated'
        })
    }
    else { 

    
        const obj = {
            itemName: itemName.toLowerCase(),
            itemPrice: {
                [uudi4()]: parseInt(itemPrice)
            }
        }

    
        data.push(obj)
        fs.writeFileSync('products.json', JSON.stringify(data, null, 2))
        return response.status(200).json({
            message: 'Prodct inserted'
        })
    }

})


app.delete('/delete-item/:itemName/:itemKey',(request,response)=>{
    const {itemName, itemKey} = request.params

    console.log(itemName)
    console.log(itemKey)
    const found = data.filter(product => product.itemName.toLowerCase() === itemName.toLowerCase())

    

    console.log(found[0])
    delete found[0].itemPrice[itemKey]

    console.log(found[0])

    data.forEach(product => {
        if(product.itemName === itemName)
        product = found[0]
    });

    console.log(data)
    
    fs.writeFileSync('products.json', JSON.stringify(data, null, 2))
    return response.status(200).json({
        message: 'Prodct delete'
    })

    
})

app.put('/update-price/:itemName/:itemPrice/:itemKey',(request,response)=>{
    const {itemName, itemPrice, itemKey} = request.params

    console.log(itemKey)
    console.log(itemPrice)
    console.log(itemName)

    
    const found = data.filter(product => product.itemName.toLowerCase() === itemName.toLowerCase())


    found[0].itemPrice[itemKey] = parseInt(itemPrice)
   

    data.forEach(product => {
        if(product.itemName === itemName)
        product = found[0]
    });

    console.log(data)
    
    fs.writeFileSync('products.json', JSON.stringify(data, null, 2))
    return response.status(200).json({
        message: 'Prodct delete'
    })


})



app.listen(port, () => { console.log(`Server is listening on port ${port}`) })
