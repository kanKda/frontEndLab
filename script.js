const container = document.getElementById('container');

class User {
    constructor(avatar, name, address, contacts) {
        this.avatar = avatar;
        this.name = name;
        this.address = address;
        this.contacts = contacts;
    }

    generatePreview() {
        const block = document.createElement('div');
        const avatar = document.createElement('img');
        const name = document.createElement('p');
        block.classList.add('user-preview');
        avatar.classList.add('user-preview__avatar');
        avatar.src = this.avatar.large;
        name.classList.add('user-preview__name');
        name.innerHTML = `${this.name.title} ${this.name.first} ${this.name.last}`;
        block.append(avatar);
        block.append(name);
        block.addEventListener('click', () => {
            const topBlock = document.createElement('div');
            const userInfo = this.generateInfo(avatar, name);
            const exitInfoBtn = document.createElement('div');
            topBlock.classList.add('container_blur');
            topBlock.style.top = `${container.scrollTop}px`;
            container.classList.add('users_blurred');
            topBlock.append(userInfo);
            container.prepend(topBlock);
            exitInfoBtn.classList.add('user-info__exitBtn');
            userInfo.append(exitInfoBtn);
            exitInfoBtn.onclick = function() {
                container.classList.remove('users_blurred');
                block.append(avatar);
                block.append(name);
                topBlock.remove();
            }
        })
        return block;
    }

    generateInfo(avatar, name) {
        const block = document.createElement('div');
        const grid = document.createElement('div');
        block.classList.add('user-info');
        grid.classList.add('user-info__grid');
        block.append(avatar);
        block.append(name);
        for (let obj of [this.address, this.contacts]) {
            for (let key in obj) {
                const tmp = document.createElement('div');
                const field = document.createElement('p');
                const data = document.createElement('p');
                tmp.classList.add('user-info__grid__row');
                field.classList.add('user-info__grid__row__field');
                data.classList.add('user-info__grid__row__data');
                field.innerHTML = `${key}:`;
                data.innerHTML = obj[key];
                tmp.append(field);
                tmp.append(data);
                grid.append(tmp);
            }
        }
        block.append(grid);
        return block;
    }
}

const url = 'https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture';

async function randomUserFactory(url) {
    const response = await fetch(url);
    const data = await response.json();
    const userData = userParse(data.results);
    for (let user in userData) {
        container.append(userData[user].generatePreview());
    }
}

function userParse(data) {
    const result = new Object();
    for (let i = 0; i < data.length; i += 1) {
        result[`UserID_${i}`] = new User(
            data[i].picture, 
            data[i].name, 
            data[i].location, 
            {email: data[i].email, phone: data[i].phone}
        );
    }
    return result;
}

randomUserFactory(url);