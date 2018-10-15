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
 * Module constants
 */
const MIN_SIZE = 20;
const LINK_DESTINATION_NONE = 'none';
const LINK_DESTINATION_MEDIA = 'media';
const LINK_DESTINATION_ATTACHMENT = 'attachment';
const LINK_DESTINATION_CUSTOM = 'custom';
const ALLOWED_MEDIA_TYPES = [ 'image' ];



/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {

    constructor() {
        super( ...arguments );

        this.onSetLinkDestination = this.onSetLinkDestination.bind( this );
        this.onSetCustomHref = this.onSetCustomHref.bind( this );

    }

    getLinkDestinationOptions() {
		return [
            { value: LINK_DESTINATION_NONE, label: __( 'None' ) },
			{ value: LINK_DESTINATION_MEDIA, label: __( 'Media File' ) },
			{ value: LINK_DESTINATION_ATTACHMENT, label: __( 'Attachment Page' ) },
			{ value: LINK_DESTINATION_CUSTOM, label: __( 'Custom URL' ) },
		];
	}

    onSetLinkDestination( value ) {
		let url;

		if ( value === LINK_DESTINATION_NONE ) {
			url = undefined;
		} else if ( value === LINK_DESTINATION_MEDIA ) {
			url = this.props.attributes.url;
		} else if ( value === LINK_DESTINATION_ATTACHMENT ) {
			url = this.props.image && this.props.image.link;
		} else {
			url = this.props.attributes.href;
		}

		this.props.setAttributes( {
			linkTo: value,
			url,
		} );
	}

    onSetCustomHref( value ) {
		this.props.setAttributes( { href: value } );
	}

    getAvailableSizes() {
		return [
                    { value: 'a', label: __( 'Option A', 'website-screenshot' ) },
                    { value: 'b', label: __( 'Option B', 'website-screenshot' ) },
                    { value: 'c', label: __( 'Option C', 'website-screenshot' ) },
                ]
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
            url,
            linkTo
        }, setAttributes, attributes } = this.props;



        if ( ! imgURL ) {
            return '';
        }

        const isLinkURLInputDisabled = linkTo !== 'custom';

        const availableSizes = this.getAvailableSizes();


        return (

            <InspectorControls>

                <PanelBody
                    title={ __( 'Image Settings', 'website-screenshot' ) }
                    initialOpen={ true }
                    >

                    <TextareaControl
                        label={ __( 'Alt Text', 'website-screenshot' ) }
                        placeholder={ __( 'Alternative Text', 'website-screenshot' ) }
                        value={ imgAlt }
                        onChange={ imgAlt => setAttributes( { imgAlt } ) }
                    />


                </PanelBody>

                <PanelBody
                    title={ __( 'Link Settings', 'website-screenshot' ) }
                    initialOpen={ false }
                    >

                    <SelectControl
						label={ __( 'Link To' ) }
						value={ linkTo }
						options={ this.getLinkDestinationOptions() }
						onChange={ this.onSetLinkDestination }
					/>

                    { linkTo !== 'none' && (
						<TextControl
							label={ __( 'Link URL' ) }
							value={ url || '' }
							onChange={ this.onSetCustomHref }
							placeholder={ ! isLinkURLInputDisabled ? 'https://' : undefined }
							disabled={ isLinkURLInputDisabled }
						/>
					) }


                </PanelBody>




            </InspectorControls>
        );
    }
}
