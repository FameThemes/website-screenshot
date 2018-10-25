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

import edit from './edit';

const { withSelect } = wp.data;
const { compose } = wp.compose;


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


/**
 * Register static block example block
 */
registerBlockType(
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


        edit,


        save: props => {

            const {
                attributes: {
        		    websiteUrl,
        		    imgID,
        		    imgURL,
        		    imgAlt,
        		    textAlignment,
                    blockAlignment,
                    url
                },
    		    attributes, className, setAttributes, isSelected
    	    } = props;

            let imgClass = 'wp-block-image';
           // let imgClass = 'wp-block-image';

            if ( blockAlignment ) {
                imgClass += ' align'+blockAlignment;
            }

            if ( ! imgURL ) {
                return  (
                    <div data-id={ imgID } className={ className }>
                    </div>
                )
            }

            const image = (
                        <figure className={ imgClass }>
                            <img
                                src={ imgURL }
                                alt={ imgAlt }
                            />
                        </figure>
                    );
            return (
                <div data-id={ imgID } className={ className }>
                { url ? <a href={ url }>{ image }</a>: image }
                </div>
            );

        },


        deprecated: [
        {
            attributes,

            save( props ) {


                const {
                    attributes: {
                        websiteUrl,
                        imgID,
                        imgURL,
                        imgAlt,
                        textAlignment,
                        blockAlignment,
                        url
                    },
                    attributes, className, setAttributes, isSelected
                } = props;

                let imgClass = 'wp-block-image';

                if ( blockAlignment ) {
                    imgClass += ' align'+blockAlignment;
                }

                if ( ! imgURL ) {
                    return  (
                        <div data-id={ imgID } className={ className }>
                        </div>
                    )
                }

                const image = (
                                <img className={ imgClass }
                                    src={ imgURL }
                                    alt={ imgAlt }
                                />
                            );
                return (
                    <div data-id={ imgID } className={ className }>
                    { url ? <a href={ url }>{ image }</a>: image }
                    </div>
                );

            },


        }
    ]


    },
);
