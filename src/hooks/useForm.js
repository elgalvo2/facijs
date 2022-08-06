import { useEffect, useState } from "react";
import store from '../redux/store'
import { addField } from '../redux/slices/forms.feature'
import { v4 as uuid } from 'uuid'


export function useForm(initialValue){
    const [form, setForm] = useState(initialValue)
    const [opt, setOption] = useState('')

    useEffect(()=>{
        setForm(form)
    },setOption)

    const handleClean= () =>{
        console.log(initialValue)
        setForm({...initialValue,options:[]})
    }

    const handleDeleteOption = (index)=>{
        const f = {...form}
        f.options.splice(index,1)

        setForm(f)
    }
    
    const handleAddOption = () => {

        setForm(prev => {

            console.log(prev)
            prev.options.push(opt)
            
            return prev
        })
        setOption('')
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
        console.log(form)
    }

    const handleSend = () =>{
        let data = {...form}
        if(data.component == 'text'){
            data.options = []
        }
        else{
            data.type=''
        }
        data._id = uuid();
        store.dispatch(addField(data))
        handleClean()
        
    }


    return {form,opt,setOption,handleChange,handleAddOption,handleDeleteOption,handleClean,handleSend}
}