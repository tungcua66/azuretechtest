document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');

    const loadFeed = () => {
        fetch('posts.json')
            .then(response => response.json())
            .then(posts => {
                const feed = document.createElement('div');
                feed.id = 'feed';
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'post';
                    postElement.innerHTML = `
                        <h3>${post.title}</h3>
                        <p>${post.content}</p>
                        ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ''}
                        <div class="reactions">
                            <button class="like">Like</button>
                            <button class="dislike">Dislike</button>
                            <button class="love">Love</button>
                        </div>
                    `;
                    feed.appendChild(postElement);
                });
                content.innerHTML = '';
                content.appendChild(feed);
            });
    }

    const loadMessaging = () => {
        fetch('conversations.json')
            .then(response => response.json())
            .then(conversations => {
                const conversationsDiv = document.createElement('div');
                conversationsDiv.id = 'conversations';
                conversations.forEach(conversation => {
                    const conversationElement = document.createElement('div');
                    conversationElement.className = 'conversation';
                    conversationElement.innerHTML = `
                        <h3>${conversation.name}</h3>
                        <p>${conversation.lastMessage}</p>
                    `;
                    conversationsDiv.appendChild(conversationElement);
                });
                content.innerHTML = '';
                content.appendChild(conversationsDiv);
            });
    }

    const loadFriends = () => {
        const friends = [
            { name: 'John Doe' },
            { name: 'Jane Smith' },
            { name: 'Alice Johnson' },
        ];

        const friendsList = document.createElement('ul');
        friendsList.id = 'friends-list';
        friends.forEach(friend => {
            const friendElement = document.createElement('li');
            friendElement.className = 'friend';
            friendElement.innerHTML = `
                <span>${friend.name}</span>
                <button class="message">Message</button>
            `;
            friendsList.appendChild(friendElement);
        });
        content.innerHTML = '';
        content.appendChild(friendsList);

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'search';
        searchInput.placeholder = 'Search friends...';
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredFriends = friends.filter(friend => friend.name.toLowerCase().includes(searchTerm));
            friendsList.innerHTML = '';
            filteredFriends.forEach(friend => {
                const friendElement = document.createElement('li');
                friendElement.className = 'friend';
                friendElement.innerHTML = `
                    <span>${friend.name}</span>
                    <button class="message">Message</button>
                `;
                friendsList.appendChild(friendElement);
            });
        });
        content.prepend(searchInput);
    }

    const loadPage = (page) => {
        console.log('page', page);
        if (page === 'feed') {
            loadFeed();
        } else if (page === 'messaging') {
            loadMessaging();
        } else if (page === 'friends') {
            loadFriends();
        }
    }

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = event.target.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Load the default page (feed) on initial load
    loadPage('feed');
});