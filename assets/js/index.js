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
        show_error_notification(`${error}`);
    })

    return result;
}

/**
 * function to show error notification
 * 
 * @param {string} err_message 
 */
function show_error_notification(err_message) {

    // check if there is an error notification, first remove it
    // then add new error notification
    remove_error_notification()

    // create div block for notification
    const div_block = document.createElement("div");
    div_block.className = "notification error";
    div_block.id = "notification";

    // create paragraph element to embed the text notification
    const paragraph = document.createElement("p");
    paragraph.className = "text-notification";
    div_block.appendChild(paragraph);

    // create message text based on error message
    const message = document.createTextNode(`${err_message}`);
    paragraph.appendChild(message);

    // add new element block before main-box element
    let main_container = document.getElementById("main-container");
    let main_box = document.getElementById("main-box");
    main_container.insertBefore(div_block, main_box);
}

/**
 * function to remove error notification if any exists
 */
function remove_error_notification() {

    const notification_block = document.getElementById("notification");

    if ( notification_block !== null) {
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
        if (Object.hasOwn(gh_info, "name") & gh_info.name !== null) {
            name.innerText = gh_info.name;
        } else {
            // user does not have any name
            name.innerText = "-";
        }}

    // Update blog
    if (blog) {    
        if (Object.hasOwn(gh_info, "blog") & gh_info.blog !== null) {
            blog.innerText = gh_info.blog;
        } else {
            // user does not have any blog
            blog.innerText = "-";
        }}

    // Update location
    if (location) {    
        if (Object.hasOwn(gh_info, "location") & gh_info.location !== null) {
            location.innerText = gh_info.location;
        } else {
            // user does not have any location
            location.innerText = "-";
        }}

    // Update bio
    if (bio) {
        if (Object.hasOwn(gh_info, "bio") & gh_info.bio !== null) {
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
        let result = await get_gh_info(username)
        update_info(result)
        submit.innerText = "submit"

    } catch (error) {
        submit.innerText = "submit"
    }
}

const submit_button = document.getElementById("submit");
submit_button.addEventListener('click', () => {submit_action()});