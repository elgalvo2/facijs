


import ActionModal from "../actionModal/ActionModal";
import ConfirModal from "../confirmModal/ConfirmModal";
import BlogConstructor from "../blogConstructor/BlogConstructor";
import ListConstructor from "../listConstructor/ListConstructor";
import FormConstructor from '../formConstructor/FormConstructor'
import ChartConstructor from "../chartConstructor/ChartConstructor";


export default function createView(view, app) {
    let { name, components, grid } = view;
    let componentContainerStyle = (layout) => {
        return {
            position: 'relative',
            display: 'grid',
            gridTemplateAreas: `${layout}`,
            width: '100%',
            height: 'max-content',
            justifyContent: 'space-evenly',
            alignItems: 'start',
        }
    }

    return (
        <div style={componentContainerStyle(grid)} name={name}>
            {components.map((item, index) => (
                (item.type === 'form') ?
                    <FormConstructor
                        app={app}
                        config={item.config}
                        name={item.name}
                        key={index}
                    />
                    :
                    (item.type === 'list') ?
                        <ListConstructor
                            app={app}
                            config={item.config}
                            name={item.name}
                            key={index}
                        />
                        :
                        (item.type === 'chart') ?
                            <ChartConstructor
                                app={app}
                                key={index}
                            />
                            :
                            (item.type === 'blog') ?
                                <BlogConstructor
                                    app={app}
                                    key={index}
                                    name={item.name}
                                    config={item.config}
                                />
                                :
                                (item.type === 'confirm_view') ?
                                    <ConfirModal
                                        key={index}
                                        config={item.config}
                                        app={app}
                                    />
                                    :
                                    (item.type === 'modal-view-action') &&
                                    <ActionModal
                                        key={index}
                                        config={item.config}
                                        app={app}
                                    />

            ))}
        </div>
    )
}
