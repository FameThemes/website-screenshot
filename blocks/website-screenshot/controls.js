/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    AlignmentToolbar,
    BlockControls,
    BlockAlignmentToolbar,
} = wp.editor;


/**
 * Create a Block Controls wrapper Component
 */
export default class Inspector extends Component {

    constructor() {
        super( ...arguments );
    }
    render() {
        const { attributes: { blockAlignment, textAlignment }, setAttributes } = this.props;

    
        const onChangeBlockAlignment = ( newAlignment ) => {
            setAttributes( { blockAlignment: newAlignment === undefined ? 'none' : newAlignment } );
        };

        return (
            <BlockControls>
                <BlockAlignmentToolbar
                    value={ blockAlignment }
                    onChange={ onChangeBlockAlignment }
                />
            </BlockControls>
        );
    }
}
