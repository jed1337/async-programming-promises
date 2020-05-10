import setText, {appendText} from './results.mjs';

//We need to put 'async' in the function name so that we can use 'await'
export async function get() {
    //We can use await on functions that return promises
    const {data} = await axios.get("http://localhost:3000/orders/1")
    setText(JSON.stringify(data))
}

export async function getCatch() {
    //Since our error handling is the standard try-catch block,
    //We can have the same error handling for our synchronous and asynchronous code
    try {
        const {data} = await axios.get("http://localhost:3000/orders/123")
        setText(JSON.stringify(data))
    } catch (error) {
        setText(error)
    }
}

export async function chain() {
    //await stops code execution on this block until it gets the data
    //Subsequent await calls do the same
    const {data} = await axios.get("http://localhost:3000/orders/1")

    //axios.get() returns {data:{}, status:200, statusText:'OK', headers:{}, config:{}, ...}
    //We already have a variable named 'data'
    //{data:address} assigns the value of data to the address variable
    const {data: address} = await axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`)

    setText(`City: ${JSON.stringify(address.city)}`)
}

export async function concurrent() {
    //We didn't use await with axios so orderStatus is a promise
    const orderStatus = axios.get("http://localhost:3000/orderStatuses")
    const orders = axios.get("http://localhost:3000/orders")

    //By not using await with axios, both API calls occurred concurrently
    //Promises are eager, so both API calls started processing even without calling .then()

    setText("")

    //Then we wait for the API call to complete here
    const {data: statuses} = await orderStatus
    const {data: order} = await orders

    appendText(JSON.stringify(statuses))
    appendText(JSON.stringify(order[0]))
}

export async function parallel() {
    setText("")

    //async await is syntactic sugar on top of promises, so we can mix and match all
    //async functions return an implicit promise
    await Promise.all([
        // (async()=>{})() anonymous async function
        (async()=>{
            const{data} = await axios.get("http://localhost:3000/orderStatuses")
            appendText(JSON.stringify(data))
        })(),
        (async()=>{
            const{data} = await axios.get("http://localhost:3000/orders")
            appendText(JSON.stringify(data))
        })()
    ])
}