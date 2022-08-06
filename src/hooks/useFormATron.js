import { useState, useEffect, createRef } from 'react'
import Visor from '../components/visor_canvas/VisorCanvas'
import YucaForm from '../components/yuca/YucaForm'
import YucaList from '../components/yuca/YucaList'
import { apiRequest, contextUpdate } from '../redux/slices/app.feature'
import store from '../redux/store'
import ListItem from '../components/ListItem/ListItem'
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory'
import ListService from '../services/list.service'


export function useView(view) {
    let [visor, setVisor] = useState(<Visor view={view} />)
    let [preview, setView] = useState(view)
    useEffect(() => {
        const change = () => {
            if (preview != view) {
                setVisor(<Visor view={view} />)
                setView(view)
            }
        }
        change()
    }, [view])

    return { visor }
}

export function useVisorContructor(ui, view) {
    let [grid, setGrid] = useState([])
    let [fields, setFields] = useState([])
    let [preview, setView] = useState(view)
    let [catalog, setCatalog] = useState({})


    useEffect(() => {
        const change = () => {
            if (preview != view) {
                const { rows: r, grid: g, fields: f } = getDisplay(ui.nav.layouts[view])
                setGrid(g)
                setFields(f)
                setCatalogComponent(ui, fields, setCatalog)
                setView(view)
            }
        }
        change()
    }, [view])

    return { grid, fields, catalog }
}



export function useFormConstructor(fields, actions, store_name, layout) {

    const pre_form = {}
    fields.forEach(field => {
        return pre_form[field.label] = ''
    })

    let [field_catalog, setField_catalog] = useState({});
    let [actions_catalog, setActions_catalog] = useState([]);
    let [form, setForm] = useState(pre_form);
    let [send_signal, setSend_signal] = useState(false);
    let [formAction, setFormAction] = useState({});

    const handleResetForm = () => {
        setForm(pre_form)
    }
    const handleSend = () => {
        setSend_signal(true)
    }

    useEffect(() => {
        const initialiceForm = () => {
            setActions_catalog([])
            fields.forEach((field, index) => {
                form[field.label] = '';
                switch (field.type) {
                    case 'input':
                        setField_catalog((prev) => {
                            return {
                                ...prev,
                                [field.label]: <TextField key={index} store={form} method={setForm} label={field.label} />
                            }
                        })
                        break
                    case 'check-box':
                        setField_catalog((prev) => {
                            return {
                                ...prev,
                                [field.label]: <CheckBox key={index} store={form} method={setForm} label={field.label} />
                            }
                        })
                        break
                    default:
                        break
                }
            })

            for (const [key, value] of Object.entries(actions)) {
                switch (key) {
                    case 'send':
                        setFormAction({ url: value.end_point, store_action: value.store_update_action, method: value.method })
                        setActions_catalog(prev => {
                            return [...prev, <ActionButton key={key} label={key} method={handleSend} />]
                        })
                        break
                    case 'clear':
                        setActions_catalog(prev => {
                            return [...prev, <ActionButton key={key} label={key} method={handleResetForm} />]
                        })
                        break
                    default:
                        break
                }
            }
        }
        initialiceForm()
    }, [])

    useEffect(() => {
        const updatefield = () => {
            fields.forEach((field, index) => {
                switch (field.type) {
                    case 'input':
                        setField_catalog((prev) => {
                            return {
                                ...prev,
                                [field.label]: <TextField key={index} store={form} method={setForm} label={field.label} />
                            }
                        })
                        break
                    case 'check-box':
                        setField_catalog((prev) => {
                            return {
                                ...prev,
                                [field.label]: <CheckBox key={index} store={form} method={setForm} label={field.label} />
                            }
                        })
                        break
                    default:
                        break
                }
            })
        }
        updatefield()
    }, [form])

    useEffect(() => {
        const send = async () => {
            if (send_signal === true) {
                const res = await store.dispatch(apiRequest({ form, url: formAction.url, method: formAction.method }))
                if (res.meta.requestStatus == 'fulfilled') {
                    let update = {
                        action_type: formAction.store_action,
                        property: store_name,
                        data: res.payload,
                    }
                    await store.dispatch(contextUpdate(update))
                    setSend_signal(false)
                    handleResetForm()
                } else {
                    setSend_signal(false)

                }
            }
        }
        send()
    }, [send_signal])

    let { grid } = getDisplay(layout)
    return { field_catalog, grid, form, actions_catalog }

}

export function useListConstructor(items, direction, store_name, item_layout, item_action_layout) {
    let { grid: item_grid } = getDisplay(item_layout)
    let { grid: action_grid, fields } = getDisplay(item_action_layout)
    let [list, setList] = useState([]);
    let [modalData, setModalData] = useState({ open: false, item_data: null, action: null })
    let [modalContent, setModalContent] = useState(<></>)
    let [modalForm, setModalForm] = useState({})
    let [modalAction, setModalAction] = useState(false)


    useEffect(() => {
        const initList = () => {
            setList([])
            items.forEach((item, index) => {
                setList(prev => {
                    return [...prev, <ListItem key={index} modalMethod={setModalData} item_layout={item_grid} action_layout={{ action_grid, fields }} item={item} />]
                })
            })
        }
        initList()
    }, [items])

    useEffect(() => {
        const action = async() => {
            if (modalAction == true) {
                switch (modalData.action) {
                    case 'update':
                        const listService = new ListService()
                        const cont = await listService.updateAction('update/citas',{form_data:modalForm,store_name})
                        if(cont){
                            console.log(cont)
                        }
                        break;
                    default:
                        break;
                }
                setModalAction(false)
                setModalData({ open: false, item_data: null, action: null })
            }
        }
        action()
    }, [modalAction])

    useEffect(() => {
        const constructModal = () => {
            if (modalData.open === true) {
                switch (modalData.action) {
                    case 'view':
                        setModalContent(<ListModalViewType content={modalData.item_data} />)
                        break;
                    case 'update':
                        setModalForm(modalData.item_data)
                        setModalContent(<ListModalUpdateType
                            content={modalData.item_data}
                            method={setModalForm}
                        />)
                        break;
                    default:
                        break
                }
            } else {
                setModalForm({})
                setModalContent(<></>)
            }
        }
        constructModal()
    }, [modalData])
    return { list, modalData, setModalData, modalContent, setModalAction }
}


function TextField({ label, store, validations, method }) {
    return (
        <div>
            <label>{label}:</label>
            <input type={'text'} id={label} value={store[label]} name={label} onChange={(e) => method(prev => { return { ...prev, [e.target.name]: e.target.value } })} />
        </div>

    )
}

function CheckBox({ label, store, validations, method }) {
    return (
        <div>
            <input id={label} name={label} checked={store[label]} type='checkbox' onChange={(e) => method(prev => { return { ...prev, [e.target.name]: e.target.checked } })} />
            <label>{label}</label>
        </div>
    )
}

function ActionButton({ label, method, disabled = false }) {
    return (
        <button disabled={disabled} onClick={() => method()}>{label}</button>
    )
}

function ListModalViewType({ content }) {
    return (
        <div>
            {Object.entries(content).map((item, index) => (
                <p key={index}>{(typeof item[1] === 'boolean' || item[1] === '') ? (!!item[1]) ? item[0] : 'No ' + item[0] : item[0] + ' : ' + item[1]}</p>
            ))}
        </div>
    )
}
function ListModalUpdateType({ content, method }) {

    const [form, setForm] = useState(content)
    const handleChange = (name, value) => {
        setForm({
            ...form,
            [name]: value
        })
    }
    useEffect(()=>{
        const fun =()=>{
            method(form)
        }
        fun()
    },[form])


    return (
        <div>
            {Object.entries(content).map((item, index) => (
                <div key={index}>
                    <label>
                        {item[0]}
                    </label>
                    {(typeof item[1] !== 'boolean') ?
                        <input
                            name={item[0]}
                            disabled={(item[0] == '_id') ? true : false}
                            value={form[item[0]]}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            type={'text'}
                        /> :
                        <input
                            name={item[0]}
                            checked={form[item[0]]}
                            onChange={(e) => handleChange(e.target.name, e.target.checked)}
                            type={'checkbox'}
                        />
                    }
                </div>
            ))}
        </div>
    )
}

function getDisplay(layout) {
    let rows = layout.split('*')
    let grid = layout.split('').map(el => (el == '*') ? '' : el).join('')
    let fields = []
    rows.forEach(el => {
        el.split(' ').map(element => {
            const normalized = element.split('').map(i => (i == '"') ? '' : i).join('')
            return (!fields.includes(normalized)) && fields.push(normalized)
        })
    })
    return {
        rows,
        grid,
        fields
    }
}

function setCatalogComponent(ui, fields, setCatalog) {
    let { components } = ui;

    fields.forEach(field => {
        switch (components[field].type) {
            case 'form':
                setCatalog((prev) => {
                    return {
                        ...prev,
                        [field]: <YucaForm config={components[field]} />
                    }
                })
                break
            case 'list':
                setCatalog((prev) => {
                    return {
                        ...prev,
                        [field]: <YucaList config={components[field]} />
                    }
                })
                break;
            default:
                break
        }
    })
}