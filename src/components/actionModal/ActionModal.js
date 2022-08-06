import { useCreateForm } from "../../hooks/componentConstructor"



const form_style = (componentName) => {
    return {
        gridArea: `${componentName}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '5%',
        width: '40vw',
        height: 'fit-content',
        backgroundColor: 'blue',
        alignItems: 'center',
        gap: '5vh',
    }
}


const body_form_style = (formGrid) => {
    return {

        width: '100%',
        display: 'grid',
        gridTemplateRows: 'auto',
        gridTemplateAreas: `${formGrid}`,
        height: 'max-content',
        justifyContent: 'center',
        alignItems: 'strech',
        padding: '5%',
        columnGap: '3%',
        rowGap: '3%',
    }
}
const fieldContainerStyle = (fieldName) => {
    return {
        gridArea: `${fieldName}`,
        position: 'relative',
    }
}

const inputStyle = () => {
    return {
        backgroundColor: 'black',
        color: "white",
        padding: '5px',
    }
}

const actionFormStyle = () => {
    return {
        display: 'flex',
        flexDirection: 'row',
        gap: '10%',
        '&:hover': {
            cursor: 'pointer'
        }
    }
}

const actionButtonStyle = () => {
    return {
        width: '7vw',
        padding: '3%'
    }
}

export default function ActionModal({ app, config }) {
    let helper = app.getHelperItem()
    let { target_config, item: helper_item } = helper
    let { actions } = target_config
    let { initial_value, validations, component_fields, grid, initial_error } = app.getActionModal(helper)
    let form_config = {
        initial_error,
        watch_initial_values : false
    }
    let { form, handleChange, handleClear, handleSend, errors, ready } = useCreateForm(initial_value, validations, app, '', form_config)
    


    const error_helper_style = {
        color: 'red',
        fontSize: '8px',
        marginLeft: '5px',
        backgroundColor: 'white',
        padding: '3px',
    }

    return (
        <>
            <div style={body_form_style(grid)}>
                {component_fields.map((item, index) => (
                    (initial_value[item.label] !== undefined) && (

                        (item.type === 'text' || item.type === 'checkbox')
                        &&
                        <div
                            style={fieldContainerStyle(item.label)}
                            key={index}
                        >
                            <label>{item.label}
                                {(!!errors[item.label]) && <span style={error_helper_style}>{errors[item.label]}</span>}
                            </label>
                            {(item.type === 'checkbox') ?
                                <input
                                    style={inputStyle()}
                                    onChange={(e) => handleChange(e)}
                                    checked={form[item.label]}
                                    type={'checkbox'}
                                    name={item.label}
                                    placeholder={item.label}
                                /> :
                                <input
                                    style={inputStyle()}
                                    onChange={(e) => handleChange(e)}
                                    value={form[item.label]}
                                    type={item.type}
                                    name={item.label}
                                    placeholder={item.label}
                                />
                            }

                        </div>
                    )
                ))}
            </div>
            <button
                onClick={() => app.store.dispatch(app.dialogController({ target: 'none' }))}
            >
                Cancelar
            </button>

            {Object.entries(actions).map(([key, value], index) => (
                <button
                    disabled={!ready}
                    key={index}
                    onClick={(!!value['send_data'])?() => app.continueAction(key,form):() => app.continueAction(key)}
                >
                    {value.name}
                </button>
            ))}
        </>
    )
}