
export default async function Login()
     {
    const data = await fetch(`${process.env.PUBLIC_API}/alive`)
    const json = await data.json()
    
    if (data.status !== 200) {
        return <p>{JSON.stringify(json)}</p>
    }


   return <><h1>Login</h1><p>{process.env.PUBLIC_API}<br/> Is Alive : {JSON.stringify(json)}</p></> 
}