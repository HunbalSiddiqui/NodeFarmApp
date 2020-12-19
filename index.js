// const fs = require('fs')

// const textFl = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textFl)

////////////////////////////////////////// 
// First NODEJS PROJECT
const http = require('http')
const url = require('url')
const fs = require('fs')
// Top Level Sync Code Which is executed only once the code runs, so will not block the process.
const replaceTemplate = (temp,product) =>{
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName)
    output = output.replace(/{%IMAGE%}/g,product.image)
    output = output.replace(/{%PRICE%}/g,product.price)
    output = output.replace(/{%FROM%}/g,product.from)
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients)
    output = output.replace(/{%QUANTITY%}/g,product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g,product.description)
    output = output.replace(/{%ID%}/g,product.id)
    if(!product.organic)
    {
        output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic')
    }
    return output
}
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/overview-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)
// Server
const server = http.createServer((req, res) => {
    const {query , pathname} = url.parse(req.url,true)
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        const cardsHtml =  dataObj.map((product)=>replaceTemplate(tempCard,product)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
        res.end(output)
    } else if (pathname === "/product") {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct,product)
        res.end(output)
    } else if (pathname === "/api") {

        res.writeHead(200, {
            'Content-Type': 'application/json',
        })
        res.end(data)
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end(
            `<h1>Page Does Not Exist</h1>`
        )
    }
})

server.listen(process.env.PORT || 8000, () => {
    console.log("Server is listening")
})