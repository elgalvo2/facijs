



export default function ConfirModal({ config, app }) {
    let helper = app.getHelperItem()
    let { target_config, item: helper_item } = helper
    let { actions } = target_config

    return (
        <>
            <h3>{config.text}</h3>
            {Object.entries(helper_item).map((item, index) => (
                <p key={index}>{item[0]}:
                    {(typeof item[1] === 'boolean') ? (!!item[1]) ? `${item[0]}` : `no ${item[0]}` : item[1]}
                </p>
            ))}
            <button
                onClick={() => app.store.dispatch(app.dialogController({ target: 'none' }))}
            >
                Cancelar
            </button>

            {Object.entries(actions).map(([key, value], index) => (
                <button
                    key={index}
                    onClick={() => app.continueAction(key)}
                >
                    {value.name}
                </button>
            ))}
        </>
    )
}