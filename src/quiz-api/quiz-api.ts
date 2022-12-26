const URL_BASE: string = "http://localhost:3000/";
const URL_USERS: string = URL_BASE + "users";

export type UserInfo = {
    userName: string,
    password: string
}

export type User = {
    readonly id: number,
    userName: string,
    password: string
}

export const loginUserAPI = async (user: UserInfo): Promise<User> => {
    //const response: Response = await fetch(URL_USERS + `?_page=1&userName=${user.userName}&password=${user.password}&_limit=1`);
    const response: Response = await fetch(URL_USERS);
    if(!response.ok) {
        throw Error("Could not fetch user");
    }
    const users = await response.json() as Promise<User[]>;
    const result = (await users).find((userInList) => {
        if(userInList.userName === user.userName && userInList.password === user.password) {
            return(userInList);
        }
    })
    if(!result) {
        throw Error("Could not find user");
    }
    else {
        return(result);
    }
}

export const addUserAPI = async(newUser: UserInfo): Promise<User> => {
  
    const response = await fetch(URL_USERS, {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
        "Content-Type": "application/json",
        },
    });
    if(!response.ok) {
        throw Error("Could not add user");
    }

    const addedUser = await response.json() as Promise<User>;
    return(addedUser); 
}