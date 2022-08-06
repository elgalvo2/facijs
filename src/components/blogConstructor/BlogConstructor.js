export default function BlogConstructor({ app, config, name }) {
    let { item: helper_item } = app.getHelperItem()
    let { layout, title, blocks, inherit_item } = config
    let { fields, grid } = app.destructureLayout(layout)


    const blogContainerStyle = (grid) => {
        return {
            display: 'grid',
            gridTemplateAreas: `${grid}`,
        }
    }
    const blogItemStyle = (gridArea) => {
        return {
            gridArea: `${gridArea}`
        }
    }

    return (
        <div style={blogContainerStyle(grid)}>
            {blocks.map((item, index) => (
                <div
                    key={index}
                    style={blogItemStyle(item.name)}
                >
                    {(item.content.type === 'text') &&
                        <>
                            {(!!item.content.label) && <label>{item.name} :</label>}
                            <p>
                                {(!!item.content.item_target) ?
                                    helper_item[item.content.item_target]
                                    :
                                    item.content.value
                                }
                            </p>
                        </>
                    }
                    {(item.content.type === 'boolean') &&
                        <>
                            {(!!item.content.label) && <label>{item.name} :</label>}
                            <p>
                                {(!!item.content.item_target) ?
                                    (!!helper_item[item.content.item_target]) ? item.content.values.true : item.content.values.false
                                    :
                                    item.content.value
                                }
                            </p>
                        </>
                    }
                </div>
            ))}
        </div>
    )
}

