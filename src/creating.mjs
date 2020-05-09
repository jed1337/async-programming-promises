import setText, {appendText} from "./results.mjs";

//We can control when promises are resolved or rejected

export function timeout() {
    const executorFunction = (resolve) => {
        setTimeout(() => {
            resolve("Timeout")
        }, 1500)
    }
    const wait = new Promise(executorFunction)

    wait.then(text => setText(text))
}

export function interval() {
    let counter = 0
    const executorFunction = (resolve) => {
        setInterval(() => {
            //Once a promise has been resolved, it's done so we get `Timeout 1`
            //But its function can still keep executing: we will keep console logging "Interval"
            console.log("Interval")

            resolve(`Timeout ${++counter}`)
        }, 1500)
    }
    const wait = new Promise(executorFunction)

    wait
        .then(text => setText(text))

        //The appended message `Done 1` won't get updated even though the interval time period keeps occurring
        .finally(() => appendText(`==Done ${counter}\n`))
}

export function clearIntervalChain() {
    let counter = 0
    let interval
    const executorFunction = (resolve) => {
        interval = setInterval(() => {
            //Stops getting executed once the interval has been cleared
            console.log("Interval")

            resolve(`Timeout ${++counter}`)
        }, 1500)
    }
    const wait = new Promise(executorFunction)

    wait
        .then(text => setText(text))

        //We clear the interval once the promise has finished running
        //We use .finally() to clean up after a promise
        .finally(() => clearInterval(interval))
}

export function xhr() {
    //We have multiple reject statements inside since there were multiple reasons why the call could fail
    //We can also have multiple resolve calls if they're in different paths
    let request = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()

        //Returns 404
        xhr.open("GET", "http://localhost:3000/users/7")

        //xhr has .onload() for successful calls
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseText)
            } else {
                reject(`${xhr.status} ${xhr.statusText}`)
            }
        }

        //xhr only calls .onerror() for network errors, and the request failed to be completed
        //All other calls end up at the .onload(). We also call .onload() on 404
        xhr.onerror = () => reject("Request failed")

        xhr.send()
    })

    request
        .then(result => setText(result))
        .catch(reason => setText(reason))
}

export function allPromisesSuccessful() {
    // Queue up several promises at once
    // Only continue once they're complete

    const categories = axios.get("http://localhost:3000/itemCategories")
    const statuses = axios.get("http://localhost:3000/orderStatuses")
    const userTypes = axios.get("http://localhost:3000/userTypes")

    Promise.all([categories, statuses, userTypes])
        //Gives an array of results in the same order in the [parameter] in Promises.all()
        //The result isn't in the order in which each promise was resolved
        .then(([cat, stat, type]) => {
            setText("")

            //These are axios objects coming back so we need to use .data to access their data
            appendText(JSON.stringify(cat.data))
            appendText(JSON.stringify(stat.data))
            appendText(JSON.stringify(type.data))
        })
}

export function onePromiseFails(){
    const categories = axios.get("http://localhost:3000/itemCategories")
    const statuses = axios.get("http://localhost:3000/orderStatuses")
    const userTypes = axios.get("http://localhost:3000/userTypes")
    const addressTypes = axios.get("http://localhost:3000/addressTypes")

    //Promise.all() will wait until all promises are fulfilled or one is rejected
    //Once a promise fails, the remaining promises will stop getting executed
    Promise.all([categories, statuses, userTypes, addressTypes])
        .then(([cat, stat, type, address]) => {
            setText("")

            appendText(JSON.stringify(cat.data))
            appendText(JSON.stringify(stat.data))
            appendText(JSON.stringify(type.data))
            appendText(JSON.stringify(address.data))
        })
        .catch(reasons=>{
            console.log(reasons)
            setText(reasons)
        })
}

export function allSettled() {
}

export function race() {
}