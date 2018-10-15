const attributes = {
    websiteUrl: {
        type: 'string',
        default: ''
    },
    title: {
        default: '',
        type: 'string',
    },
    imgURL: {
        default: '',
        type: 'string',
        //source: 'children',
        //attribute: 'src',
        //selector: 'img',
    },
    imgID: {
        type: 'number',
        default: null
        //source: 'attribute',
        //attribute: 'data-id',
    },
    imgAlt: {
        default: '',
        type: 'string',
        //source: 'children',
        //attribute: 'alt',
        //selector: 'img',
    },
    viewportWidth: {
        type: 'number',
        default: null,
    },
    viewportHeight: {
        type: 'number',
        default: null,
    },

    blockAlignment: {
        type: 'string',
        default: 'none'
    },

    delay: {
        type: 'number',
        default: null,
    },

    delay: {
        type: 'number',
        default: null,
    },

    full: {
        type: 'boolean',
        default: null,
    },

};

export default attributes;
