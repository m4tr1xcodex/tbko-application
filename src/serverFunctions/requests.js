'use server'

export async function SendStore(data) {
    const postRequest = await fetch('http://tbko-api.test/store/new', {
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
    console.log(postRequest);
    return postRequest;
} 