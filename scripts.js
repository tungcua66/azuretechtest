import  loadFeed  from './helpers/loadFeed.js';
import  loadMessaging  from './helpers/loadMessaging.js';
import  loadConversationDetails  from './helpers/loadConversationDetails.js';
import  loadFriends  from './helpers/loadFriends.js';

document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    let friendsData = {};
    let currentConversation = null;
    let messagesData = {};

    const getDragAfterElement = (container, y) => {
        const draggableElements = [...container.querySelectorAll('.friend:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    const loadPage = (page) => {
        switch (page) {
            case 'feed':
                loadFeed();
                break;
            case 'messaging':
                loadMessaging(content, messagesData);
                break;
            case 'friends':
                loadFriends(content, friendsData, loadConversationDetails);
                break;
            default:
                loadFeed();
        }
    }

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = event.target.getAttribute('data-page');
            loadPage(page);
        });
    });

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            loadPage(event.state.page);
        } else {
            loadPage('feed');
        }
    });

    // Load the default page (feed) on initial load
    loadPage('feed');

    // Load conversation details if on messageDetail.html
    const urlParams = new URLSearchParams(window.location.search);
    const conversationName = urlParams.get('conversation');
    if (conversationName) {
        loadConversationDetails({ name: conversationName, file: `./mocks/${conversationName.toLowerCase().replace(' ', '_')}_messages.json` });
    }
});