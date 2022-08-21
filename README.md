*En desarrollo. Se desaconseja su uso en produccion*


Faci.js 

Sintaxis

Faci utiliza un objecto llamado ui para renderizar en el dom la aplicacion deseada. 
Las propiedades del objeto ui definen la forma en que la aplicacion se comporta, sus componentes y las interacciones entre estos componentes.

Sintaxis de Faci para la definicion del grid de los diferentes componentes:
    Los componentes definidos en el objeto global ui, son renderizados y distribuidos segun lo especificado; para esto, reductor utiliza una sintaxis unica
    para definir la forma en la que los componentes deben posicionarse dentro de su componente padre.
        El motor interno de reductor utiliza *grid areas* para distribuir los componentes dentro del DOM, por esto, la sintaxis utilizada para describir los layout de los componentes es el siguiente:    
            `` <------back tics: definen el inicio de un string de layout
            "componente1 componente2"<------comillas dobles para definir una fila de componentes.. Los componentes dentro de una misma fila son separados por espacio simple (columnas) no debe existir espacios entre los componentes y las comillas
            "componente1"*"componente2"<-------Para definir una nueva fila de componentes es utilizado el operador producto (*) 
        Las reglas de css para la definicion de grid areas deben seguirse.


Propiedad nav:

La propiedad nav del objeto ui hace referencia a las diferentes vistas o pestanas de la aplicacion. Esta propiedad
Es un objecto que contiene dos propiedades: options y layout

    Propiedad options de nav:
        La propiedad options es un array que hace referencia a las diferentes vistas de la aplicacion.
        Los objetos dentro de este array son cadenas de texto

    Propiedad layout de nav: 
        La propiedad layout es un objeto cuyas propiedades hacen referencia a las vitas definidad en la propiedad options.
        Las propiedades de este objecto layout deben de nombrarse exactamente como la vista a la que hacen referencia, y contener una
        cadena de texto que utiliza la sintaxis propia de reductor para definir la forma en la que los diferentes componentes de la vista estaran 
        distribuidos;los componentes definidos dentro del string de layout deben nombrarse exactamente como las propiedades del objecto componentes
        a la que hacen referencia. 
        Los componentes pueden ser reutilizados dentro de las diferentes vistas de la aplicacion
    

Propiedad components:

La propiedad components del objecto global ui, hace referencia a los diferentes componentes que se usaran dentro de la aplicacion.
Las propiedades dentro de components definen el nombre del componente, y el objecto al que hacen referencia contiene la configuracion y comportamiendo del componente.
Cada componente debe contener 2 propiedades: type y config.
La propiedad type define el tipo del componente; las opciones son form, list, chart y blog.

    Component form:
    El componente tipo form, es un formulario de campos controlados de cantidad variables y con opciones de validacion. 
    En la propiedad config de los componentes tipo formulario (form) deben especificarse las siguientes propiedades:
        Title: nombre del formulario. Esto sera visible en la parte superior del formulario.
        Layout: propiedad donde se define la distribucion de los campos del formulario utilizando un string de layout. El nombre de los campos definidos en esta Propiedad
        deben conicidir con el nombre definido en la propiedad label del array fields (esta propiedad del objeto component se vera mas adelante).
        store_name: esta propiedad hace referencia a la propiedad del objecto global context donde se alojaran los objetos generados por el formulario.
        actions: esta propiedad alberga un objeto cuyas propiedades hacen referencia a las acciones que puede realizar el formulario. 
            objeto actions: cada propiedad definida en este objeto hace referencia a una accion del formulario. El comportamiento de estas acciones debe definirse dentro de un 
            objeto con las siguientes propiedades:  
                end_point: direccion a la que se hara consulta cuando se active la accion
                store_update_action: tipo de accion ejecutada dentro del store de la aplicacion (ver configuracion inicial)
                method: methodo utilizado al realizar la peticion al servidor
            el objeto actions permite la definicion de una acccion llamada clear, esta accion limpia los campos y mensajes de errores de validacion del formulario. Solo es necesario definir
            su valor como true si se desea esta comportamiento.
        fields: esta propiedad contiene un array de objetos, los cuales hacen referencia a un campo especifico del forumulario. Los objetos field contienen 3 propiedades obligatorias y 3 opcionales: 
            label: hace referencia al nombre del campo. Este nombre sera visible en el formulario y debe escribirse exactamente como fue definido en el string de layout de la propiedad layout del componente
            form al que pertenece.
            type: indica el tipo de campo. Puede ser tipo text o checkbox.
            validations: esta propiedade define la validacion requerida en este campo. Las opciones son:
                only-text: solo texto, sin signos ni caracteres especiales
                only-##-numbers: especifica una cantidad exacta de numeros permitidos
                unchecked: solo en campos checkbox
                custom: si el valor de la propiedad validatios es definido como custom; deberan definirse 3 propiedades mas:
                    custom_validation: string tipo regex que define el tipo de validacion
                    validation_flag: caracter que indica como se empleara el regex de la propiedad custom_validation
                    validation_messsage : mensaje que sera mostrado en el formulario en caso de no cumplirse la validacion.
    
    componente list: 
    El componente tipo list, es una lista que objetos almacenados en una propiedad especificada del store. Cada objeto de esta lista contiene aciones especificas cuyo comportamiento puede especificarse en la propiedad
    config de este componente. La distribucion de los campos de los objetos de la lista se divide en dos partes; item_layout, donde se mostraran los datos del objeto, y item_action_layout, donde se define la distribucion 
    de las acciones del objeto de la lista. De estas propiedades hablaremos mas adelante.
    La propiedad config contiene un objeto con las siguientes propiedades:
        title: nombre de la lista
        direction: direccion de la lista. Puede ser vertical u horizontal
        store_name: nombre de la propiedad del contexto que contiene los objetos que se visualizaran en la lista
        item_layout: en esta propiedad se define la distribucion de los datos del objeto de lista que se visualiza. Para esto, se define un string de layout con el nombre de las propiedades del objeto del contexto que se
        desea visualizar en el objeto.
        item_action_layout: esta propiedad se especifica la distribucion de las acciones que puede realizar los objetos de lista. Utiliza un string de layout con el nombre correspondiente de la accion para definir su distribucion
        en el objeto lista.
        actions: la propiedad actions en los componentes lista, al igual que en el componente tipo form, contiene un objeto con propiedades que corresponden al nombre de la accion. Este nombre debe conicidir con el definido en la propiedad item_action_layout.
        Las propiedades de cada objeto action son:
            type: tipo de accion (por el momento las acciones permitidas son del tipo redirect)
                action type 'redirect': las acciones tipo redirect redirigen la navegacion hacia un componente en especifico. Este componente se define en la propiedad target.
            target: define el componente objetivo a la que la accion disparada redirige. (ver internal nav propertie)
            target_config: la propiedad target_config contiene un objeto con la configuracion del comportamiento de componente objetivo. Las propiedades configurables son:
                pass_item: el valor de esta propiedad es de tipo booleano. El valor true indica que el objeto contenido dentro del item de lista que dispara esta accion sera heredado por el componente al que la accion redirige el flujo de la navegacion.
                actions: esta propiedad es un objeto cuyas propiedades hacen referencia a las acciones que el componente objetivo efectura. En este objeto debe definirse una propiedad primary, la cual define la accion principal del componente objetivo.
                    primary: esta es la propiedad que define la accion principal del componente objetivo y hace referencia a un objeto que contiene lac onfiguracion delc omportamiento. Contiene estas propiedades:
                        name: nombre de la accion, este nombre sera visible en el boton que dispara la accion
                        end_point: direccion del endpoint donde se realizara la peticion al ser ejecutada la accion
                        method: metodo de la peticion al endpoint
                        store_update_action: tipo de accion que actulizara el contexto de la aplicacion
                        store_target_name: nombre de la propiedad del contexto que se actulizara con la accion
                        send_data: booleano que especifica si la informacion dentro del componente objetivo sera enviada por medio de una peticion al end end_point
                layout: en caso que el componente objetivo contenga un formulario, es necesario especificar la distribucion de sus campos en esta propiedad layout. utiliza un string de layput para ello.
                no_editable_properties: contiene un array que especifica las propiedades del objeto que no pueden ser editados
                fields: si fue definida la propiedad layout, es necesario especificar los campos y las validaciones del formulario contenido dentro del componente objetivo. Esto se hace igual a como se definen los fields de los componentes form.
        controller: cuando este componente esta definido, especifica que el componente lista sera controlado con una cabecera que contendra los controles para filtrar, ordenar y buscar entre los objetos del componente lista. Esta propiedad contieen un objeto
        cuyas propiedades definen el comportamiento del controlador:
            layout: define la distribucion de los controladores, llamados componentes, especificandola con un string de layout. El nombre de los objetos especificados dentrod el string de layout debe coincidir con el nombre de los componentes definido en la 
            propiedad name del array de objetos de la propiedad components.
            components: es un array de objetos, los cuales hacen referencia a los componentes dentro del controlador. Estos componentes son de 3 tipos: filtrar, buscar y ordenar, y si configuracion esta definida en las propiedades del objeto.
                name: nombre del componente del controlador, este nombre debe ser igual al definido en layout.
                title: nombre que sera mostrado en el DOM. 
                type: el tipo de componente. este puede ser option_search, filter, sort.
                    option_search: buscar segun las propiedades de los objetos que contiene el componente lista.
                    filter: filtro
                    sort: ordenar

    componente blog:
    El fin de los componentes tipo blog es informativo y sus partes se dividen en bloques que son utiliazados para difinir la distribucion del componente. Las propiedades en la propiedad config del componente blog son las siguientes: 
        inherit_item: indica si el componente heradara un objeto del contexto.
        title: titulo que sera visible en el dom al renderizar el componente
        layout: distribucion de los bloques dentro del componente blog. Utiliza un string de layout que defina la distribucion utilizando el mismo nombre especificado en la propiedad name del objeto dentro de la propiedad blocks.
        store_name: nombre de la propiedad del contexto que contiene el objeto que se visualizara
        block: contiene un array con objetos que hacen referencia a los bloques en los que se divide el componente blog. contiene las siguientes propiedades:
            name: nombre del bloc. debe coincidir con el especificado en la propiedad layout
            block: tipo de bloque. solo tipo normal (por el momento)
            content: objeto cuyas propiedades definen las caracteristicas del contenido del bloque
                type: text y booleano ( valor booleano puede utilizarse solo si la propiedad inherit_item esta definida ) si la peopiedad es de tipo booleando, es necesario definir una propiedad con el nombre values que contenga un objeto donde se definan los valores que 
                se mostrarar en caso (true false)

                label: booleano, indica si es necesario una etiqueta al contenido del bloque.
                item_target: indica cual propiedad del objeto del contexto mostrar. si esta propiedad no esta definida, debe definirse una propiedad value que contenga la informacion que el bloque renderizara
                value: texto que se mostrara en el bloque
                values: campo condicional, debe definirse si el type del bloque es boolean y debe definir las dos posibilidades  ejemplo --> {true:'valor mostrado si la propiedad item_target del objeto del contexto es verdadera', false:'valor mostrado si la propiedad item_target del objeto del contexto es falsa'}

propiedad internal_nav: 

La propiedad internal nav del objeto ui contiene propiedades que hacen referencia a componentes que son mostrados fuera del flujo natural de la aplicacion, en otras palabras, estos componentes son renderizados cuando una accion del tipo redirect dentro de otro componente es ejecutada. 
Los componentes definidos dentro de internal_nav son usualmente ventanas modales en los cuales se efectuan operacion de confirmacion, edicion o visualizacion de la informacion de objetos guardados dentro del contexto, los cuales son heredados desde el componente que ejecuta la accion que muestra esots componentes (internal_nav components)
Cada propiedad detro del objeto internal_nav hace referencia a un componente, la configuracion del comportamiento de este componente esta definido dentro del oobjeto al que hace referencia. este objeto contiene las siguientes propiedades:
    type: tipo del componente, las opciones son modal-view (solo visualizaciond de informacion, modal significa que el componente se desplegara dentro de un cuadro de dialogo), modal-view-action (para componentes que realizaran alguna accion con la informacion hereada), y confirm_view (componentes con funcion complementaria a una accion previa, sirven apra confirmacion de acciones)
    config: objeto en el que se define el comportamiento del componente.
        store_name: 'nombre de la propedad del contexto donde se encuentra el objeto a mostrar
        layout: esta propiedad define la distribucion de los componentes que seran mostrados dentro del componente internal_nav. El nombre de los componentes debe conicidir en el string de layout.
        Esta propiedadno es necesaria en componentes de tipo confirm-view.
        text: muestra el texto auxiliar en los componentes tipo confirm_view.
        action: tipo de accion que realizara el componente edit, delete. Este campo no es necesario en los componentes tipo modal-view


Propiedad loading: propiedad de ayuda. Utilizada para mostrar un loader.
Propiedad message: esta propiedad es utilizada para mostrar mensajes del sistema
showing_modal: esta propiedad es utilizada para controlar la renderizacion de los componentes internal_nav
redirect_helper: contiene el objeto que hereda un componente de internal_nav del componente que ejecuta la accion de redireccion
view: controlador de la visualizacion de los componentes de la aplicacion. Define que es lo que semuestra en la pantalla
request_status: define si una peticion se esta llevando a cabo y su estado.


        




        






      




    
        


    
