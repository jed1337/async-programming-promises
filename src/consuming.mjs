import setText, {appendText, showWaiting, hideWaiting} from './results.mjs';

//3 Promise states: pending, fulfilled, rejected

export function get(){
    axios.get("http://localhost:3000/orders/1")
        .then(({data})=>{ //After the promise completes, handle this code next
            setText(JSON.stringify(data))
        })
}

export function getCatch(){
    axios.get("http://localhost:3000/orders/123")
        .then(({data})=> {
            setText(JSON.stringify(data))
        })
        .catch(err=>setText(err))
}
export function chain() {
    axios.get("http://localhost:3000/orders/1")
        .then(({data})=>{
            //What ever gets returned gets wrapped in a promise that can be used by subsequent .then() methods
            //If we don't put return, JS returns undefined. Undefined will then get wrapped in a promise and that's what's used by the next .then() method
            return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
        })
        .then(({data})=>{
            //The data comes from /addresses/...
            setText(`City: ${data.city}`)
        })
}
export function chainCatch() {
    //We can just use 1 catch statement at the end
    axios.get("http://localhost:3000/orders/1")
        .then(({data})=>{
            axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);

            throw new Error("Error")
        })
        .catch(err=>{
            setText(err)

            //Catch statements can also return data or throw errors
            //This catch block handles the cases for all the previous then statements
            throw new Error("")
        })
        .then(({data})=>{
            setText(`City: ${data.my.city}`)
        })
        .catch(err=>{
            setText("Second error")
        }) //Will catch all errors after the first .catch()

}
export function final(){
    showWaiting()

    axios.get("http://localhost:3000/orders/1")
        .then(({data})=>{
            return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
        })
        .then(({data})=>{
            setText(`City: ${data.city}`)
        })
        .catch(err=>{
            setText(err)
        })
        .finally(()=>{
            //Waits for all code to be done before running
            //A better approach compared to putting hideWaiting in both the last .then() and .catch()

            setTimeout(()=>{
                hideWaiting()
            }, 1500)

            appendText("==Completely done==")
        })
}