import Parse from 'parse';

const app_id = import.meta.env.REACT_APP_PARSE_APP_ID;
const host_url = import.meta.env.REACT_APP_PARSE_HOST_URL;
const js_key = import.meta.env.REACT_APP_PARSE_JS_KEY;
 
const initializeParse = (serverURL, applicationId, javascriptKey) => {
    Parse.serverURL = serverURL;
    Parse.initialize(applicationId, javascriptKey);
    Parse.enableLocalDatastore(); // Enable if needed
};

// Call the initializeParse function with your Parse server details
initializeParse(host_url, app_id, js_key);