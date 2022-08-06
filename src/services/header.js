const header = ()=>{
    let auth_token = JSON.parse(localStorage.getItem('auth'))
    return {'access_token': 'bearer'+auth_token}
}

export default header;




