


import ActionModal from "../actionModal/ActionModal";
import ConfirModal from "../confirmModal/ConfirmModal";
import BlogConstructor,{MemoBlogConstructor} from "../blogConstructor/BlogConstructor";
import ListConstructor,{MemoListContructor} from "../listConstructor/ListConstructor";
import FormConstructor,{MemoFormConstructor} from '../formConstructor/FormConstructor'
import ChartConstructor from "../chartConstructor/ChartConstructor";
import { memo } from "react";



export default function CreateView(view,app) {


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
                    <MemoFormConstructor
                        app={app}
                        config={item.config}
                        name={item.name}
                        key={index}
                    />
                    :
                    (item.type === 'list') ?
                        <MemoListContructor
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
                                <MemoBlogConstructor
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
