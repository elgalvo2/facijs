
import React, { memo } from "react";
import { useCreateForm } from "../../hooks/componentConstructor";


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

export const MemoFormConstructor = memo(FormConstructor)

export default function FormConstructor({ config, name, app }) {

    console.log('rendered form')

    let { layout, actions, fields, title } = config;
    let { grid } = app.destructureLayout(layout)
    let { initial_value, validations } = app.getComponent(name)
    let { form, handleChange, handleClear, errors, ready, handleSend } = useCreateForm(initial_value, validations, app, name)


    const error_helper_style = {
        color: 'red',
        fontSize: '8px',
        marginLeft: '5px',
        backgroundColor: 'white',
        padding: '3px',
    }



    return (
        <div style={form_style(name)}>
            <h3 className="form-title">{title}</h3>
            <div style={body_form_style(grid)}>
                {fields.map((item, index) => (
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
                    // <input type={(item.type==='input')?'text':(item.type==='check-box')?'checkbox':'text'}>
                ))}
            </div>
            <div style={actionFormStyle()}>
                {Object.entries(actions).map((item, index) => (
                    <button
                        disabled={(item[0] === 'send') ? !ready : false}
                        onClick={(item[0] === 'clear') ? () => handleClear() : (item[0] === 'send') ? () => handleSend() : () => console.info('No action setted')}
                        key={index}
                        style={actionButtonStyle()}
                    >{item[0]}
                    </button>
                ))}
            </div>
        </div>
    )
}