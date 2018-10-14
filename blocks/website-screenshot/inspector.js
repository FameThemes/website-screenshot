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
        }, setAttributes } = this.props;

        const onSelectImage = img => {
            setAttributes( {
                imgID: img.id,
                imgURL: img.url,
                imgAlt: img.alt,
            } );
        };

        return (
            <InspectorControls>
                <PanelBody
                    title={ __( 'Website Info', 'website-screenshot' ) }
                    initialOpen={ true }
                    >

                    <TextControl
                        label={ __( 'Title', 'website-screenshot' ) }
                        value={ title }
                        onChange={ textControl => setAttributes( { title } ) }
                    />

                </PanelBody>

                <PanelBody
                    title={ __( 'Image Settings', 'website-screenshot' ) }
                    initialOpen={ true }
                    >
                    <TextControl
                        label={ __( 'Viewport Width Width', 'website-screenshot' ) }
                        help={ __( 'Custom image width', 'website-screenshot' ) }
                        value={ viewportWidth }
                        type={ 'number' }
                        onChange={ viewportWidth => setAttributes( { viewportWidth } ) }
                    />
                    <TextControl
                        label={ __( 'Viewport Height Height', 'website-screenshot' ) }
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
                </PanelBody>


            </InspectorControls>
        );
    }
}
