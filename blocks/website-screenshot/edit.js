/**
 * Internal block libraries
 */
import icons from './icons';

const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    ColorPalette,
	AlignmentToolbar,
	BlockControls,
    Editable,
	MediaUpload,
} = wp.editor;

const {
    Button,
    CheckboxControl,
    RadioControl,
    RangeControl,
    TextControl,
    TextareaControl,
    ToggleControl,
    SelectControl
} = wp.components;


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
export default class WSEdit extends Component {

    constructor() {

        super( ...arguments );
    }

    render () {

	    const {
            attributes: {
    		    websiteUrl,
    		    imgID,
    		    imgURL,
    		    imgAlt,
    		    textAlignment,
                blockAlignment,
                message
            },
		    className , isSelected, setAttributes
	    } = this.props;

        let attributes = this.props.attributes;

	    let settings = getSettings(attributes );

	    const onSelectImage = ( img, setAttributes ) => {
		    setAttributes( {
			    imgID: img.id,
			    imgURL: img.url,
			    imgAlt: img.alt,
		    } );

             console.log( 'img', img );

             console.log( 'settings', getSettingsValue( attributes ) );


	    };
	    const onRemoveImage = () => {
		    setAttributes({
			    imgID: null,
			    imgURL: null,
			    imgAlt: null,
		    });
	    };


        const onFetchURL = async value => {

            //console.log( this );

            console.log( WebsiteScreenShot.ajax_fetch_url );



            const response = await fetch( WebsiteScreenShot.ajax_fetch_url, {
                cache: 'no-cache',
                headers: {
                    'user-agent': 'WP Block',
                    'content-type': 'application/json'
                  },
                method: 'POST',
                redirect: 'follow',
                referrer: 'no-referrer',
                body: JSON.stringify(getSettingsValue( attributes )),
            })
            .then(
                returned => {
                    if (returned.ok) return returned;
                    throw new Error('Network response was not ok.');
                }
            );

            let data = await response.json();


            console.log( 'data', data );

            setAttributes( {
               imgID: data.id,
               imgURL: data.url,
               imgAlt: data.alt,
           } );

           console.log( 'settings', getSettingsValue( attributes ) );


        };


	    return (

            <div className={ className } style={ { textAlign: textAlignment } }>

                <BlockControls>
                    <AlignmentToolbar
                    value={ textAlignment }
                    onChange={ textAlignment => setAttributes( { textAlignment } ) }
                    />
                </BlockControls>


                { ! imgID ? (


                    <div class="form">

                        <div class="media-upload">
                            <MediaUpload
                    	        onSelect={ img => onSelectImage( img, setAttributes ) }
                    	        type="image"
                    	        value={ imgID }
                    	        render={ ( { open } ) => (
                                <Button
                        	        className={ "button button-large" }
                        	        onClick={ open }
                        		        >
                        		        { icons.upload }
                        	        { __( ' Upload Image', 'website-screenshot' ) }
                                </Button>
                                ) }
                            >
                            </MediaUpload>
                        </div>

                        <span class="or-method">{ __( 'or', 'website-screenshot' ) }</span>

                        <div class="webshot-input">
                            <TextControl
                                label={ __( 'Website URL', 'website-screenshot' ) }
                                value={ websiteUrl }
                                onChange={ websiteUrl => setAttributes( { websiteUrl } ) }
                            />

                            <Button
                    	        className={ "button button-large" }
                                onClick={ onFetchURL }
                                >
                                { __( 'Load', 'website-screenshot' ) }
                            </Button>
                        </div>

                    </div>


                ) : (

                    <div class="image-wrapper">
                        <img
                            src={ imgURL }
                            alt={ imgAlt }
                        />

                        <Button
                            className="remove-image"
                            onClick={ onRemoveImage }
                            >
                                { icons.remove }
                        </Button>

                    </div>

                ) }


            </div>

        );


    }
}
