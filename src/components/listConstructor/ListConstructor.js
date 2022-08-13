import { memo } from "react";
import { useSelector } from "react-redux";
import { useActionsConstructor,useControlList } from "../../hooks/componentConstructor";


export const MemoListContructor = memo(ListConstructor)

export default function ListConstructor({ config, name, app }) {
    console.log('rendered list')
    

    let { title, store_name, item_layout, item_action_layout, direction, controller } = config;

    let items = useSelector(state => state[app.store_name]).context[store_name]

    let { layout: controller_layout, components: controller_components } = controller
    let { grid: controller_grid, fields: controller_fields } = app.destructureLayout(controller_layout)
    let { grid: list_item_grid, fields: list_item_fields } = app.destructureLayout(item_layout)
    let { grid: list_action_grid, fields: list_action_fields } = app.destructureLayout(item_action_layout)
    let { controllers, filter_options, search_options } = app.getComponent(name, items);
    let { list_items, item_fields, filter_options: filter_values, controllerOptions, handleController, handleQuery, query } = useControlList(controllers, filter_options, search_options, items, app)
    let { action } = useActionsConstructor(name, app)


    const componentContainerStyle = (componenLabel) => {
        return {
            gridArea: `${componenLabel}`,
            
            display: 'flex',
            flexDirection: 'column',
            width: '40vw',
            alignItems: 'center',
            


        }
    }
    const actionStyle = (actionName) => {
        return {
            gridArea: `${actionName}`
        }
    }
    const listItemStyle = (itemGrid) => {
        return {
            width: '100%',
            height: '100%',
            borderBottom: '1px solid black',
            borderTop: '1px solid black',
            backgroundColor: 'white',
            display: 'grid',
            gridTemplateAreas: `${itemGrid}`,
            color: 'blue',
        }

    }
    const actionItemStyle = (actionGrid) => {
        return {
            width: '100%',
            height: '100%',
            backgroundColor: 'green',
            display: 'grid',
            gridTemplateAreas: `${actionGrid}`
        }
    }
    const listControllerStyle = (controllerItemsGrid) => {
        return {
            width: '100%',
            height: 'auto',
            display: 'grid',
            gridTemplateAreas: `${controllerItemsGrid}`,
            backgroundColor: 'white',
            color: 'black',
            columnGap: '10px',
        }
    }
    const controllerItemStyle = (itemName) => {
        return {
            gridArea: `${itemName}`,

        }
    }
    const searchComponentStyle = () => {
        return {
            width: '100%',
            height: 'auto',
            display: 'flex',
            direction: 'row'
        }
    }
    const filterComponentStyle = () => {
        return {
            width: '100%',
            height: 'auto',
            display: 'flex',
            direction: 'row'
        }
    }
    const sortComponentStyle = () => {
        return {
            width: '100%',
            height: 'auto',
            display: 'flex',
            direction: 'row'
        }
    }
    const itemListContainer = () => {
        return {
            width: '100%',
            height: '7vh',
            display: 'flex',
            flexDirection: 'row',
        }
    }
    const listItemsContainer = () =>{
        return {
            width:'100%',
            maxHeight:'70vh',
            overflowY:'scroll'
        }
    }


    return (
        <div style={componentContainerStyle(name)}>
            <h3>{title}</h3>
            <div style={listControllerStyle(controller_grid)}>
                {controller_components.map((component, index) => (
                    <div key={index} style={controllerItemStyle(component.name)}>
                        {(component.type === 'option_search') &&
                            <div style={searchComponentStyle()}>
                                <p>Buscar:</p>
                                <select
                                    name={component.name}
                                    value={controllerOptions[component.name]}
                                    onChange={(e) => handleController(e)}
                                >
                                    <option value={''}></option>
                                    {item_fields.map((value, index) => (
                                        <option key={index} value={value}>{value}</option>
                                    ))}

                                </select>
                                {(controllerOptions[component.name] !== '') &&
                                    <input type='text'
                                        onChange={(e) => handleQuery(e)}
                                        value={query}
                                    />
                                }
                            </div>
                        }

                        {(component.type === 'filter') &&
                            <div style={filterComponentStyle()}>
                                <p>Filtrar:</p>
                                <select
                                    name={component.name}
                                    value={controllerOptions[component.name]}
                                    onChange={(e) => handleController(e)}
                                >
                                    <option value={''}></option>
                                    {item_fields.map((value, index) => (
                                        <option key={index} value={value}>{value}</option>
                                    ))}
                                </select>
                                {(controllerOptions[component.name] !== '') &&
                                    <select
                                        onChange={(e) => handleQuery(e)}
                                        value={query}
                                    >
                                        {filter_values[controllerOptions[component.name]].map((item, index) => (
                                            <option key={index} value={item}>
                                                {(typeof item === 'boolean') ? (!item) ? 'No' : 'Si' : item}
                                            </option>
                                        ))}
                                    </select>
                                }
                            </div>
                        }
                        {(component.type === 'sort') &&
                            <div style={sortComponentStyle()}>
                                <p>Ordenar:</p>
                                <select
                                    name={component.name}
                                    onChange={(e) => handleController(e)}
                                    value={controllerOptions[component.name]}
                                >
                                    <option value={''}></option>
                                    {item_fields.map((value, index) => (
                                        <option key={index} value={value}>{value}</option>
                                    ))}
                                </select>
                                {(controllerOptions[component.name] !== '') &&
                                    <select
                                        onChange={(e) => handleQuery(e)}
                                        value={query}
                                    >
                                        <option>Ascendente</option>
                                        <option>Descendente</option>
                                    </select>
                                }
                            </div>
                        }
                    </div>
                ))}
            </div>
            <div style={listItemsContainer()}>
            {list_items.map((item, index) => (
                <div key={index} style={itemListContainer()}>
                    <div style={listItemStyle(list_item_grid)}>
                        {list_item_fields.map((field, index) => (
                            <div key={index}>
                                {(typeof item[field] === 'boolean') ? (!!item[field]) ? field : "no " + field : item[field]}
                            </div>
                        ))}
                    </div>
                    <div style={actionItemStyle(list_action_grid)}>
                        {Object.entries(action).map((action, index) => (
                            <button
                                key={index}
                                style={actionStyle(action[0])}
                                onClick={() => action[1](item)}
                            >
                                {action[0]}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}