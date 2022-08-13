import header from '../../services/header'

describe('Test on header service function ',()=>{
    test('Header function creates a header with access token correctly',()=>{
        let hd = header()
        expect(hd).toBeDefined()
        expect(hd).toHaveProperty('access_token')
    })
})