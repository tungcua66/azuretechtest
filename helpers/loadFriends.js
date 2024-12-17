import  loadConversationDetails  from './loadConversationDetails.js';
import {formatDate} from '../utils/formatDate.js';

 const loadFriends = (content, friendsData, messagesData) => {
    fetch('./mocks/friends.json')
        .then(response => response.json())
        .then(friends => {
            friendsData = friends.reduce((acc, friend) => {
                acc[`${friend.firstname} ${friend.lastname}`] = friend.avatar;
                return acc;
            }, {});

            const friendsList = document.createElement('ul');
            friendsList.id = 'friends-list';
            friends.forEach(friend => {
                const friendElement = document.createElement('li');
                friendElement.className = 'friend';
                friendElement.draggable = true;
                friendElement.innerHTML = `
                    <img src="${friend.avatar}" alt="${friend.firstname} ${friend.lastname}" class="avatar">
                    <span>${friend.firstname} ${friend.lastname}</span>
                    <button class="message">Message</button>
                `;
                friendElement.querySelector('.message').addEventListener('click', () => {
                    const conversation = {
                        name: `${friend.firstname} ${friend.lastname}`,
                        file: `./mocks/${friend.firstname.toLowerCase()}_${friend.lastname.toLowerCase()}_messages.json`,
                        avatar: friend.avatar
                    };
                    loadConversationDetails(content, conversation, messagesData, friendsData, formatDate);
                });

                // Add drag and drop event listeners
                friendElement.addEventListener('dragstart', (event) => {
                    event.dataTransfer.setData('text/plain', friendElement.id);
                    friendElement.classList.add('dragging');
                });

                friendElement.addEventListener('dragend', () => {
                    friendElement.classList.remove('dragging');
                });

                friendsList.appendChild(friendElement);
            });

            friendsList.addEventListener('dragover', (event) => {
                event.preventDefault();
                const draggingElement = document.querySelector('.dragging');
                const afterElement = getDragAfterElement(friendsList, event.clientY);
                if (afterElement == null) {
                    friendsList.appendChild(draggingElement);
                } else {
                    friendsList.insertBefore(draggingElement, afterElement);
                }
            });

            content.innerHTML = '';
            content.appendChild(friendsList);

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.id = 'search';
            searchInput.placeholder = 'Search friends...';
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredFriends = friends.filter(friend => `${friend.firstname} ${friend.lastname}`.toLowerCase().includes(searchTerm));
                friendsList.innerHTML = '';
                filteredFriends.forEach(friend => {
                    const friendElement = document.createElement('li');
                    friendElement.className = 'friend';
                    friendElement.draggable = true; // Make the friend element draggable
                    friendElement.innerHTML = `
                        <img src="${friend.avatar}" alt="${friend.firstname} ${friend.lastname}" class="avatar">
                        <span>${friend.firstname} ${friend.lastname}</span>
                        <button class="message">Message</button>
                    `;
                    friendElement.querySelector('.message').addEventListener('click', () => {
                        const conversation = {
                            name: `${friend.firstname} ${friend.lastname}`,
                            file: `./mocks/${friend.firstname.toLowerCase()}_${friend.lastname.toLowerCase()}_messages.json`,
                            avatar: friend.avatar
                        };
                        loadConversationDetails(content, conversation, messagesData, friendsData, formatDate);
                    });

                    // Add drag and drop event listeners
                    friendElement.addEventListener('dragstart', (event) => {
                        event.dataTransfer.setData('text/plain', friendElement.id);
                        friendElement.classList.add('dragging');
                    });

                    friendElement.addEventListener('dragend', () => {
                        friendElement.classList.remove('dragging');
                    });

                    friendsList.appendChild(friendElement);
                });
            });
            content.prepend(searchInput);
        })
        .catch(error => console.error('Error fetching friends:', error));
}

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
};

export default loadFriends;