'use server'

const api_url = 'http://tbko.v360.mx/';

export async function SendStore(data) {
    const postRequest = await fetch(`${api_url}store/new`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    }).then(res=>{
        console.log({res});
        return res.json()
    });
    return postRequest;
}

export async function GetStores(id) {
    const getStoresResponse = await fetch(`${api_url}store/all?id=${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    })
    .then(res=>{
        console.log({res});
        return res.json();
    });
    return getStoresResponse;
}

export async function GetStore(id) {
    const getResponse = await fetch(`${api_url}store/get?id=${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    })
    .then(res=>{
        console.log({res});
        return res.json();
    });
    return getResponse;
}