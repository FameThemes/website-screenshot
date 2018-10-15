/**
 * Block dependencies
 */
import classnames from 'classnames';
import Inspector from './inspector';
import Controls from './controls';
//import WSEdit from "./edit";
import icons from './icons';
//import icon from './icon';
import attributes from './attributes';
import './style.scss';
import './editor.scss';


const { __ } = wp.i18n;
const {
    registerBlockType,
} = wp.blocks;
const {
    AlignmentToolbar,
    BlockControls
} = wp.editor;


const {
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
 * Register static block example block
 */
export default registerBlockType(
    'ft/website-screenshot',
    {
        title: __( 'Website Screenshot', 'website-screenshot' ),
        description: __( 'Image Settings', 'website-screenshot'),
        category: 'common',
        icon: {
            //background: 'rgba(254, 243, 224, 0.52)',
            src: icons.block,
        },
        keywords: [
            __( 'Palette', 'website-screenshot' ),
            __( 'Settings', 'website-screenshot' ),
            __( 'Scheme', 'website-screenshot' ),
        ],
        attributes,

        getEditWrapperProps( attributes ) {
            const { blockAlignment } = attributes;
            if ( 'left' === blockAlignment || 'right' === blockAlignment  || 'wide' === blockAlignment || 'full' === blockAlignment ) {
                return { 'data-align': blockAlignment };
            }
        },

        edit: props => {
            //const { setAttributes } = props;

            const {
                attributes: {
        		    websiteUrl,
                    title,
                    imgID,
    			    imgURL,
    			    imgAlt,
        		    textAlignment,
                    blockAlignment,
                    viewportWidth,
                    viewportHeight,
                    full,
                    delay,
                },
    		    className , isSelected, setAttributes, attributes
    	    } = props;

            let settings = getSettings( attributes );
            let values = getSettingsValue( attributes );

    	    const onSelectImage = ( img ) => {
    		    setAttributes( {
    			    imgID: img.id,
    			    imgURL: img.url,
    			    imgAlt: img.alt,
    		    } );
    	    };

    	    const onRemoveImage = () => {

    		    setAttributes({
    			    imgID: 0,
    			    imgURL: '',
    			    imgAlt: '',
    		    });
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
               } );

               if ( ! settingValues.imgAlt ) {
                   setAttributes( {
                      imgAlt: data.alt,
                  } );
               }

               console.log( 'settings', getSettingsValue( attributes ) );


            };


            return [
                <Inspector  {...{ setAttributes, ...props }} />,
                <Controls   {...{ setAttributes, ...props }} />,
                //<WSEdit       {...{ setAttributes, ...props }} />

                <div className={ `${className} align${blockAlignment}` } style={ { textAlign: textAlignment } }>

                    { imgID ? (

                        <div class="image-wrapper">
                            <img
                                className={ 'preview-image' }
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

                        ) : ''
                    }


                    <div className={ imgID ? 'media-form image-added' : 'media-form no-image' }>
                        <div class="media-form-inner">
                            <div class="no-image">
                                { __( 'No Image Selected', 'website-screenshot' ) }
                            </div>

                            <div class="media-upload">
                                <MediaUpload
                        	        onSelect={ onSelectImage }
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
                                    placeholder={ __( 'https://yoursite-url.com', 'website-screenshot' ) }
                                    value={ websiteUrl }
                                    onChange={ websiteUrl => setAttributes( { websiteUrl } ) }
                                />

                                <TextControl
                                    label={ __( 'File Name', 'website-screenshot' ) }
                                    value={ title }
                                    onChange={ title => setAttributes( { title } ) }
                                />

                                <TextControl
                                    label={ __( 'Alt Text', 'website-screenshot' ) }
                                    value={ imgAlt }
                                    onChange={ imgAlt => setAttributes( { imgAlt } ) }
                                />

                                <Button
                        	        className={ "button button-large" }
                                    onClick={ evt => onFetchURL( evt ) }
                                    >
                                    { __( 'Take Screenshot', 'website-screenshot' ) }
                                </Button>

                            </div>
                        </div>

                    </div>

                </div>
            ];
        },


        save: props => {

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
    		    attributes, className, setAttributes, isSelected
    	    } = props;

            let imgClass = 'wp-block-image';
            console.log( 'blockAlignment', blockAlignment );
            if ( blockAlignment ) {
                imgClass += ' align'+blockAlignment;
            }


            if ( ! imgURL  ) {
                return  (
                    <div data-id={ imgID } className={ className }>
                    </div>
                )
            }


            return (

                <div data-id={ imgID } className={ className }>
                    <img
                        className={ imgClass }
                        src={ imgURL }
                        alt={ imgAlt }
                    />
                </div>

            );
        },
    },
);
