// Constant Variables
const GITHUB_API_URL = 'https://api.github.com/users/'
const LOADING_SVG = `<svg version="1.1" id="loading-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
    <path fill="#000" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
    <animateTransform 
        attributeName="transform" 
        attributeType="XML" 
        type="rotate"
        dur="1s" 
        from="0 50 50"
        to="360 50 50" 
        repeatCount="indefinite" />
</path>
</svg>`

/**
 * function to get GitHub username and return user information details
 * 
 * @param {string} username 
 * @returns Object
 */
async function get_gh_info(username) {

    let final_url = `${GITHUB_API_URL}${username}`
    let result = await fetch(final_url)
    .then((response) => {
        if (!response.ok) {
            throw new Error('There something wrong! Please try again.');
        }
        return response.json();
    })
    .then((json_data) => {
        return json_data;
    })
    .catch((error) => {
        show_notification(`${error}`, 'error');
    })

    return result;
}

/**
 * function to show error notification
 * 
 * @param {string} message 
 * @param {string} class_type
 */
function show_notification(message_text, class_type) {

    // check if there is an error notification, first remove it
    // then add new error notification
    remove_notification();

    // create div block for notification
    const div_block = document.createElement("div");
    div_block.className = `notification ${class_type}`;
    div_block.id = "notification";

    // create paragraph element to embed the text notification
    const paragraph = document.createElement("p");
    paragraph.className = "text-notification";
    div_block.appendChild(paragraph);

    const close_button = document.createElement("span");
    close_button.id = 'close-notification';
    close_button.innerHTML = 'X';
    close_button.addEventListener('click', () => {div_block.remove();});
    div_block.appendChild(close_button);

    // create message text based on error message
    const message = document.createTextNode(message_text);
    paragraph.appendChild(message);

    // add new element block before main-box element
    let main_container = document.getElementById("main-container");
    let main_box = document.getElementById("main-box");
    main_container.insertBefore(div_block, main_box);

}

/**
 * function to remove error notification if any exists
 */
function remove_notification() {

    const notification_block = document.getElementById("notification");

    if (notification_block !== null) {
        notification_block.remove();
    }
}

/**
 * function to get the GitHub api object and update element values
 * 
 * @param {Object} gh_info 
 */
function update_info(gh_info) {

    let profile_picture = document.getElementById("profile-picture");
    let name            = document.getElementById("name");
    let blog           = document.getElementById("blog");
    let location        = document.getElementById("location");
    let bio             = document.getElementById("bio");

    // Update profile-picture
    if (profile_picture) {    
        if (Object.hasOwn(gh_info, "avatar_url") & gh_info.avatar_url !== null) {
            profile_picture.src = gh_info.avatar_url;
        } else {
            // user does not have any user profile picture
            // so we can set a default user picture
            profile_picture.src = "https://picsum.photos/200";
        }}

    // Update name
    if (name) {    
        if (Object.hasOwn(gh_info, "name") & (gh_info.name !== null & gh_info.name !== '')) {
            name.innerText = gh_info.name;
        } else {
            // user does not have any name
            name.innerText = "-";
        }}

    // Update blog
    if (blog) {    
        if (Object.hasOwn(gh_info, "blog") & (gh_info.blog !== null & gh_info.blog !== '')) {
            blog.innerText = gh_info.blog;
        } else {
            // user does not have any blog
            blog.innerText = "-";
        }}

    // Update location
    if (location) {    
        if (Object.hasOwn(gh_info, "location") & (gh_info.location !== null & gh_info.location !== '')) {
            location.innerText = gh_info.location;
        } else {
            // user does not have any location
            location.innerText = "-";
        }}

    // Update bio
    if (bio) {
        if (Object.hasOwn(gh_info, "bio") & (gh_info.bio !== null & gh_info.bio !== '')) {
            bio.innerText = gh_info.bio;
        } else {
            // user does not have any bio
            bio.innerText = "-";
        }
    }
}

/**
 * Listener for clicking submit button
 */
async function submit_action() {

    const text_field    = document.getElementById("text-field")
    const submit        = document.getElementById("submit")

    submit.innerHTML = LOADING_SVG;
    let username = text_field.value;

    try {
        remove_notification()

        let cache_result = load_from_local_storage(username);
        if (cache_result !== null) {
            update_info(cache_result);
            show_notification(`\"${username}\" found in LocalStorage`, 'info');

        } else {
            let result = await get_gh_info(username);
            cache_in_local_storage(result);
            update_info(result);
        }
        submit.innerText = "submit"

    } catch (error) {
        submit.innerText = "submit"
    }
}


/**
 * function to handle submit when entering on text field
 * @param {Event} e 
 */
function search(e) {
    e = e || window.event;
    if (e.keyCode == 13) {
        console.log('Enter...');
        submit_action();
    }
}

/**
 * Cache Github user information in LocalStorage
 * 
 * @param {Object} api_result 
 */
function cache_in_local_storage(api_result) {
    
    let username = api_result.login ? api_result.login.toLowerCase() : "";
    if (localStorage.getItem(username) === null) {
        localStorage.setItem(`${username}`, 'active');
        localStorage.setItem(`${username}_avatar_url`, `${api_result.avatar_url !== null ? api_result.avatar_url : '-'}`);
        localStorage.setItem(`${username}_name`, `${api_result.name !== null ? api_result.name : '-'}`);
        localStorage.setItem(`${username}_blog`, `${api_result.blog !== null ? api_result.blog : '-'}`);
        localStorage.setItem(`${username}_location`, `${api_result.location !== null ? api_result.location : '-'}`);
        localStorage.setItem(`${username}_bio`, `${api_result.bio !== null ? api_result.bio : '-'}`);
    }
}

/**
 * function to load data from LocalStorage
 * 
 * @param {String} username 
 * @returns Object | null
 */
function load_from_local_storage(username) {
    let result = null;

    lower_username = username.toLowerCase()
    if (localStorage.getItem(lower_username) !== null) {
        result = {
            'avatar_url': localStorage.getItem(`${lower_username}_avatar_url`),
            'name'      : localStorage.getItem(`${lower_username}_name`),
            'blog'      : localStorage.getItem(`${lower_username}_blog`),
            'location'  : localStorage.getItem(`${lower_username}_location`),
            'bio'       : localStorage.getItem(`${lower_username}_bio`)
        }
    }

    return result
}

// add event listener on textfield and submit button
const submit_button = document.getElementById("submit");
const text_field = document.getElementById("text-field");
submit_button.addEventListener('click', () => {submit_action()});
text_field.addEventListener('keydown', (e) => {search(e)})