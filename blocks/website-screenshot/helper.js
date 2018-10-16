const Helper = {

    getSettings: attributes => {

        let settings = [];
        for( let attribute in attributes ) {
            let value = attributes[ attribute ];
            if( 'boolean' === typeof attributes[ attribute ] ) {
                value = value.toString();
            }
            settings.push( <li>{ attribute }: { value }</li> );
        }
        return settings;

    },


    getSettingsValue: ( attributes ) => {
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

};


export default Helper;
