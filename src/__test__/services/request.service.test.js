import RequestService from '../../services/request.service'

const testing_url = 'http://localhost:9999/class_api/v0/citas/'
const testing_url_response_property = 'data' // in future should define a proper mocking for request

describe('Testing on request service',()=>{
    test('Request service creates an instance correctly',()=>{
        let request = new RequestService()
        expect(typeof request).toBe('object')
    })

    test('Handles error correclty if no arguments defined',async()=>{
        let request = new RequestService()
        try{
            await request.request()
        }catch(err){
            expect(err.message).toBe('_axios.default[method] is not a function')
        }
    })

    test('Return data rejected promise if url no valid',async()=>{
        let request = new RequestService()
        await expect(request.request('http://localhost:9999/class_api/v0/citas3/',{},'get')).rejects.toBe("Request failed with status code 404")
        
    })

    test('Return data correctly',async()=>{
        let request = new RequestService()
        let res = await request.request(testing_url,{},'get')
        expect(res).toHaveProperty(testing_url_response_property)
    })


})