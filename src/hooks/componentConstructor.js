import { useEffect, useState } from "react";


export function useCreateForm(initial_value, validations, app, component_name,config) {
    
    let [form, setForm] = useState(initial_value)
    let [errors, setErrors] = useState((config!==undefined)?config.initial_error:initial_value)
    let [ready, setReady] = useState(false);
    
    useEffect(() => {
        setForm(initial_value);
        setErrors((config!==undefined)?config.initial_error:initial_value);

        return () => {
            setForm({});
            setErrors({});
            setReady(false)
        }
    }, [])


    useEffect(() => {
        const isReady = () => {
            let pass = true;
            for (const [key, value] of Object.entries(form)) {
                if (typeof value !== 'boolean') {

                    if((config===undefined)){       
                        if (value === initial_value[key] || errors[key] !== initial_value[key]) {
                            pass = false
                        }
                    }else{
                        if (JSON.stringify(form) === JSON.stringify(initial_value) || errors[key] !== config.initial_error[key]) {
                            pass = false
                        }
                    }
                }
            }
            
            if (pass === true) {
                setReady(true)
            } else {
                setReady(false)
            }
        }
        isReady()
    }, [form])

    let handleChange = (e) => {
        let { error, pass } = validations[e.target.name](e.target.value)
        if (!!pass) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            })
            setForm({
                ...form,
                [e.target.name]: (typeof initial_value[e.target.name] === 'boolean') ? e.target.checked : e.target.value
            })
        } else {
            setForm({
                ...form,
                [e.target.name]: (typeof initial_value[e.target.name] === 'boolean') ? e.target.checked : e.target.value
            })
            setErrors({
                ...errors,
                [e.target.name]: error
            })
        }


    }

    let handleClear = () => {
        setForm(initial_value);
        setErrors(initial_value);
        setReady(false)

    }

    let handleSend = async () => {
        let res = await app.requestAndUpdateContextAction({ data: form, component_name, action: 'send' })
        if (!!res) {
            handleClear()
        }
    }
    

    return { form, handleChange, handleClear, handleSend, errors, ready }

}

export function useControlList(controllers, options, fields, items, app) {


    let [controllerOptions, setControllerOptions] = useState(controllers)
    let [item_fields, setItem_fields] = useState(fields)
    let [list_items, setList_items] = useState(items)
    let [filter_options, setFilterOptions] = useState(options)
    let [query, setQuery] = useState('')


    useEffect(() => {
        return () => {
            setControllerOptions({})
            setItem_fields([])
            setList_items([])
            setFilterOptions({})
            setQuery(null)
        }
    }, [])

    useEffect(() => {
        setControllerOptions(controllers)
        setItem_fields(fields)
        setFilterOptions(options)
        setList_items(items)
    }, [items])

    useEffect(()=>{
        if(query!==''){
            setList_items([])
            for(let [key,value] of Object.entries(controllerOptions)){
                if(value!==''){
                    items.forEach(item=>{
                        (item[value].toUpperCase().indexOf(query.toUpperCase())>-1)&&setList_items(prev=>[...prev,item])
                    })
                }
            }
        }else{
            setList_items(items)
        }
    },[query])

    const handleController = (e) => {
        setQuery('')
        setControllerOptions({
            ...controllers,
            [e.target.name]: e.target.value
        })
    }

    const handleQuery = (e) => {
        setQuery(e.target.value)
    }



    return { list_items, item_fields, filter_options, controllerOptions, handleController, handleQuery, query }
}


export function useActionsConstructor(componentName,app){
    let action_helper = {}
    let redirectFunction = (target,item)=>{
        app.store.dispatch(app.dialogController({target,item}))
    }


    let {actions,item_action_layout} = app.store.getState()[app.store_name].ui.components[componentName].config
    let {fields} = app.destructureLayout(item_action_layout)

    fields.forEach(field=>{
        if(actions[field]!== undefined){
            
            if(actions[field].target_config!==undefined && actions[field].target_config.pass_item===true){
                action_helper[field] = (item)=>redirectFunction(actions[field],item)
            }else{
                action_helper[field] = ()=>redirectFunction(actions[field])
            }
        }
    })

    let [action, setAction] = useState(action_helper)


    return {action}
}