
/**
  * Block dependencies
  */
 import classnames from 'classnames';
 import Inspector from './inspector';
 import Controls from './controls';
 import Helper from "./helper";
 import icons from './icons';
 //import icon from './icon';
 import attributes from './attributes';
 import './style.scss';
 import './editor.scss';


import {
    get,
    isEmpty,
    map,
    pick,
    times,
    startCase,
} from 'lodash';

//window.lodash = _.noConflict();


const { withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

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
     mediaUpload,
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


const ALLOWED_MEDIA_TYPES = [ 'image' ];

class ImageEdit extends Component {
	constructor() {
		super( ...arguments );
        this.onSelectImage = this.onSelectImage.bind( this );
        this.onRemoveImage = this.onRemoveImage.bind( this );
        this.onFetchURL = this.onFetchURL.bind( this );
	}

     onSelectImage ( img ) {
        const { setAttributes } = this.props;
        setAttributes( {
            imgID: img.id,
            imgURL: img.url,
            imgAlt: img.alt,
        } );
    }


    onRemoveImage () {
        const { setAttributes } = this.props;
        setAttributes({
            imgID: 0,
            imgURL: '',
            imgAlt: '',
        });
    };


    async onFetchURL( evt ) {
        evt.preventDefault();

        let button = evt.target;

        const props = this.props;

        const {
            attributes: {
                websiteUrl,
                title,
                imgID,
                imgURL,
                imgAlt,
            },
            className, setAttributes, attributes
        } = props;

        if ( button.classList.contains('is-loading') ) {
            //return false;
            return ;
        }

        button.classList.add("is-loading");
        //button.setAttribute("disabled", "");

        let settingValues = Helper.getSettingsValue( attributes );
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
        button.classList.remove("is-loading");
        //button.removeAttribute("disabled");
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

       console.log( 'settings', Helper.getSettingsValue( attributes ) );

    }

	render () {

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
        } = this.props;

        let settings = Helper.getSettings( attributes );
        let values = Helper.getSettingsValue( attributes );

        return [
            <Inspector  {...{ setAttributes, ...this.props }} />,
            <Controls   {...{ setAttributes, ...this.props }} />,

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
                            onClick={ this.onRemoveImage }
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
                                onClick={ evt => this.onFetchURL( evt ) }
                                >
                                { __( 'Take Screenshot', 'website-screenshot' ) }
                            </Button>

                        </div>
                    </div>

                </div>

            </div>
        ];



		/* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
	}
}


export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { getEditorSettings } = select( 'core/editor' );
		const { imgID } = props.attributes;


		return {
			image: imgID ? getMedia( imgID ) : null,

		};
	} )
] )( ImageEdit );
