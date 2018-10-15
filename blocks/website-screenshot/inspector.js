/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    InspectorControls,
    ColorPalette,
} = wp.editor;
const {
    Button,
    ButtonGroup,
    CheckboxControl,
    PanelBody,
    PanelRow,
    PanelColor,
    RadioControl,
    RangeControl,
    TextControl,
    TextareaControl,
    ToggleControl,
    Toolbar,
    SelectControl
} = wp.components;

const {
    Editable,
    MediaUpload,
} = wp.editor;


function getSettings( attributes ) {
    let settings = [];
    for( let attribute in attributes ) {
        let value = attributes[ attribute ];
        if( 'boolean' === typeof attributes[ attribute ] ) {
            value = value.toString();
        }
        settings.push( <li>{ attribute }: { value }</li> );
    }
    return settings;
}



function getSettingsValue( attributes ) {
	let settings = {};
	for( let attribute in attributes ) {
		let value = attributes[ attribute ];
		if( 'boolean' === typeof attributes[ attribute ] ) {
			value = value.toString();
		}
        settings[ attribute ] = value;

	}
	return settings;
}



/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {

    constructor() {
        super( ...arguments );
    }

    render() {
        const { attributes: {
            title,
            websiteUrl,
            viewportWidth,
            viewportHeight,
            imgID,
            imgURL,
            imgAlt,
            full,
            delay,
        }, setAttributes, attributes } = this.props;

        const onSelectImage = img => {
            setAttributes( {
                imgID: img.id,
                imgURL: img.url,
                imgAlt: img.alt,
            } );
        };


        const onFetchURL = async evt => {
            evt.preventDefault();

            let button = evt.target;

            if ( button.classList.contains('is-busy') ) {
                evt.preventDefault();
            }

            button.classList.add("is-busy");
            button.setAttribute("disabled", "");

            let settingValues = getSettingsValue( attributes );
            settingValues._nonce = WebsiteScreenShot.nonce;

            const response = await fetch( WebsiteScreenShot.ajax_fetch_url, {
                cache: 'no-cache',
                headers: {
                    'user-agent': 'WP Block',
                    "Content-Type": "application/json; charset=utf-8",
                    //"Content-Type": "application/x-www-form-urlencoded",
                  },
                method: 'POST',
                redirect: 'follow',
                referrer: 'no-referrer',
                body: JSON.stringify( settingValues ),
            })
            .then(
                returned => {
                    if (returned.ok) return returned;
                    throw new Error('Network response was not ok.');
                }
            );

            let data = await response.json();

            // removeAttribute
            button.classList.remove("is-busy");
            button.removeAttribute("disabled");
            console.log( 'data', data );

            setAttributes( {
               imgID: data.id,
               imgURL: data.url,
               imgAlt: data.alt,
           } );

        };


        return (
            <InspectorControls>
                <PanelBody
                    title={ __( 'Website Screenshot', 'website-screenshot' ) }
                    initialOpen={ true }
                    >

                    <TextControl
                        label={ __( 'Website URL', 'website-screenshot' ) }
                        placeholder={ __( 'https://yoursite-url.com', 'website-screenshot' ) }
                        value={ websiteUrl }
                        onChange={ websiteUrl => setAttributes( { websiteUrl } ) }
                    />

                    <TextControl
                        label={ __( 'Title', 'website-screenshot' ) }
                        value={ title }
                        onChange={ title => setAttributes( { title } ) }
                    />

                    <TextControl
                        label={ __( 'Viewport Width', 'website-screenshot' ) }
                        help={ __( 'Custom image width', 'website-screenshot' ) }
                        value={ viewportWidth }
                        type={ 'number' }
                        onChange={ viewportWidth => setAttributes( { viewportWidth } ) }
                    />

                    <TextControl
                        label={ __( 'Viewport Height', 'website-screenshot' ) }
                        help={ __( 'Custom image height', 'website-screenshot' ) }
                        value={ viewportHeight }
                        type={ 'number' }
                        onChange={ viewportHeight => setAttributes( { viewportHeight } ) }
                    />

                    <TextControl
                        label={ __( 'Delay', 'website-screenshot' ) }
                        help={ __( 'If set, we\'ll wait for the specified number of milliseconds after the page load event before taking a screenshot.', 'website-screenshot' ) }
                        value={ delay }
                        type={ 'number' }
                        onChange={ delay => setAttributes( { delay } ) }
                    />

                    <ToggleControl
                        label={ __( 'Full Entry', 'website-screenshot' ) }
                        checked={ full }
                        onChange={ full => setAttributes( { full } ) }
                    />


                    <Button
                        className={ "button button-large" }
                        onClick={ onFetchURL }
                        >
                        { __( 'Take Screenshot', 'website-screenshot' ) }
                    </Button>

                </PanelBody>

                <PanelBody
                    title={ __( 'Image Settings', 'website-screenshot' ) }
                    initialOpen={ true }
                    >

                </PanelBody>


            </InspectorControls>
        );
    }
}
